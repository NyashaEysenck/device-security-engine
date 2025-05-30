import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { UserPlus, Trash2, ShieldAlert, Shield, RefreshCw, User } from 'lucide-react';
import api from '@/api/axiosInstance';

// Type for user data
interface UserData {
  username: string;
  role: string;
}

const AdminPage = () => {
  const { isAdmin, register } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('observer');

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Admin access required');
    } else {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) {
      toast.error('Username and password are required');
      return;
    }
    try {
      await register(newUserEmail, newUserPassword, newUserRole);
      toast.success(`User ${newUserEmail} created successfully`);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('observer');
      fetchUsers();
    } catch {
      toast.error('Error creating user');
    }
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await api.delete(`/auth/users/${username}`);
      toast.success(`User ${username} deleted successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error deleting user');
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Username</Label>
              <Input
                type="text"
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={newUserPassword}
                onChange={e => setNewUserPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                value={newUserRole}
                onChange={e => setNewUserRole(e.target.value)}
                className="cyber-input"
              >
                <option value="observer">Observer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" className="bg-cyber-accent hover:bg-opacity-80">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <p>Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {user.role === 'admin' ? (
                            <ShieldAlert className="h-4 w-4 text-cyber-accent mr-1" />
                          ) : (
                            <Shield className="h-4 w-4 text-muted-foreground mr-1" />
                          )}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.username)}
                          className="text-cyber-danger"
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cyber-background p-4 rounded-lg border border-cyber-border">
              <h4 className="font-medium mb-2">Administrator</h4>
              <p className="text-sm text-muted-foreground mb-2">Full system access</p>
              <div className="space-y-1 text-sm">
                <div>✓ View dashboard and data</div>
                <div>✓ Configure system settings</div>
                <div>✓ Run attack simulations</div>
                <div>✓ Manage users and permissions</div>
              </div>
            </div>
            <div className="bg-cyber-background p-4 rounded-lg border border-cyber-border">
              <h4 className="font-medium mb-2">Observer</h4>
              <p className="text-sm text-muted-foreground mb-2">Limited view access</p>
              <div className="space-y-1 text-sm">
                <div>✓ View dashboard and data</div>
                <div>✓ View network status</div>
                <div>✓ View logs</div>
                <div>✗ No attack simulation capabilities</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
