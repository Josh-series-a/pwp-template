import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, Plus, Minus, Eye, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { creditService, type UserCredits, type CreditTransaction } from '@/utils/creditService';

interface UserWithCredits {
  id: string;
  name: string;
  email: string;
  credits: number;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  role?: string;
}

const AdminCredits = () => {
  const [users, setUsers] = useState<UserWithCredits[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'remove'>('add');

  useEffect(() => {
    fetchAllUsersWithCredits();
  }, []);

  const fetchAllUsersWithCredits = async () => {
    try {
      setIsLoading(true);
      
      // Get the current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      // Call the edge function to get users using GET method - same as AdminUsers
      const response = await fetch(`https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/admin-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.users) {
        // Get credits for all users
        const { data: credits, error: creditsError } = await supabase
          .from('user_credits')
          .select('*');

        if (creditsError) {
          console.error('Error fetching credits:', creditsError);
          // Don't fail completely, just continue without credits data
        }

        // Get profiles for additional user info
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Don't fail completely, just continue without profile data
        }

        // Combine the data - show ALL users from auth
        const usersWithCredits = data.users.map((authUser: any) => {
          const userCredits = credits?.find(c => c.user_id === authUser.id);
          const userProfile = profiles?.find(p => p.id === authUser.id);
          
          return {
            id: authUser.id,
            name: userProfile?.name || authUser.user_metadata?.name || authUser.user_metadata?.full_name || 'Unknown',
            email: authUser.email || 'No email',
            credits: userCredits?.credits || 0,
            created_at: userCredits?.created_at || authUser.created_at,
            updated_at: userCredits?.updated_at || authUser.updated_at || authUser.created_at,
            email_verified: authUser.email_confirmed_at ? true : false,
            role: authUser.user_metadata?.role || 'User'
          };
        });

        setUsers(usersWithCredits);
      } else {
        console.error('No users data returned');
        toast.error('No users data returned');
      }
    } catch (error) {
      console.error('Error fetching users with credits:', error);
      toast.error('Failed to load users and credits');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTransactions = async (userId: string) => {
    const userTransactions = await creditService.getCreditTransactions(userId);
    setTransactions(userTransactions);
    setSelectedUserId(userId);
  };

  const handleCreditAction = async () => {
    if (!selectedUserId || !creditAmount || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseInt(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      if (actionType === 'add') {
        // Add credits
        const currentUser = users.find(u => u.id === selectedUserId);
        const newCredits = (currentUser?.credits || 0) + amount;

        const { error: updateError } = await supabase
          .from('user_credits')
          .upsert({
            user_id: selectedUserId,
            credits: newCredits
          }, { onConflict: 'user_id' });

        if (updateError) throw updateError;

        // Record transaction
        await supabase
          .from('credit_transactions')
          .insert({
            user_id: selectedUserId,
            amount: amount,
            transaction_type: 'add',
            description,
            feature_type: 'admin_allocation'
          });

        toast.success(`Added ${amount} credits successfully`);
      } else {
        // Remove credits
        const currentCredits = users.find(u => u.id === selectedUserId)?.credits || 0;
        const newCredits = Math.max(0, currentCredits - amount);

        const { error: updateError } = await supabase
          .from('user_credits')
          .upsert({
            user_id: selectedUserId,
            credits: newCredits
          }, { onConflict: 'user_id' });

        if (updateError) throw updateError;

        // Record transaction
        await supabase
          .from('credit_transactions')
          .insert({
            user_id: selectedUserId,
            amount: -amount,
            transaction_type: 'deduct',
            description,
            feature_type: 'admin_deduction'
          });

        toast.success(`Removed ${amount} credits successfully`);
      }

      // Refresh data
      await fetchAllUsersWithCredits();
      if (selectedUserId) {
        await fetchUserTransactions(selectedUserId);
      }

      // Reset form
      setCreditAmount('');
      setDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating credits:', error);
      toast.error('Failed to update credits');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Credits Management">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Credits Management">
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Total users: {users.length}
          </div>
        </div>

        {/* Users Credits Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              All System Users - Credits Management
            </CardTitle>
            <CardDescription>
              View and manage credits for all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.email_verified ? "default" : "secondary"}>
                          {user.email_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Coins className="h-3 w-3 text-yellow-600" />
                          {user.credits}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setActionType('add');
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setActionType('remove');
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchUserTransactions(user.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Credit History - {user.name}</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="max-h-96">
                                <div className="space-y-2">
                                  {transactions.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                      No transactions found
                                    </p>
                                  ) : (
                                    transactions.map((transaction) => (
                                      <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <div>
                                          <p className="font-medium">{transaction.description}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatDate(transaction.created_at)}
                                          </p>
                                        </div>
                                        <Badge 
                                          variant={transaction.transaction_type === 'add' ? 'default' : 'destructive'}
                                          className="font-mono"
                                        >
                                          {transaction.transaction_type === 'add' ? '+' : ''}{transaction.amount}
                                        </Badge>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credit Action Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'add' ? 'Add Credits' : 'Remove Credits'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter credit amount"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  placeholder="Reason for credit adjustment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreditAction}>
                  {actionType === 'add' ? 'Add Credits' : 'Remove Credits'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCredits;
