import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  Globe,
  BarChart3,
  ExternalLink,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";

interface CrawlSession {
  sessionId: string;
  url: string;
  status: string;
  startTime: string;
  endTime: string;
  stats: {
    totalPages: number;
    totalLinks: number;
    totalTime: number;
    avgResponseTime: number;
    errorCount: number;
    successRate: number;
  };
}

export default function Sessions() {
  const [sessions, setSessions] = useState<CrawlSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/crawl/sessions");
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    // In a real app, you'd have a delete endpoint
    setSessions(sessions.filter((s) => s.sessionId !== sessionId));
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "stopped":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "running":
        return "secondary";
      case "stopped":
        return "outline";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sessions...</p>
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
              <h1 className="text-2xl font-bold text-foreground">
                Crawl Sessions
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and view your crawling sessions
              </p>
            </div>
            <Link to="/">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                New Crawl
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Sessions Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {sessions.length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {sessions.filter((s) => s.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Pages
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {sessions.reduce((sum, s) => sum + s.stats.totalPages, 0)}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              View and manage your web crawling sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first web crawl to see results here.
                </p>
                <Link to="/">
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Start Crawling
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.sessionId}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(session.status)}
                          <Badge
                            variant={getStatusColor(session.status) as any}
                          >
                            {session.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate">
                          <a
                            href={session.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {session.url}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <time className="text-sm text-muted-foreground">
                          {formatDate(session.startTime)}
                        </time>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDuration(session.stats.totalTime)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {session.stats.totalPages}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {session.stats.totalLinks}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            session.stats.successRate > 90
                              ? "default"
                              : "outline"
                          }
                        >
                          {session.stats.successRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link to={`/results?session=${session.sessionId}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteSession(session.sessionId)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
