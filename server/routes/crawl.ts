import { RequestHandler } from "express";
import { z } from "zod";

// Validation schema for crawl configuration
const CrawlConfigSchema = z.object({
  url: z.string().url("Invalid URL format"),
  maxDepth: z.array(z.number().min(1).max(10)).length(1),
  maxPages: z.array(z.number().min(1).max(100000)).length(1),
  concurrent: z.array(z.number().min(1).max(50)).length(1),
  delay: z.array(z.number().min(0).max(10000)).length(1),
  followExternal: z.boolean(),
  respectRobots: z.boolean(),
  userAgent: z.string().min(1),
  timeout: z.array(z.number().min(1).max(300)).length(1),
  fileTypes: z.array(z.string()),
  excludePatterns: z.string(),
  includePatterns: z.string()
});

// In-memory storage for crawl sessions (in production, use a database)
const crawlSessions = new Map<string, any>();
let sessionCounter = 0;

// Simple URL crawler simulation (in production, use actual web crawling libraries)
class WebCrawler {
  private config: any;
  private results: any[] = [];
  private visited: Set<string> = new Set();
  private queue: string[] = [];
  private isRunning = false;

  constructor(config: any) {
    this.config = config;
    this.queue.push(config.url);
  }

  async crawl(): Promise<any> {
    this.isRunning = true;
    const startTime = Date.now();
    let crawledCount = 0;
    const maxPages = this.config.maxPages[0];
    const maxDepth = this.config.maxDepth[0];
    const delay = this.config.delay[0];

    while (this.queue.length > 0 && crawledCount < maxPages && this.isRunning) {
      const url = this.queue.shift()!;
      
      if (this.visited.has(url)) continue;
      
      this.visited.add(url);
      
      // Simulate crawling delay
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Simulate page crawling
      const pageData = await this.crawlPage(url, maxDepth);
      this.results.push(pageData);
      
      // Add discovered links to queue
      if (pageData.links) {
        pageData.links.forEach((link: string) => {
          if (!this.visited.has(link) && this.shouldCrawlUrl(link)) {
            this.queue.push(link);
          }
        });
      }

      crawledCount++;
    }

    const endTime = Date.now();
    
    return {
      sessionId: sessionCounter++,
      config: this.config,
      results: this.results,
      stats: {
        totalPages: this.results.length,
        totalLinks: this.results.reduce((sum, page) => sum + (page.links?.length || 0), 0),
        totalTime: endTime - startTime,
        avgResponseTime: this.results.reduce((sum, page) => sum + page.responseTime, 0) / this.results.length || 0,
        errorCount: this.results.filter(page => page.error).length,
        successRate: ((this.results.length - this.results.filter(page => page.error).length) / this.results.length * 100) || 0
      },
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      status: 'completed'
    };
  }

  private async crawlPage(url: string, depth: number): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Simulate HTTP request (in production, use actual HTTP client)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
      
      // Generate mock data based on URL
      const domain = new URL(url).hostname;
      const path = new URL(url).pathname;
      
      const mockContent = this.generateMockContent(url);
      const mockLinks = this.generateMockLinks(domain, depth);
      
