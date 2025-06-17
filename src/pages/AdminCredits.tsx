
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coins, Plus, Minus, Eye, Search, RefreshCw, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { creditService, type UserCredits, type CreditTransaction, type HealthScoreCredits } from '@/utils/creditService';

interface UserWithCredits {
  id: string;
  name: string;
  email: string;
  credits: number;
  health_score_credits: number;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  role?: string;
  hasCreditsRecord: boolean;
  hasHealthScoreCreditsRecord: boolean;
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
  const [creditType, setCreditType] = useState<'regular' | 'health_score'>('regular');

  useEffect(() => {
    fetchAllUsersWithCredits();
  }, []);

  const initializeMissingCredits = async () => {
    const usersWithoutCredits = users.filter(user => !user.hasCreditsRecord || !user.hasHealthScoreCreditsRecord);
    
    if (usersWithoutCredits.length > 0) {
      console.log(`Initializing credits for ${usersWithoutCredits.length} users without records`);
      
      for (const user of usersWithoutCredits) {
        if (!user.hasCreditsRecord) {
          await creditService.createUserCredits(user.id, 0);
        }
        if (!user.hasHealthScoreCreditsRecord) {
          await creditService.createHealthScoreCredits(user.id, 5);
        }
      }
      
      toast.success(`Initialized credits for ${usersWithoutCredits.length} users`);
      fetchAllUsersWithCredits(); // Refresh the data
    }
  };

  const resetAllCreditsToZero = async () => {
    try {
      console.log('Resetting all user credits to 0...');
      
      // Update all existing credit records to 0
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits: 0 });

      if (updateError) {
        console.error('Error updating credits:', updateError);
        toast.error('Failed to reset credits');
        return;
      }

      // Update all existing health score credit records to 0
      const { error: updateHealthError } = await supabase
        .from('health_score_credits')
        .update({ health_score_credits: 0 });

      if (updateHealthError) {
        console.error('Error updating health score credits:', updateHealthError);
        toast.error('Failed to reset health score credits');
        return;
      }

      // Record transactions for all users
      const usersWithCredits = users.filter(user => user.hasCreditsRecord && (user.credits > 0 || user.health_score_credits > 0));
      
