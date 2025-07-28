
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Plus, Eye } from 'lucide-react';
import { creditService, type UserCredits, type CreditTransaction } from '@/utils/creditService';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreditsDisplayProps {
  showDetails?: boolean;
  className?: string;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);

  const fetchCredits = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const userCredits = await creditService.getUserCredits(user.id);
    setCredits(userCredits);
    
    if (showDetails) {
      const userTransactions = await creditService.getCreditTransactions(user.id);
      setTransactions(userTransactions);
    }
    
    setIsLoading(false);
  };

  if (!user || isLoading) {
    return (
      <Badge variant="outline" className={className}>
        <Coins className="h-3 w-3" />
      </Badge>
    );
  }

  if (!credits) {
    return (
      <Badge variant="destructive" className={className}>
        <Coins className="h-3 w-3" />
      </Badge>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showDetails) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Coins className="h-5 w-5 text-yellow-600" />
            Available Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{credits.credits}</div>
              <div className="text-sm text-muted-foreground">Credits Available</div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Credit Transaction History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="space-y-2">
                    {transactions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No transactions yet
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
          <div className="text-sm text-muted-foreground">
            Last updated {formatDate(credits.updated_at)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Badge variant="outline" className={`${className} px-2 py-1`}>
      <Coins className="h-3 w-3 text-yellow-600" />
      <span className="font-medium">{credits.credits}</span>
    </Badge>
  );
};

export default CreditsDisplay;