      return {
        url,
        title: mockContent.title,
        description: mockContent.description,
        content: mockContent.content,
        links: mockLinks,
        images: mockContent.images,
        metadata: {
          statusCode: 200,
          contentType: 'text/html',
          contentLength: mockContent.content.length,
          lastModified: new Date().toISOString(),
          depth: maxDepth - depth + 1
        },
        responseTime: Date.now() - startTime,
        crawledAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        url,
        error: (error as Error).message,
        statusCode: 500,
        responseTime: Date.now() - startTime,
        crawledAt: new Date().toISOString()
      };
    }
  }

  private generateMockContent(url: string) {
    const domain = new URL(url).hostname;
    const path = new URL(url).pathname;
    
    const titles = [
      `Welcome to ${domain}`,
      `About ${domain}`,
      `Products - ${domain}`,
      `Services at ${domain}`,
      `Contact ${domain}`,
      `Blog - ${domain}`
    ];
    
    const descriptions = [
      "Discover amazing products and services",
      "Learn more about our company and mission",
      "Browse our extensive product catalog",
      "Professional services for your business",
      "Get in touch with our team",
      "Latest news and insights"
    ];

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      content: `This is the content of ${url}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      images: [
        `${url}/image1.jpg`,
        `${url}/image2.png`,
        `${url}/logo.svg`
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  private generateMockLinks(domain: string, depth: number): string[] {
    if (depth <= 0) return [];
    
    const paths = ['/about', '/products', '/services', '/contact', '/blog', '/support', '/careers', '/news'];
    const numLinks = Math.floor(Math.random() * 5) + 2;
    
    return paths
      .sort(() => Math.random() - 0.5)
      .slice(0, numLinks)
      .map(path => `https://${domain}${path}`);
  }

  private shouldCrawlUrl(url: string): boolean {
    // Apply include/exclude patterns
    if (this.config.includePatterns) {
      const includeRegex = new RegExp(this.config.includePatterns);
      if (!includeRegex.test(url)) return false;
    }
    
    if (this.config.excludePatterns) {
      const excludeRegex = new RegExp(this.config.excludePatterns);
      if (excludeRegex.test(url)) return false;
    }
    
    // Check file types
    const urlPath = new URL(url).pathname.toLowerCase();
    const fileExtension = urlPath.split('.').pop();
    
    if (fileExtension && !this.config.fileTypes.includes(fileExtension)) {
      return false;
    }
    
    return true;
  }

  stop() {
    this.isRunning = false;
  }
}

export const handleStartCrawl: RequestHandler = async (req, res) => {
  try {
    const validatedConfig = CrawlConfigSchema.parse(req.body);
    
    // Create new crawler instance
    const crawler = new WebCrawler(validatedConfig);
    
    // Start crawling (in production, this should be done asynchronously)
    const result = await crawler.crawl();
    
    // Store session
    crawlSessions.set(result.sessionId.toString(), result);
    
    res.json({
      success: true,
      sessionId: result.sessionId,
      message: 'Crawl completed successfully',
      stats: result.stats,
      preview: result.results.slice(0, 5) // Return first 5 results as preview
    });
    
  } catch (error) {
    console.error('Crawl error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid configuration',
        errors: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to start crawl',
        error: (error as Error).message
      });
    }
  }
};

export const handleGetCrawlStatus: RequestHandler = (req, res) => {
  const { sessionId } = req.params;
  const session = crawlSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Crawl session not found'
    });
  }
  
  res.json({
    success: true,
    session
  });
};

export const handleGetCrawlResults: RequestHandler = (req, res) => {
  const { sessionId } = req.params;
  const session = crawlSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Crawl session not found'
    });
  }
  
  const { page = 1, limit = 50 } = req.query;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  
  const paginatedResults = session.results.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    results: paginatedResults,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: session.results.length,
      totalPages: Math.ceil(session.results.length / Number(limit))
    },
    stats: session.stats
  });
};

export const handleGetAllSessions: RequestHandler = (req, res) => {
  const sessions = Array.from(crawlSessions.entries()).map(([id, session]) => ({
    sessionId: id,
    url: session.config.url,
    status: session.status,
    startTime: session.startTime,
    endTime: session.endTime,
    stats: session.stats
  }));
  
  res.json({
    success: true,
    sessions: sessions.reverse() // Most recent first
  });
};

export const handleStopCrawl: RequestHandler = (req, res) => {
  const { sessionId } = req.params;
  const session = crawlSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Crawl session not found'
    });
  }
  
  // In production, this would stop the actual crawler
  session.status = 'stopped';
  
  res.json({
    success: true,
    message: 'Crawl stopped successfully'
  });
};
