
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from '@/utils/apiService';
import { Key } from 'lucide-react';

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = apiService.getApiKey();
    setHasKey(!!storedKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      apiService.setApiKey(apiKey.trim());
      setHasKey(true);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={hasKey ? "ghost" : "secondary"} size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          {hasKey ? 'API Key Saved' : 'Set API Key'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to connect to GPT-4 or GPT-4o for enhanced business analysis.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="col-span-3"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!apiKey.trim()}>Save API Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyForm;
