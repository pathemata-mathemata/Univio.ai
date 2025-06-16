from fastapi import APIRouter
import subprocess
import os
import sys
import glob

router = APIRouter()

@router.get("/chrome-status")
async def check_chrome_status():
    """Debug endpoint to check Chrome/ChromeDriver availability on Render"""
    
    def check_file(path):
        exists = os.path.exists(path)
        return {
            "path": path,
            "exists": exists,
            "size": os.path.getsize(path) if exists else None,
            "executable": bool(os.access(path, os.X_OK)) if exists else None
        }
    
    def run_cmd(cmd):
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
            return {
                "command": cmd,
                "exit_code": result.returncode,
                "stdout": result.stdout.strip(),
                "stderr": result.stderr.strip(),
                "success": result.returncode == 0
            }
        except Exception as e:
            return {
                "command": cmd,
                "error": str(e),
                "success": False
            }
    
    # Check Chrome binaries
    chrome_paths = [
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium-browser",
        "/opt/google/chrome/chrome"
    ]
    
    # Check ChromeDriver
    chromedriver_paths = [
        "/usr/local/bin/chromedriver",
        "/usr/bin/chromedriver",
        "/opt/chromedriver/chromedriver"
    ]
    
    # Environment info
    env_info = {
        "python_version": sys.version,
        "platform": sys.platform,
        "cwd": os.getcwd(),
        "environment_vars": {
            "CHROME_BINARY_PATH": os.getenv("CHROME_BINARY_PATH"),
            "CHROME_DRIVER_PATH": os.getenv("CHROME_DRIVER_PATH"),
            "ENVIRONMENT": os.getenv("ENVIRONMENT"),
            "HEADLESS_BROWSER": os.getenv("HEADLESS_BROWSER")
        }
    }
    
    # File checks
    chrome_files = [check_file(path) for path in chrome_paths]
    chromedriver_files = [check_file(path) for path in chromedriver_paths]
    
    # Command checks
    commands = [
        "which google-chrome",
        "which chromedriver", 
        "google-chrome --version",
        "chromedriver --version"
    ]
    
    command_results = [run_cmd(cmd) for cmd in commands]
    
    # Chrome test
    chrome_test = None
    chrome_available = any(f["exists"] for f in chrome_files)
    chromedriver_available = any(f["exists"] for f in chromedriver_files)
    
    if chrome_available:
        chrome_test = run_cmd(
            "/usr/bin/google-chrome --headless --no-sandbox --disable-dev-shm-usage "
            "--disable-gpu --dump-dom --virtual-time-budget=1000 about:blank"
        )
    
    return {
        "environment": env_info,
        "chrome_files": chrome_files,
        "chromedriver_files": chromedriver_files,
        "command_results": command_results,
        "chrome_test": chrome_test,
        "summary": {
            "chrome_available": chrome_available,
            "chromedriver_available": chromedriver_available,
            "ready_for_scraping": chrome_available and chromedriver_available
        }
    }

@router.get("/test-scraper")
async def test_scraper():
    """Test the ASSIST scraper with minimal parameters"""
    try:
        from app.scrapers.assist_scraper import scrape_assist_data
        
        # Test with minimal data
        result = scrape_assist_data(
            academic_year="2024-25",
            institution="De Anza College", 
            target_institution="UC Berkeley",
            major_filter="Computer Science"
        )
        
        return {
            "success": True,
            "scraper_result": result,
            "message": "Scraper test completed"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Scraper test failed"
        }

@router.get("/system-explore")
async def explore_system():
    """Explore system to find Chrome/Chromium installations"""
    
    try:
        results = {
            "chrome_search": {},
            "apt_packages": {},
            "process_check": {},
            "file_searches": {}
        }
        
        # Search for Chrome/Chromium files
        search_patterns = [
            "/usr/bin/*chrome*",
            "/usr/bin/*chromium*", 
            "/usr/local/bin/*chrome*",
            "/snap/bin/*chrome*",
            "/opt/*/chrome*",
            "/usr/lib/*chrome*",
            "/usr/share/applications/*chrome*"
        ]
        
        for pattern in search_patterns:
            try:
                matches = glob.glob(pattern)
                results["file_searches"][pattern] = matches
            except Exception as e:
                results["file_searches"][pattern] = f"Error: {str(e)}"
        
        # Check what packages are installed
        package_commands = [
            ["dpkg", "-l", "chromium*"],
            ["dpkg", "-l", "*chrome*"],
            ["which", "chromium"],
            ["which", "chromium-browser"], 
            ["whereis", "chromium"],
            ["find", "/usr", "-name", "*chromium*", "-type", "f", "-executable"]
        ]
        
        for cmd in package_commands:
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
                results["apt_packages"][" ".join(cmd)] = {
                    "exit_code": result.returncode,
                    "stdout": result.stdout,
                    "stderr": result.stderr
                }
            except Exception as e:
                results["apt_packages"][" ".join(cmd)] = f"Error: {str(e)}"
        
        return {"success": True, "results": results}
        
    except Exception as e:
        return {"success": False, "error": str(e)} 