      for (const user of usersWithCredits) {
        if (user.credits > 0) {
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: user.id,
              amount: -user.credits,
              transaction_type: 'deduct',
              description: 'Admin reset all credits to 0',
              feature_type: 'admin_reset'
            });
        }
        if (user.health_score_credits > 0) {
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: user.id,
              amount: -user.health_score_credits,
              transaction_type: 'deduct',
              description: 'Admin reset all health score credits to 0',
              feature_type: 'admin_reset_health_score'
            });
        }
      }

      toast.success('All user credits have been reset to 0');
      fetchAllUsersWithCredits(); // Refresh the data
    } catch (error) {
      console.error('Error resetting credits:', error);
      toast.error('Failed to reset credits');
    }
  };

  const fetchAllUsersWithCredits = async () => {
    try {
      setIsLoading(true);
      
      // Get the current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      // Call the edge function to get users using GET method
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
        }

        // Get health score credits for all users
        const { data: healthScoreCredits, error: healthScoreCreditsError } = await supabase
          .from('health_score_credits')
          .select('*');

        if (healthScoreCreditsError) {
          console.error('Error fetching health score credits:', healthScoreCreditsError);
        }

        // Get profiles for additional user info
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Combine the data - show ALL users from auth
        const usersWithCredits = data.users.map((authUser: any) => {
          const userCredits = credits?.find(c => c.user_id === authUser.id);
          const userHealthScoreCredits = healthScoreCredits?.find(c => c.user_id === authUser.id);
          const userProfile = profiles?.find(p => p.id === authUser.id);
          
          return {
            id: authUser.id,
            name: userProfile?.name || authUser.user_metadata?.name || authUser.user_metadata?.full_name || 'Unknown',
            email: authUser.email || 'No email',
            credits: userCredits?.credits || 0, // Show 0 if no credits record
            health_score_credits: userHealthScoreCredits?.health_score_credits || 0, // Show 0 if no health score credits record
            created_at: userCredits?.created_at || authUser.created_at,
            updated_at: userCredits?.updated_at || authUser.updated_at || authUser.created_at,
            email_verified: authUser.email_confirmed_at ? true : false,
            role: authUser.user_metadata?.role || 'User',
            hasCreditsRecord: !!userCredits, // Track whether user has a credits record
            hasHealthScoreCreditsRecord: !!userHealthScoreCredits // Track whether user has a health score credits record
          };
        });

        setUsers(usersWithCredits);

        // Check if there are users without credits records and offer to initialize them
        const usersWithoutCredits = usersWithCredits.filter((user: UserWithCredits) => !user.hasCreditsRecord || !user.hasHealthScoreCreditsRecord);
        if (usersWithoutCredits.length > 0) {
          console.log(`Found ${usersWithoutCredits.length} users without credits records`);
        }
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
      if (creditType === 'regular') {
        // Handle regular credits
        if (actionType === 'add') {
          // Add credits
          const currentUser = users.find(u => u.id === selectedUserId);
          const newCredits = (currentUser?.credits || 0) + amount;

          // Check if user has credits record first
          if (currentUser?.hasCreditsRecord) {
            const { error: updateError } = await supabase
              .from('user_credits')
              .update({ credits: newCredits })
              .eq('user_id', selectedUserId);
            
            if (updateError) throw updateError;
          } else {
            // Create new record
            const { error: insertError } = await supabase
              .from('user_credits')
              .insert({
                user_id: selectedUserId,
                credits: newCredits
              });
            
            if (insertError) throw insertError;
          }

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

          // Check if user has credits record first
          const currentUser = users.find(u => u.id === selectedUserId);
          if (currentUser?.hasCreditsRecord) {
            const { error: updateError } = await supabase
              .from('user_credits')
              .update({ credits: newCredits })
              .eq('user_id', selectedUserId);
            
            if (updateError) throw updateError;
          } else {
            // Create new record with reduced amount
            const { error: insertError } = await supabase
              .from('user_credits')
              .insert({
                user_id: selectedUserId,
                credits: newCredits
              });
            
            if (insertError) throw insertError;
          }

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
      } else {
        // Handle health score credits
        if (actionType === 'add') {
          // Add health score credits
          const currentUser = users.find(u => u.id === selectedUserId);
          const newHealthScoreCredits = (currentUser?.health_score_credits || 0) + amount;

          // Check if user has health score credits record first
          if (currentUser?.hasHealthScoreCreditsRecord) {
            const { error: updateError } = await supabase
              .from('health_score_credits')
              .update({ health_score_credits: newHealthScoreCredits })
              .eq('user_id', selectedUserId);
            
            if (updateError) throw updateError;
          } else {
            // Create new record
            const { error: insertError } = await supabase
              .from('health_score_credits')
              .insert({
                user_id: selectedUserId,
                health_score_credits: newHealthScoreCredits
              });
            
            if (insertError) throw insertError;
          }

          // Record transaction
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: selectedUserId,
              amount: amount,
              transaction_type: 'add',
              description,
              feature_type: 'admin_health_score_allocation'
            });

          toast.success(`Added ${amount} health score credits successfully`);
        } else {
          // Remove health score credits
          const currentHealthScoreCredits = users.find(u => u.id === selectedUserId)?.health_score_credits || 0;
          const newHealthScoreCredits = Math.max(0, currentHealthScoreCredits - amount);

          // Check if user has health score credits record first
          const currentUser = users.find(u => u.id === selectedUserId);
          if (currentUser?.hasHealthScoreCreditsRecord) {
            const { error: updateError } = await supabase
              .from('health_score_credits')
              .update({ health_score_credits: newHealthScoreCredits })
              .eq('user_id', selectedUserId);
            
            if (updateError) throw updateError;
          } else {
            // Create new record with reduced amount
            const { error: insertError } = await supabase
              .from('health_score_credits')
              .insert({
                user_id: selectedUserId,
                health_score_credits: newHealthScoreCredits
              });
            
            if (insertError) throw insertError;
          }

          // Record transaction
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: selectedUserId,
              amount: -amount,
              transaction_type: 'deduct',
              description,
              feature_type: 'admin_health_score_deduction'
            });

          toast.success(`Removed ${amount} health score credits successfully`);
        }
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

  const usersWithoutCredits = users.filter(user => !user.hasCreditsRecord || !user.hasHealthScoreCreditsRecord);

  return (
    <AdminLayout title="Credits Management">
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
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
          
          <div className="flex gap-2">
            {usersWithoutCredits.length > 0 && (
              <Button 
                onClick={initializeMissingCredits}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Initialize {usersWithoutCredits.length} Missing Credits
              </Button>
            )}
            <Button 
              onClick={resetAllCreditsToZero}
              variant="destructive"
              size="sm"
            >
              Reset All Credits to 0
            </Button>
            <Button 
              onClick={fetchAllUsersWithCredits}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {usersWithoutCredits.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-4">
              <p className="text-sm text-yellow-800">
                <strong>{usersWithoutCredits.length} users</strong> don't have credits records yet. 
                Click "Initialize Missing Credits" to create records with default credits for these users.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Users Credits Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              All System Users - Credits Management
            </CardTitle>
            <CardDescription>
              View and manage both regular credits and health score credits for all users in the system
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
                    <TableHead>Regular Credits</TableHead>
                    <TableHead>Health Score Credits</TableHead>
                    <TableHead>Record Status</TableHead>
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
                        <Badge 
                          variant={user.hasCreditsRecord ? "outline" : "destructive"} 
                          className="gap-1"
                        >
                          <Coins className="h-3 w-3 text-yellow-600" />
                          {user.credits}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.hasHealthScoreCreditsRecord ? "outline" : "destructive"} 
                          className="gap-1"
                        >
                          <Heart className="h-3 w-3 text-red-600" />
                          {user.health_score_credits}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.hasCreditsRecord ? "default" : "secondary"} className="text-xs">
                            Regular: {user.hasCreditsRecord ? "Has Record" : "No Record"}
                          </Badge>
                          <Badge variant={user.hasHealthScoreCreditsRecord ? "default" : "secondary"} className="text-xs">
                            Health: {user.hasHealthScoreCreditsRecord ? "Has Record" : "No Record"}
                          </Badge>
                        </div>
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
                              setCreditType('regular');
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                            title="Add Regular Credits"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setActionType('remove');
                              setCreditType('regular');
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                            title="Remove Regular Credits"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setActionType('add');
                              setCreditType('health_score');
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 border-red-200"
                            title="Add Health Score Credits"
                          >
                            <Heart className="h-4 w-4 text-red-600" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchUserTransactions(user.id)}
                                className="h-8 w-8 p-0"
                                title="View Transaction History"
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
                                            {formatDate(transaction.created_at)} • {transaction.feature_type}
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
                {actionType === 'add' ? 'Add' : 'Remove'} {creditType === 'regular' ? 'Regular' : 'Health Score'} Credits
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Credit Type</label>
                <Select value={creditType} onValueChange={(value: 'regular' | 'health_score') => setCreditType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Credits</SelectItem>
                    <SelectItem value="health_score">Health Score Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  {actionType === 'add' ? 'Add' : 'Remove'} {creditType === 'regular' ? 'Regular' : 'Health Score'} Credits
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
