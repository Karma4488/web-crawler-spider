# 🕷️ WebSpider Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)

**The most powerful enterprise-grade web crawler and spider tool.** Built with modern technologies for performance, scalability, and ease of use.

![WebSpider Pro Dashboard](https://via.placeholder.com/800x400/0F172A/00D9FF?text=WebSpider+Pro+Dashboard)

## ✨ Features

### 🚀 **Advanced Web Crawling**
- **Multi-threaded crawling** with configurable concurrency
- **Intelligent depth control** and URL filtering
- **Robots.txt compliance** with override options
- **Custom user agents** and request headers
- **Rate limiting** and polite crawling delays

### 📊 **Powerful Analytics**
- **Real-time monitoring** of crawl progress
- **Comprehensive statistics** and performance metrics
- **Visual data representation** with charts and graphs
- **Export capabilities** (JSON, CSV, XML, Excel)
- **Session management** and history tracking

### 🎨 **Modern Interface**
- **Dark theme** optimized for professionals
- **Responsive design** for all devices
- **Intuitive configuration** with visual controls
- **Live activity dashboard** with real-time updates
- **Advanced filtering** and search capabilities

### 🔧 **Enterprise Ready**
- **TypeScript throughout** for reliability
- **Production-optimized** build system
- **Docker support** for easy deployment
- **API-first architecture** for integrations
- **Comprehensive error handling**

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** (recommended)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webspider-pro.git
   cd webspider-pro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:8080
   ```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📖 Usage Guide

### Basic Crawling

1. **Enter target URL** in the crawler configuration
2. **Set crawl parameters**:
   - Maximum depth (1-10 levels)
   - Maximum pages (10-10,000)
   - Concurrent requests (1-20)
   - Delay between requests (0-5000ms)

3. **Configure filters** (optional):
   - Include/exclude URL patterns
   - File type restrictions
   - External link handling

4. **Start crawling** and monitor progress in real-time

### Advanced Configuration

#### Depth Control
```javascript
// Crawl only 3 levels deep from the starting URL
maxDepth: 3
```

#### URL Filtering
```javascript
// Include only product pages
includePatterns: ".*\\/product\\/.*"

// Exclude admin and login pages
excludePatterns: ".*(admin|login).*"
```

#### File Type Restrictions
```javascript
// Crawl only HTML and PDF files
fileTypes: ["html", "pdf"]
```

### API Integration

The crawler exposes RESTful APIs for programmatic access:

```javascript
// Start a new crawl
POST /api/crawl/start
{
  "url": "https://example.com",
  "maxDepth": [3],
  "maxPages": [100],
  "concurrent": [5]
}

// Get crawl results
GET /api/crawl/{sessionId}/results?page=1&limit=50

// List all sessions
GET /api/crawl/sessions
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **UI Components**: Radix UI + Custom Design System
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Testing**: Vitest

### Project Structure

```
webspider-pro/
├── client/                 # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── server/                 # Express backend
│   ├── routes/             # API endpoints
│   └── index.ts            # Server configuration
├── shared/                 # Shared types and utilities
└── docs/                   # Documentation
```

### Key Components

- **Crawler Engine**: Multi-threaded web crawler with intelligent scheduling
- **Real-time Dashboard**: Live monitoring with WebSocket updates
- **Data Pipeline**: Efficient data processing and storage
- **Export System**: Multiple format support with streaming
- **Session Manager**: Persistent crawl history and resumption

## 🛠️ Development

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm test       # Run tests
pnpm typecheck  # TypeScript validation
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Crawler Settings
DEFAULT_USER_AGENT="WebSpider Pro 1.0"
MAX_CONCURRENT_REQUESTS=20
DEFAULT_REQUEST_TIMEOUT=30000

# Database (optional)
DATABASE_URL="postgresql://user:pass@localhost:5432/webspider"

# Redis (optional, for caching)
REDIS_URL="redis://localhost:6379"
```

### Adding New Features

1. **Backend Routes**: Add new API endpoints in `server/routes/`
2. **Frontend Pages**: Create new pages in `client/pages/`
3. **UI Components**: Build reusable components in `client/components/`
4. **Shared Types**: Define interfaces in `shared/api.ts`

## 📚 API Documentation

### Crawl Management

#### Start Crawl
```http
POST /api/crawl/start
Content-Type: application/json

{
  "url": "string",
  "maxDepth": [number],
  "maxPages": [number],
  "concurrent": [number],
  "delay": [number],
  "followExternal": boolean,
  "respectRobots": boolean,
  "userAgent": "string",
  "timeout": [number],
  "fileTypes": ["string"],
  "excludePatterns": "string",
  "includePatterns": "string"
}
```

#### Get Results
```http
GET /api/crawl/{sessionId}/results?page=1&limit=50
```

#### Session Status
```http
GET /api/crawl/{sessionId}/status
```

### Response Format

```json
{
  "success": true,
  "sessionId": "string",
  "stats": {
    "totalPages": 1234,
    "totalLinks": 5678,
    "successRate": 98.5,
    "avgResponseTime": 245
  },
  "results": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "totalPages": 25
  }
}
```

## 🚢 Deployment

### Docker

```dockerfile
# Build and run with Docker
docker build -t webspider-pro .
docker run -p 8080:8080 webspider-pro
```

### Production Considerations

- **Rate Limiting**: Implement proper rate limiting for API endpoints
- **Monitoring**: Add application performance monitoring
- **Scaling**: Consider horizontal scaling for high-volume crawling
- **Storage**: Use persistent storage for large datasets
- **Security**: Implement authentication and authorization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Submit** a pull request

### Code Style

- **TypeScript** for all new code
- **ESLint** and **Prettier** for formatting
- **Conventional Commits** for commit messages
- **Component-driven** development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for excellent component primitives
- **Tailwind CSS** for utility-first styling
- **React** team for the amazing framework
- **Vite** for lightning-fast development

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/webspider-pro/issues)
- **Documentation**: [Full documentation](https://github.com/yourusername/webspider-pro/wiki)
- **Community**: [Join our discussions](https://github.com/yourusername/webspider-pro/discussions)

---

<div align="center">
  <strong>⭐ Star this repository if you find it useful!</strong>
</div>
