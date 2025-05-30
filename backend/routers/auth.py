from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from config import Config
from fastapi import Path

# MongoDB connection
client = MongoClient(Config.MONGODB_URI)
db = client.muchengeti
users_collection = db.users

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Demo config
SECRET_KEY = "supersecretkey"  # In production, use a secure env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class User(BaseModel):
    username: str
    role: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "observer"  # default role

# Utility functions
def get_user_by_username(username: str):
    return users_collection.find_one({"username": username})

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Router
router = APIRouter(prefix="/api/auth", tags=["auth"])
# Registration endpoint
@router.post("/register", status_code=201)
def register_user(register: RegisterRequest):
    if get_user_by_username(register.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    user_doc = {
        "username": register.username,
        "password_hash": get_password_hash(register.password),
        "role": register.role
    }
    users_collection.insert_one(user_doc)
    return {"message": "User registered successfully"}

# Authenticate user
def authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if not user or not verify_password(password, user["password_hash"]):
        return None
    return user

# Create access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Get current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(token_data.username)
    if user is None:
        raise credentials_exception
    return User(username=user["username"], role=user["role"])

# Login endpoint
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User listing for admin page
@router.get("/users", response_model=List[User])
def list_users(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = list(users_collection.find({}, {"_id": 0, "username": 1, "role": 1}))
    return users

# Read users me
@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Delete user endpoint
@router.delete("/users/{username}", status_code=204)
def delete_user(username: str = Path(..., min_length=1), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    if username == current_user.username:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    result = users_collection.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
