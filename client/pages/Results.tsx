import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Download, 
  Filter,
  ExternalLink,
  FileText,
  Image,
  Link,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Globe,
  Database,
  Zap
} from 'lucide-react';

interface CrawlResult {
  url: string;
  title: string;
  description: string;
  content: string;
  links: string[];
  images: string[];
  metadata: {
    statusCode: number;
    contentType: string;
    contentLength: number;
    lastModified: string;
    depth: number;
  };
  responseTime: number;
  crawledAt: string;
  error?: string;
}

interface CrawlSession {
  sessionId: string;
  config: any;
  results: CrawlResult[];
  stats: {
    totalPages: number;
    totalLinks: number;
    totalTime: number;
    avgResponseTime: number;
    errorCount: number;
    successRate: number;
  };
  startTime: string;
  endTime: string;
  status: string;
}

export default function Results() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [session, setSession] = useState<CrawlSession | null>(null);
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('crawledAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  useEffect(() => {
    if (sessionId) {
      fetchSession(sessionId);
    }
  }, [sessionId]);

  const fetchSession = async (id: string) => {
    try {
      const response = await fetch(`/api/crawl/${id}/status`);
      const data = await response.json();
      if (data.success) {
        setSession(data.session);
        setResults(data.session.results);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = !searchTerm || 
      result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'success' && !result.error) ||
      (filterType === 'error' && result.error) ||
      (filterType === 'html' && result.metadata?.contentType?.includes('html')) ||
      (filterType === 'pdf' && result.url.toLowerCase().includes('.pdf')) ||
      (filterType === 'images' && result.images?.length > 0);

    return matchesSearch && matchesFilter;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'responseTime':
        return b.responseTime - a.responseTime;
      case 'depth':
        return (a.metadata?.depth || 0) - (b.metadata?.depth || 0);
      case 'contentLength':
        return (b.metadata?.contentLength || 0) - (a.metadata?.contentLength || 0);
      default:
        return new Date(b.crawledAt).getTime() - new Date(a.crawledAt).getTime();
    }
  });

  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedResults.length / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading crawl results...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
          <p className="text-muted-foreground">The requested crawl session could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Page Header */}
      <div className="border-b border-border/40 bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Crawl Results</h1>
              <p className="text-sm text-muted-foreground">Session: {sessionId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pages Crawled</p>
                  <p className="text-2xl font-bold text-foreground">{session.stats.totalPages}</p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Links Found</p>
                  <p className="text-2xl font-bold text-foreground">{session.stats.totalLinks}</p>
                </div>
                <Link className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">{session.stats.successRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold text-foreground">{session.stats.avgResponseTime.toFixed(0)}ms</p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by URL, title, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="success">Successful</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="html">HTML Pages</SelectItem>
                  <SelectItem value="pdf">PDF Files</SelectItem>
                  <SelectItem value="images">With Images</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crawledAt">Crawl Time</SelectItem>
                  <SelectItem value="responseTime">Response Time</SelectItem>
                  <SelectItem value="depth">Depth</SelectItem>
                  <SelectItem value="contentLength">Content Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Crawled Pages</CardTitle>
            <CardDescription>
              Showing {paginatedResults.length} of {sortedResults.length} results
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Depth</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {result.error ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-xs truncate">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {result.url}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {result.title || 'No title'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.responseTime}ms
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {result.metadata?.depth || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.links?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.images?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
