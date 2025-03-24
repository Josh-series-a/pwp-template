
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { 
  DownloadCloud, 
  Eye, 
  RefreshCw,
  Share2, 
  Plus
} from 'lucide-react';

const Reports = () => {
  // Mock data for reports - in a real app, this would come from the database
  const reports = [
    { id: 1, title: 'Annual Business Health Check', date: '2023-10-15', company: 'Acme Corp', status: 'Completed' },
    { id: 2, title: 'Quarterly Performance Review', date: '2023-07-22', company: 'Acme Corp', status: 'Completed' },
    { id: 3, title: 'Team Assessment', date: '2023-04-10', company: 'Acme Corp', status: 'Completed' },
    { id: 4, title: 'Growth Strategy Evaluation', date: '2023-01-05', company: 'Acme Corp', status: 'Completed' },
    { id: 5, title: 'Financial Health Analysis', date: '2022-11-18', company: 'Acme Corp', status: 'Completed' },
  ];

  return (
    <DashboardLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            View all your business health checks and analyses
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Run New Analysis
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              All AI-generated evaluations, archived and downloadable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>{report.company}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" asChild title="View">
                          <span><Eye className="h-4 w-4" /></span>
                        </Button>
                        <Button variant="outline" size="icon" asChild title="Download">
                          <span><DownloadCloud className="h-4 w-4" /></span>
                        </Button>
                        <Button variant="outline" size="icon" asChild title="Re-analyze">
                          <span><RefreshCw className="h-4 w-4" /></span>
                        </Button>
                        <Button variant="outline" size="icon" asChild title="Share">
                          <span><Share2 className="h-4 w-4" /></span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run a New Analysis</CardTitle>
            <CardDescription>
              Generate a fresh business health check based on your current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Running a new analysis will assess your business's current health across finance, operations, 
              marketing, and leadership domains. The AI will generate personalized recommendations based on the book's principles.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Start New Business Health Check
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
