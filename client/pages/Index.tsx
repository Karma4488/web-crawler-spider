import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Globe,
  Zap,
  Database,
  Shield,
  Target,
  Settings,
  Play,
  Pause,
  BarChart3,
  Download,
  Filter,
  Clock,
  Link,
  Search,
  Code,
  FileText,
  Image,
  Video,
} from "lucide-react";

interface CrawlConfig {
  url: string;
  maxDepth: number[];
  maxPages: number[];
  concurrent: number[];
  delay: number[];
  followExternal: boolean;
  respectRobots: boolean;
  userAgent: string;
  timeout: number[];
  fileTypes: string[];
  excludePatterns: string;
  includePatterns: string;
}

export default function Index() {
  const [crawlConfig, setCrawlConfig] = useState<CrawlConfig>({
    url: "",
    maxDepth: [3],
    maxPages: [100],
    concurrent: [5],
    delay: [1000],
    followExternal: false,
    respectRobots: true,
    userAgent: "WebSpider Pro 1.0",
    timeout: [30],
    fileTypes: ["html", "pdf", "doc"],
    excludePatterns: "",
    includePatterns: "",
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleStartCrawl = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/crawl/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crawlConfig),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Crawl failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const stats = [
    { label: "Pages Crawled", value: "12,543", icon: Globe, trend: "+15%" },
    { label: "Links Found", value: "48,291", icon: Link, trend: "+8%" },
    { label: "Data Extracted", value: "2.4GB", icon: Database, trend: "+22%" },
    {
      label: "Active Threads",
      value: crawlConfig.concurrent[0].toString(),
      icon: Zap,
      trend: "Live",
    },
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {stat.trend}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Crawler Configuration
                </CardTitle>
                <CardDescription>
                  Configure your web crawling parameters for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="filters">Filters</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="url">Target URL</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="url"
                          placeholder="https://example.com"
                          value={crawlConfig.url}
                          onChange={(e) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              url: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>
                          Max Crawl Depth: {crawlConfig.maxDepth[0]}
                        </Label>
                        <Slider
                          value={crawlConfig.maxDepth}
                          onValueChange={(value) =>
                            setCrawlConfig({ ...crawlConfig, maxDepth: value })
                          }
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Max Pages: {crawlConfig.maxPages[0]}</Label>
                        <Slider
                          value={crawlConfig.maxPages}
                          onValueChange={(value) =>
                            setCrawlConfig({ ...crawlConfig, maxPages: value })
                          }
                          max={10000}
                          min={10}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Concurrent Requests: {crawlConfig.concurrent[0]}
                        </Label>
                        <Slider
                          value={crawlConfig.concurrent}
                          onValueChange={(value) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              concurrent: value,
                            })
                          }
                          max={20}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Delay (ms): {crawlConfig.delay[0]}</Label>
                        <Slider
                          value={crawlConfig.delay}
                          onValueChange={(value) =>
                            setCrawlConfig({ ...crawlConfig, delay: value })
                          }
                          max={5000}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="external"
                          checked={crawlConfig.followExternal}
                          onCheckedChange={(checked) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              followExternal: checked,
                            })
                          }
                        />
                        <Label htmlFor="external">Follow External Links</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="robots"
                          checked={crawlConfig.respectRobots}
                          onCheckedChange={(checked) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              respectRobots: checked,
                            })
                          }
                        />
                        <Label htmlFor="robots">Respect robots.txt</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userAgent">User Agent</Label>
                        <Input
                          id="userAgent"
                          value={crawlConfig.userAgent}
                          onChange={(e) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              userAgent: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Request Timeout: {crawlConfig.timeout[0]}s
                        </Label>
                        <Slider
                          value={crawlConfig.timeout}
                          onValueChange={(value) =>
                            setCrawlConfig({ ...crawlConfig, timeout: value })
                          }
                          max={120}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>File Types to Crawl</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "html",
                            "pdf",
                            "doc",
                            "docx",
                            "txt",
                            "xml",
                            "json",
                            "csv",
                          ].map((type) => (
                            <Badge
                              key={type}
                              variant={
                                crawlConfig.fileTypes.includes(type)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => {
                                const newTypes = crawlConfig.fileTypes.includes(
                                  type,
                                )
                                  ? crawlConfig.fileTypes.filter(
                                      (t) => t !== type,
                                    )
                                  : [...crawlConfig.fileTypes, type];
                                setCrawlConfig({
                                  ...crawlConfig,
                                  fileTypes: newTypes,
                                });
                              }}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="filters" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="include">
                          Include Patterns (regex)
                        </Label>
                        <Textarea
                          id="include"
                          placeholder=".*\\.html$&#10;.*product.*&#10;.*article.*"
                          value={crawlConfig.includePatterns}
                          onChange={(e) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              includePatterns: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="exclude">
                          Exclude Patterns (regex)
                        </Label>
                        <Textarea
                          id="exclude"
                          placeholder=".*\\.pdf$&#10;.*admin.*&#10;.*login.*"
                          value={crawlConfig.excludePatterns}
                          onChange={(e) =>
                            setCrawlConfig({
                              ...crawlConfig,
                              excludePatterns: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="export" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select defaultValue="json">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="xlsx">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export URLs
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handleStartCrawl}
                    disabled={!crawlConfig.url || isRunning}
                    className="flex-1"
                    size="lg"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Crawling...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Crawling
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Dashboard */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      type: "html",
                      url: "example.com/products",
                      status: "completed",
                    },
                    {
                      type: "html",
                      url: "example.com/about",
                      status: "processing",
                    },
                    {
                      type: "pdf",
                      url: "example.com/docs/manual.pdf",
                      status: "queued",
                    },
                    {
                      type: "html",
                      url: "example.com/contact",
                      status: "completed",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        {item.type === "html" ? (
                          <Code className="h-4 w-4 text-primary" />
                        ) : item.type === "pdf" ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : (
                          <Image className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.url}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.status}
                        </p>
                      </div>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.status === "completed"
                            ? "bg-green-500"
                            : item.status === "processing"
                              ? "bg-yellow-500 animate-pulse"
                              : "bg-gray-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { domain: "example.com", pages: 1243, time: "2 hours ago" },
                  { domain: "testsite.org", pages: 567, time: "1 day ago" },
                  { domain: "demo.app", pages: 89, time: "3 days ago" },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{session.domain}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.pages} pages
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
