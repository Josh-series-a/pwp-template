import DashboardLayout from "@/components/DashboardLayout";

const Labs = () => {
  return (
    <DashboardLayout title="Labs">
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4">Testing Environment</h2>
          <p className="text-muted-foreground mb-6">
            This is a dedicated space for testing new features and experiments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Feature Test 1</h3>
              <p className="text-sm text-muted-foreground">
                Placeholder for testing new functionality
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Feature Test 2</h3>
              <p className="text-sm text-muted-foreground">
                Another testing area for experiments
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Feature Test 3</h3>
              <p className="text-sm text-muted-foreground">
                Additional space for testing purposes
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Labs;