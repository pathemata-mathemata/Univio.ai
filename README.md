# UniVio - AI-Powered Course Planning Tool

An intelligent transfer planning system that helps community college students plan their path to 4-year universities. The application analyzes transfer requirements from ASSIST.org and provides personalized course recommendations.

## 🌟 Features

- **Transfer Requirements Analysis**: Automated scraping and analysis of ASSIST.org transfer data
- **Course Management**: Track completed courses and plan future coursework
- **Progress Visualization**: Timeline-based transfer planning with quarter-by-quarter breakdown
- **Modern UI**: Beautiful, responsive interface built with your Figma designs
- **Real-time Data**: Live transfer requirement data from ASSIST.org

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **UI**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **State Management**: React hooks with localStorage for persistence
- **Styling**: Custom design system matching your Figma specifications

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.12
- **Web Scraping**: Selenium + BeautifulSoup for ASSIST.org data
- **API**: RESTful endpoints for transfer analysis and course management
- **Data Processing**: Structured parsing of transfer requirements

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Chrome/Chromium browser (for web scraping)

### Setup
1. **Clone and setup the project:**
   ```bash
   git clone <your-repo>
   cd course-planning-tool
   ```

2. **Run the automated setup:**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Start development servers:**
   ```bash
   ./scripts/dev.sh
   ```

### Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Environment Configuration
Create `.env` files:
- `backend/.env` - Backend configuration
- `frontend/.env.local` - Frontend environment variables

## 📱 Usage

1. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

2. **Transfer Planning Workflow:**
   - Fill out transfer planning form (year, quarter, major, institutions)
   - Add your completed courses with grades and credits
   - View personalized transfer analysis and requirements
   - Get quarter-by-quarter planning recommendations

## 🛠️ Development

### Project Structure
```
course-planning-tool/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # Utilities and helpers
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── core/            # Core configuration
│   │   ├── scrapers/        # Web scraping modules
│   │   └── main.py          # Application entry point
│   └── requirements.txt     # Python dependencies
├── scripts/                 # Development scripts
└── docker-compose.yml       # Container orchestration
```

### Key API Endpoints
- `POST /api/v1/transfer/analyze` - Analyze transfer requirements
- `GET /api/v1/institutions` - Get institution list
- `GET /api/v1/courses` - Get course information

### Running Individual Services
```bash
# Backend only
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload

# Frontend only
cd frontend && npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://courseplan_user:courseplan_password@localhost:5432/course_planning
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
CHROME_DRIVER_PATH=/usr/bin/chromedriver
HEADLESS_BROWSER=true
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# Backend tests
cd backend && source .venv/bin/activate && pytest

# Frontend tests
cd frontend && npm test
```

## 📦 Deployment

### Using Docker
```bash
docker-compose up -d
```

### Manual Deployment
1. Build frontend: `cd frontend && npm run build`
2. Configure production environment variables
3. Deploy backend with gunicorn/uvicorn
4. Serve frontend with nginx or similar

## 🔍 ASSIST.org Integration

The system integrates with ASSIST.org to provide real-time transfer requirement data:

- **Automated Scraping**: Selenium-based scraper for dynamic content
- **Data Parsing**: Structured extraction of course requirements and articulations
- **Error Handling**: Robust handling of website changes and loading states
- **Caching**: Intelligent caching to minimize scraping load

### Supported Institutions
- California Community Colleges
- UC and CSU systems
- Private universities with ASSIST agreements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [API documentation](http://localhost:8000/docs) when running locally
- Review the troubleshooting section below
- Create an issue on GitHub

## 🔧 Troubleshooting

### Common Issues

1. **Selenium ChromeDriver Issues**:
   - Install Chrome/Chromium browser
   - Update ChromeDriver path in configuration
   - For macOS: `brew install chromedriver`

2. **Port Already in Use**:
   - Kill existing processes: `lsof -ti:3000,8000 | xargs kill`
   - Or change ports in configuration

3. **Module Import Errors**:
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

4. **CORS Issues**:
   - Check frontend environment variables
   - Verify backend CORS configuration

### Performance Tips
- Enable headless browser mode for production scraping
- Implement caching for frequently accessed transfer data
- Use connection pooling for database operations

---

**Built with ❤️ for students planning their transfer journey** 