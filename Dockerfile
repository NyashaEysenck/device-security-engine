FROM node:18-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.10-alpine
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --upgrade pip
RUN pip uninstall -y bson || true
RUN pip install -r requirements.txt
COPY backend/ ./
# Copy dist folder to match your FastAPI expectations
COPY --from=frontend /app/dist ../dist
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
