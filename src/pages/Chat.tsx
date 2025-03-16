
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import UploadForm from "@/components/UploadForm";
import ChatInterface from "@/components/ChatInterface";
import ApiKeyForm from "@/components/ApiKeyForm";
import TransitionWrapper from '@/components/TransitionWrapper';
import { apiService } from '@/utils/apiService';

const Chat = () => {
  const [hasDocuments, setHasDocuments] = useState(false);
  
  useEffect(() => {
    const checkDocuments = async () => {
      const documents = await apiService.getDocuments();
      setHasDocuments(documents.length > 0);
    };
    
    checkDocuments();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 px-6 md:px-8 pb-10">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-semibold">Business Analysis</h1>
              <ApiKeyForm />
            </div>
            <p className="text-muted-foreground mb-8">
              Upload your documents and chat with your AI business expert
            </p>
          </TransitionWrapper>
          
          <Tabs defaultValue={hasDocuments ? "chat" : "upload"} className="w-full">
            <TransitionWrapper animation="slide-up" delay={100}>
              <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="chat" disabled={!hasDocuments}>Analysis</TabsTrigger>
              </TabsList>
            </TransitionWrapper>
            
            <TabsContent value="upload" className="pt-4">
              <UploadForm />
            </TabsContent>
            
            <TabsContent value="chat" className="pt-4">
              {hasDocuments ? (
                <div className="glass-card rounded-2xl overflow-hidden border h-[calc(100vh-16rem)] min-h-[500px]">
                  <ChatInterface />
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">
                    Please upload documents first to start the analysis.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Chat;
