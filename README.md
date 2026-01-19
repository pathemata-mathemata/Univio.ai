# UniVio - AI-Powered Course Planning Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Status: Active Development](https://img.shields.io/badge/status-active-brightgreen.svg)](#)

> An intelligent transfer planning system that empowers community college students to confidently plan their path to 4-year universities.

UniVio analyzes transfer requirements from ASSIST.org and provides personalized, quarter-by-quarter course recommendations. Built with modern web technologies and powered by intelligent data parsing.

## Table of Contents

- [Features](#-features)
- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Manual Setup](#manual-setup)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Development](#-development)
- [ASSIST.org Integration](#-assistorg-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)
- [Authors](#-authors)

## 🎯 Features

- **Transfer Requirements Analysis** - Automated scraping and intelligent analysis of ASSIST.org transfer data
- **Course Management** - Track completed courses with grades and plan future coursework efficiently
- **Progress Visualization** - Beautiful timeline-based transfer planning with detailed quarter-by-quarter breakdowns
- **Personalized Recommendations** - AI-powered course suggestions tailored to your academic goals
- **Modern UI** - Responsive, intuitive interface with careful attention to user experience
- **Real-time Data** - Live transfer requirement data from ASSIST.org to ensure accuracy

## 📋 Project Overview

UniVio is an open-source project designed to simplify the transfer process for community college students. By automating the analysis of transfer requirements and providing intelligent planning tools, we help students make informed decisions about their academic path.

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI, Python 3.12, Selenium, BeautifulSoup |
| **Database** | PostgreSQL |
| **Infrastructure** | Docker, Docker Compose |

## 🏗️ Architecture

### Frontend (Next.js 14)

The frontend provides a beautiful, responsive user interface for course planning.

- **Framework**: Next.js 14 with App Router
- **UI Components**: React with TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: React hooks with localStorage for data persistence
- **Design System**: Modern, accessible component library

### Backend (FastAPI)

The backend handles data processing, web scraping, and API serving.

- **Framework**: FastAPI with Python 3.12
- **Web Scraping**: Selenium + BeautifulSoup for ASSIST.org data extraction
- **API**: RESTful endpoints for transfer analysis and course management
- **Data Processing**: Robust parsing and validation of transfer requirements

### Data Flow

```
ASSIST.org → Selenium Scraper → Data Parser → API → Frontend → Student
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([download](https://nodejs.org/))
- **Python** 3.12 or higher ([download](https://www.python.org/downloads/))
- **npm** (comes with Node.js)
- **Chrome/Chromium** browser (required for web scraping)
- **Git** for version control

### Quick Start

The fastest way to get UniVio running locally:

```bash
# 1. Clone the repository
git clone https://github.com/pathemata-mathemata/Univio.ai.git
cd Univio.ai/course-planning-tool

# 2. Run the automated setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Start development servers
./scripts/dev.sh
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Manual Setup

If you prefer to set up components individually:

#### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .venv\Scripts\activate        # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp ../env.example .env

# Start the backend server
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

#### Environment Configuration

Create the following `.env` files:

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://courseplan_user:courseplan_password@localhost:5432/course_planning
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
CHROME_DRIVER_PATH=/usr/bin/chromedriver
HEADLESS_BROWSER=true
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 Usage

### Accessing the Application

Once running locally, navigate to http://localhost:3000 and follow these steps:

1. **Create or Log In** to your account
2. **Fill Out Transfer Planning Form**
   - Select your current academic year and quarter
   - Choose your intended major and transfer institutions
   - Specify your community college

3. **Add Your Completed Courses**
   - Enter courses you've completed with grades and credit hours
   - The system validates courses against ASSIST.org requirements

4. **Review Transfer Analysis**
   - See personalized transfer requirements for your major/school combination
   - Identify remaining course requirements
   - Review course equivalencies and articulations

5. **Get Planning Recommendations**
   - View quarter-by-quarter course recommendations
   - Plan your remaining coursework to meet transfer requirements
   - Export your personalized transfer plan

### API Endpoints

Key endpoints for developers:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/transfer/analyze` | Analyze transfer requirements |
| `GET` | `/api/v1/institutions` | List available institutions |
| `GET` | `/api/v1/courses` | Get course information |
| `GET` | `/api/v1/transfer/requirements/{id}` | Get specific transfer requirements |

For complete API documentation, visit http://localhost:8000/docs when running locally.

## 🔧 Configuration

### Backend Configuration

#### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `SECRET_KEY` | Secret key for authentication | `your-secret-key-here` |
| `CHROME_DRIVER_PATH` | Path to ChromeDriver | `/usr/bin/chromedriver` |
| `HEADLESS_BROWSER` | Run browser in headless mode | `true` |

#### macOS ChromeDriver Installation

```bash
brew install chromedriver
# Add to your PATH or specify in CHROME_DRIVER_PATH
```

### Frontend Configuration

The frontend uses Next.js with environment variables defined in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🛠️ Development

### Project Structure

```
course-planning-tool/
├── frontend/                       # Next.js application
│   ├── src/
│   │   ├── app/                   # App Router pages and layouts
│   │   ├── components/            # Reusable React components
│   │   ├── lib/                   # Utilities and helper functions
│   │   ├── services/              # API services and business logic
│   │   ├── types/                 # TypeScript type definitions
│   │   └── globals.css            # Global styles
│   ├── public/                    # Static assets
│   └── package.json
│
├── backend/                        # FastAPI application
│   ├── app/
│   │   ├── api/                   # API routes and endpoints
│   │   ├── core/                  # Configuration and setup
│   │   ├── models/                # Database models
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── scrapers/              # Web scrapers
│   │   ├── services/              # Business logic services
│   │   ├── utils/                 # Utility functions
│   │   └── main.py                # Application entry point
│   ├── tests/                     # Test files
│   └── requirements.txt
│
├── scripts/                        # Development scripts
│   ├── setup.sh                   # Initial setup
│   └── dev.sh                     # Start development servers
│
└── docker-compose.yml             # Docker Compose configuration
```

### Running Individual Services

**Backend Server**:
```bash
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Server**:
```bash
cd frontend && npm run dev
```

### Key API Endpoints

- `POST /api/v1/transfer/analyze` - Analyze transfer requirements for a student
- `GET /api/v1/institutions` - Retrieve list of available institutions
- `GET /api/v1/courses` - Get course catalog and information
- `GET /api/v1/transfer/requirements/{id}` - Fetch specific transfer requirements

## 🔍 ASSIST.org Integration

UniVio integrates with ASSIST.org to provide accurate, real-time transfer requirement data:

### Features

- **Automated Scraping** - Selenium-based scraper handles dynamic content and JavaScript rendering
- **Intelligent Parsing** - Extracts course requirements, articulations, and prerequisites
- **Error Handling** - Gracefully handles website changes and loading states
- **Smart Caching** - Reduces load on ASSIST.org with intelligent result caching
- **Validation** - Verifies scraped data for accuracy and completeness

### Supported Institutions

- **California Community Colleges** - All CCC system institutions
- **UC System** - All University of California campuses
- **CSU System** - All California State University campuses
- **Private Universities** - Select institutions with ASSIST.org agreements

## 🧪 Testing

### Backend Tests

```bash
cd backend && source .venv/bin/activate

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_scraper.py

# Run with coverage
pytest --cov=app
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📦 Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

#### Frontend Build

```bash
cd frontend
npm run build
npm start  # or deploy to Vercel/Netlify
```

#### Backend Deployment

```bash
cd backend

# Build Docker image
docker build -t univio-backend .

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

#### Environment Setup for Production

1. Set secure environment variables in your hosting platform
2. Configure database with production credentials
3. Enable HTTPS/SSL certificates
4. Set up proper CORS configuration
5. Configure monitoring and logging

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

## 🐛 Troubleshooting

### Common Issues and Solutions

#### ChromeDriver Issues

**Problem**: `selenium.common.exceptions.WebDriverException`

**Solution**:
```bash
# macOS
brew install chromedriver

# Ubuntu/Debian
sudo apt-get install chromium-chromedriver

# Then add to PATH or update CHROME_DRIVER_PATH in .env
```

#### Port Already in Use

**Problem**: `Address already in use` on port 3000 or 8000

**Solution**:
```bash
# Find and kill processes
lsof -ti:3000,8000 | xargs kill -9

# Or change port in development
# Frontend: npm run dev -- -p 3001
# Backend: uvicorn app.main:app --port 8001
```

#### Module Import Errors

**Problem**: `ModuleNotFoundError` when running Python

**Solution**:
```bash
# Ensure virtual environment is activated
source .venv/bin/activate  # macOS/Linux

# Reinstall all dependencies
pip install -r requirements.txt --force-reinstall
```

#### CORS Issues

**Problem**: Browser console shows CORS errors

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` matches backend URL in `frontend/.env.local`
2. Check backend CORS configuration in `backend/app/core/config.py`
3. Restart both servers after changes

#### Database Connection Issues

**Problem**: `psycopg2.OperationalError: could not connect to server`

**Solution**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env` file
3. Ensure database exists and credentials are correct

### Performance Optimization Tips

- **Enable Headless Browser Mode** for production scraping (reduces memory usage)
- **Implement Caching** for frequently accessed transfer data
- **Use Connection Pooling** for database operations
- **Enable Compression** in FastAPI for API responses
- **Optimize Frontend Bundles** with Next.js build optimizations

### Getting Help

If you encounter issues:

1. Check the [API documentation](http://localhost:8000/docs) when running locally
2. Review this troubleshooting section
2. Search existing [GitHub Issues](https://github.com/pathemata-mathemata/Univio.ai/issues)
4. Create a new issue with detailed error information

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes UniVio better.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/pathemata-mathemata/Univio.ai.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, well-documented code
   - Follow PEP 8 (Python) and Prettier (JavaScript) standards
   - Add tests for new functionality

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure all tests pass

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add/update tests for all new features
- Update documentation as needed
- Be respectful and constructive in discussions

## 🆘 Support

Need help? Here are your options:

- **Documentation**: Check [API docs](http://localhost:8000/docs) when running locally
- **Issues**: Search or create an issue on [GitHub Issues](https://github.com/pathemata-mathemata/Univio.ai/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/pathemata-mathemata/Univio.ai/discussions) for questions
- **Email**: Reach out to Charles Li for direct support

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### What This Means

You are free to:
- ✅ Use the software for any purpose
- ✅ Copy, modify, and distribute the software
- ✅ Include this software in proprietary applications

Under the condition that you:
- ✅ Include a copy of the license and copyright notice
- ✅ State significant changes made to the software

## 👥 Authors

### Creator & Maintainer

**Charles Li**
- GitHub: [@CharlesLi](https://github.com/pathemata-mathemata)
- Email: charles@univio.ai

### Contributors

https://github.com/pathemata-mathemata

### Acknowledgments

- **ASSIST.org** - For providing transfer requirement data
- **Community College Students** - For the inspiration and feedback
- **Open Source Community** - For amazing tools and libraries we use

## 📊 Project Stats

- **Stars**: [![GitHub stars](https://img.shields.io/github/stars/pathemata-mathemata/Univio.ai?style=flat-square)](https://github.com/pathemata-mathemata/Univio.ai/stargazers)
- **Forks**: [![GitHub forks](https://img.shields.io/github/forks/pathemata-mathemata/Univio.ai?style=flat-square)](https://github.com/pathemata-mathemata/Univio.ai/network/members)
- **Issues**: [![GitHub issues](https://img.shields.io/github/issues/pathemata-mathemata/Univio.ai?style=flat-square)](https://github.com/pathemata-mathemata/Univio.ai/issues)

## 🗺️ Roadmap

Check out our [GitHub Projects](https://github.com/pathemata-mathemata/Univio.ai/projects) to see what's planned for future releases.

---

<div align="center">

**Made with ❤️ to help students achieve their transfer dreams**

[⬆ Back to Top](#univio---ai-powered-course-planning-tool)

</div> 