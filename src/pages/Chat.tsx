import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadForm from "@/components/UploadForm";
import ChatInterface from "@/components/ChatInterface";
import ApiKeyForm from "@/components/ApiKeyForm";
import TransitionWrapper from '@/components/TransitionWrapper';
import { apiService } from '@/utils/apiService';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const [hasDocuments, setHasDocuments] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const location = useLocation();
  
  // Check if coming from a button click with state
  useEffect(() => {
    if (location.state?.startAnalysis) {
      checkDocumentsAndSetTab();
    }
  }, [location.state]);
  
  useEffect(() => {
    checkDocumentsAndSetTab();
  }, []);
  
  const checkDocumentsAndSetTab = async () => {
    const documents = await apiService.getDocuments();
    const hasAnyDocuments = documents.length > 0;
    setHasDocuments(hasAnyDocuments);
    
    // If there are documents and we're trying to start analysis, switch to chat tab
    if (hasAnyDocuments && location.state?.startAnalysis) {
      setActiveTab("chat");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TransitionWrapper animation="slide-up" delay={100}>
              <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="chat" disabled={!hasDocuments}>Analysis</TabsTrigger>
              </TabsList>
            </TransitionWrapper>
            
            <TabsContent value="upload" className="pt-4">
              <UploadForm onDocumentUpload={checkDocumentsAndSetTab} />
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
