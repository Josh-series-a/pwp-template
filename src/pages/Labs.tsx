import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Play, Copy, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Labs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [requestBody, setRequestBody] = useState("");

  const endpoints = [
    {
      value: "package-categories",
      label: "GET /package-categories",
      description: "Retrieve all available package categories",
      method: "GET",
      requiresBody: false
    },
    {
      value: "admin-packages",
      label: "GET /admin-packages", 
      description: "Get all admin-created packages with their documents",
      method: "GET",
      requiresBody: false
    },
    {
      value: "admin-documents",
      label: "GET /admin-documents",
      description: "List all admin documents with detailed information",
      method: "GET", 
      requiresBody: false
    },
    {
      value: "coach-packages",
      label: "GET /coach-packages",
      description: "Access packages created by coaches",
      method: "GET",
      requiresBody: false
    },
    {
      value: "coach-documents", 
      label: "GET /coach-documents",
      description: "List coach-created documents",
      method: "GET",
      requiresBody: false
    },
    {
      value: "all-packages",
      label: "GET /all-packages",
      description: "Combined list of all packages (admin + coach)",
      method: "GET",
      requiresBody: false
    },
    {
      value: "create-package",
      label: "POST /",
      description: "Create a new coach package",
      method: "POST",
      requiresBody: true,
      exampleBody: JSON.stringify({
        name: "Test Package",
        description: "A test package created from Labs",
        color: "#3b82f6",
        text_color: "#ffffff",
        documents: [],
        user_id: "test-user-id",
        reportId: "test-report-id", 
        companyName: "Test Company"
      }, null, 2)
    }
  ];

  const makeApiRequest = async () => {
    if (!selectedEndpoint) {
      toast.error("Please select an endpoint to test");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const endpoint = endpoints.find(e => e.value === selectedEndpoint);
      
      const requestData: any = {
        endpoint: selectedEndpoint,
        method: endpoint?.method || "GET"
      };

      if (endpoint?.requiresBody && requestBody) {
        try {
          requestData.body = JSON.parse(requestBody);
        } catch (error) {
          toast.error("Invalid JSON in request body");
          setLoading(false);
          return;
        }
      }

      console.log('Making request via edge function:', requestData);

      // Use Supabase edge function to make the API call
      const { data, error } = await supabase.functions.invoke('advisorpro-api', {
        body: requestData
      });

      if (error) {
        console.error('Edge function error:', error);
        setResponse({
          error: error.message || "Edge function call failed"
        });
        toast.error(`Edge function error: ${error.message}`);
      } else {
        console.log('Edge function response:', data);
        setResponse(data);
        
        if (data.status && data.status >= 200 && data.status < 300) {
          toast.success("API request successful");
        } else {
          toast.error(`API request failed: ${data.status} ${data.statusText || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Request error:", error);
      setResponse({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      toast.error("Failed to make API request");
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      toast.success("Response copied to clipboard");
    }
  };

  const selectedEndpointDetails = endpoints.find(e => e.value === selectedEndpoint);

  return (
    <DashboardLayout title="Labs">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              AdvisorPro API Testing
              <Badge variant="secondary">v1</Badge>
            </CardTitle>
            <CardDescription>
              Test the AdvisorPro API endpoints in a controlled environment. Base URL: https://api.advisorpro.ai/functions/v1/packages-api
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Configuration */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Endpoint</label>
                  <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an endpoint to test" />
                    </SelectTrigger>
                    <SelectContent>
                      {endpoints.map((endpoint) => (
                        <SelectItem key={endpoint.value} value={endpoint.value}>
                          <div className="flex items-center gap-2">
                            <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className="text-xs">
                              {endpoint.method}
                            </Badge>
                            {endpoint.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedEndpointDetails && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEndpointDetails.description}
                    </p>
                  )}
                </div>

                {selectedEndpointDetails?.requiresBody && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Request Body (JSON)</label>
                    <Textarea
                      placeholder={selectedEndpointDetails.exampleBody || "Enter JSON request body"}
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="font-mono text-sm"
                      rows={12}
                    />
                  </div>
                )}

                <Button 
                  onClick={makeApiRequest} 
                  disabled={loading || !selectedEndpoint}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Making Request...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Test API Endpoint
                    </>
                  )}
                </Button>
              </div>

              {/* Response Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Response</label>
                  {response && (
                    <Button variant="outline" size="sm" onClick={copyResponse}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  )}
                </div>
                
                <Card className="min-h-[400px]">
                  <CardContent className="p-4">
                    {!response ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select an endpoint and click "Test API Endpoint" to see the response
                      </div>
                    ) : (
                      <ScrollArea className="h-[350px]">
                        <div className="space-y-3">
                          {response.error ? (
                            <div className="flex items-center gap-2 text-destructive">
                              <XCircle className="h-4 w-4" />
                              <span className="font-medium">Error</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">
                                {response.status} {response.statusText}
                              </span>
                            </div>
                          )}
                          
                          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                            {JSON.stringify(response, null, 2)}
                          </pre>
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Rate Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 60 requests per minute</li>
                  <li>• 5,000 requests per day</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Bearer token in Authorization header
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Base URL</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  https://api.advisorpro.ai/functions/v1/packages-api
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Labs;