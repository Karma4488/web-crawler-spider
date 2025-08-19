# Contributing to WebSpider Pro

Thank you for your interest in contributing to WebSpider Pro! We welcome contributions from the community and are excited to collaborate with you.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug fixes** - Help us squash those pesky bugs
- **✨ New features** - Add exciting new functionality
- **📚 Documentation** - Improve our docs and examples
- **🧪 Tests** - Increase our test coverage
- **🎨 UI/UX improvements** - Make the interface even better
- **⚡ Performance optimizations** - Help us make things faster
- **🔧 Tooling improvements** - Better developer experience

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine
3. **Create a feature branch** from `main`
4. **Make your changes** with clear, focused commits
5. **Test your changes** thoroughly
6. **Submit a pull request** with a clear description

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (preferred) or npm
- **Git** for version control

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/webspider-pro.git
cd webspider-pro

# Add upstream remote
git remote add upstream https://github.com/original-owner/webspider-pro.git

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Project Structure

```
webspider-pro/
├── client/                 # React frontend application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   │   └── ...            # Feature-specific components
│   ├── pages/             # Application pages/routes
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   └── global.css         # Global styles and Tailwind config
├── server/                # Express.js backend
│   ├── routes/            # API route handlers
│   └── index.ts           # Server setup and configuration
├── shared/                # Shared types and utilities
│   └── api.ts             # API interfaces and types
├── docs/                  # Documentation files
└── tests/                 # Test files
```

### Development Workflow

```bash
# Start development server (runs both client and server)
pnpm dev

# Run tests
pnpm test

# Run type checking
pnpm typecheck

# Build for production
pnpm build

# Format code
pnpm format.fix
```

## 📏 Coding Standards

### TypeScript

- **Always use TypeScript** for new code
- **Define proper interfaces** for all data structures
- **Use strict mode** settings
- **Avoid `any` type** - use proper typing

```typescript
// ✅ Good
interface CrawlConfig {
  url: string;
  maxDepth: number;
  options?: CrawlOptions;
}

// ❌ Bad
const config: any = {
  url: "example.com",
  depth: 5
};
```

### React Components

- **Use functional components** with hooks
- **Follow the component naming convention** (PascalCase)
- **Extract custom hooks** for reusable logic
- **Use proper prop typing** with interfaces

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button className={cn('btn', `btn-${variant}`)} onClick={onClick}>
      {children}
    </button>
  );
}
```

### CSS and Styling

- **Use Tailwind CSS** for styling
- **Follow the utility-first approach**
- **Use the `cn()` utility** for conditional classes
- **Keep custom CSS minimal**

```typescript
// ✅ Good
<div className={cn(
  'rounded-lg border p-4',
  isActive && 'bg-primary text-primary-foreground',
  className
)}>
```

### API Design

- **Follow RESTful conventions**
- **Use proper HTTP status codes**
- **Validate input data** with Zod schemas
- **Provide consistent error responses**

```typescript
// ✅ Good
app.post('/api/crawl/start', validateCrawlConfig, async (req, res) => {
  try {
    const result = await startCrawl(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

## 🧪 Testing Guidelines

### Test Types

- **Unit tests** for individual functions and components
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows

### Writing Tests

```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### API Testing

```typescript
// API endpoint testing
describe('POST /api/crawl/start', () => {
  it('should start a new crawl with valid config', async () => {
    const config = { url: 'https://example.com', maxDepth: [3] };
    const response = await request(app)
      .post('/api/crawl/start')
      .send(config)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.sessionId).toBeDefined();
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream** to avoid conflicts
2. **Run all tests** and ensure they pass
3. **Update documentation** if needed
4. **Add changelog entry** for significant changes

### PR Guidelines

1. **Create a focused PR** - one feature or fix per PR
2. **Write a clear title** - describe what the PR does
3. **Provide detailed description** - explain the why and how
4. **Include screenshots** for UI changes
5. **Link related issues** using keywords (fixes #123)

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] I have added tests for my changes
- [ ] All new and existing tests pass
- [ ] I have tested this change manually

## Screenshots (if applicable)
Include screenshots for UI changes.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
```

### Review Process

1. **Automated checks** must pass (tests, linting, etc.)
2. **Code review** by at least one maintainer
3. **Address feedback** promptly and professionally
4. **Final approval** by project maintainer

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear, descriptive title**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, browser)
- **Screenshots or logs** if applicable

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- Node.js version: [e.g. 18.17.0]
- Browser: [e.g. Chrome 115, Firefox 116]
- WebSpider Pro version: [e.g. 1.2.0]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Feature Requests

We love hearing about new ideas! When requesting features:

1. **Check existing issues** to avoid duplicates
2. **Provide clear use cases** and benefits
3. **Consider implementation complexity**
4. **Be open to discussion** and alternative solutions

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature you'd like to see.

**Problem/Use Case**
Describe the problem this feature would solve or the use case it enables.

**Proposed Solution**
Describe how you envision this feature working.

**Alternative Solutions**
Describe any alternative solutions or features you've considered.

**Additional Context**
Add any other context, mockups, or examples about the feature request.
```

## 🎯 Development Focus Areas

We're particularly interested in contributions in these areas:

### High Priority
- **Performance optimizations** for large-scale crawling
- **Additional export formats** (Parquet, Avro, etc.)
- **Advanced filtering options** (content-based filtering)
- **Crawler plugins** and extensibility
- **Better error handling** and retry mechanisms

### Medium Priority
- **UI/UX improvements** and accessibility
- **Additional chart types** and visualizations
- **Crawler scheduling** and automation
- **Integration tests** and test coverage
- **Documentation improvements**

### Low Priority
- **Mobile app** support
- **Cloud deployment** guides
- **Advanced authentication** options
- **Internationalization** (i18n)

## 📦 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Update version** in package.json
2. **Update CHANGELOG.md** with new features and fixes
3. **Create release branch** from main
4. **Run full test suite** and ensure all pass
5. **Build and test** production build
6. **Create GitHub release** with release notes
7. **Deploy to production** environments

## 🏷️ Labels and Workflow

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

### Priority Labels

- `priority: high` - Critical issues
- `priority: medium` - Important improvements
- `priority: low` - Nice to have features

## 🎉 Recognition

We believe in recognizing our contributors! Contributors will be:

- **Listed in our README** contributors section
- **Mentioned in release notes** for significant contributions
- **Invited to our contributors** Discord channel
- **Considered for maintainer status** based on ongoing contributions

## 💬 Communication

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat with the community (link in README)
- **Email** - For security issues or private matters

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Testing Framework](https://vitest.dev/)
- [Express.js Guide](https://expressjs.com/)

---

Thank you for contributing to WebSpider Pro! Your efforts help make web crawling more accessible and powerful for everyone. 🚀
