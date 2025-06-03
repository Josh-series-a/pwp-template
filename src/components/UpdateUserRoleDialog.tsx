import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const UpdateUserRoleDialog = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('User');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Updating user role:', { email, newRole });

      // Get the user by email
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        throw new Error(listError.message);
      }

      const user = usersData.users.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update the user's metadata
      const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          role: newRole
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('User role updated successfully:', data);
      toast.success(`User ${email} role updated to ${newRole} successfully!`);
      
      // Reset form and close dialog
      setEmail('');
      setNewRole('User');
      setOpen(false);
    } catch (error: any) {
      console.error('Failed to update user role:', error);
      toast.error(error.message || 'Failed to update user role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Update User Role</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogDescription>
            Update an existing user's role in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserRoleDialog;
