#!/usr/bin/env python3
"""
Debug script to test Chrome/ChromeDriver availability on Render
Run this to check if Chrome is properly installed in the production environment
"""

import os
import subprocess
import sys

def check_file_exists(path, description):
    """Check if a file exists and print status"""
    exists = os.path.exists(path)
    status = "✅" if exists else "❌"
    print(f"{status} {description}: {path}")
    if exists:
        try:
            # Try to get file permissions and size
            stat = os.stat(path)
            print(f"   Size: {stat.st_size} bytes, Executable: {bool(stat.st_mode & 0o111)}")
        except Exception as e:
            print(f"   Error checking file: {e}")
    return exists

def run_command(cmd, description):
    """Run a command and print the result"""
    print(f"\n🔍 {description}")
    print(f"Command: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        print(f"Exit code: {result.returncode}")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        if result.stderr:
            print(f"Error: {result.stderr.strip()}")
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("❌ Command timed out")
        return False
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return False

def main():
    print("🔍 Chrome/ChromeDriver Debug Report for Render")
    print("=" * 50)
    
    # Check environment
    print(f"\n📋 Environment Information:")
    print(f"Python version: {sys.version}")
    print(f"Platform: {sys.platform}")
    print(f"Current working directory: {os.getcwd()}")
    
    # Check environment variables
    print(f"\n🌍 Environment Variables:")
    env_vars = ["CHROME_BINARY_PATH", "CHROME_DRIVER_PATH", "ENVIRONMENT", "HEADLESS_BROWSER"]
    for var in env_vars:
        value = os.getenv(var, "Not set")
        print(f"   {var}: {value}")
    
    # Check Chrome binaries
    print(f"\n🔍 Checking Chrome Binaries:")
    chrome_paths = [
        ("/usr/bin/google-chrome", "Google Chrome (main)"),
        ("/usr/bin/google-chrome-stable", "Google Chrome Stable"),
        ("/usr/bin/chromium-browser", "Chromium Browser"),
        ("/opt/google/chrome/chrome", "Chrome (opt)"),
        ("/usr/bin/chromium", "Chromium (alt)"),
    ]
    
    chrome_found = False
    for path, desc in chrome_paths:
        if check_file_exists(path, desc):
            chrome_found = True
            # Try to get Chrome version
            run_command(f"{path} --version", f"Chrome version check")
            break
    
    if not chrome_found:
        print("❌ No Chrome binary found!")
    
    # Check ChromeDriver
    print(f"\n🔍 Checking ChromeDriver:")
    chromedriver_paths = [
        ("/usr/local/bin/chromedriver", "ChromeDriver (local/bin)"),
        ("/usr/bin/chromedriver", "ChromeDriver (usr/bin)"),
        ("/opt/chromedriver/chromedriver", "ChromeDriver (opt)"),
    ]
    
    chromedriver_found = False
    for path, desc in chromedriver_paths:
        if check_file_exists(path, desc):
            chromedriver_found = True
            # Try to get ChromeDriver version
            run_command(f"{path} --version", f"ChromeDriver version check")
            break
    
    if not chromedriver_found:
        print("❌ No ChromeDriver found!")
    
    # Check system commands
    print(f"\n🔍 System Commands:")
    commands = [
        ("which google-chrome", "Google Chrome location"),
        ("which chromedriver", "ChromeDriver location"),
        ("google-chrome --version", "Chrome version (global)"),
        ("chromedriver --version", "ChromeDriver version (global)"),
        ("ls -la /usr/bin/google-chrome*", "Chrome files in /usr/bin"),
        ("ls -la /usr/local/bin/chromedriver*", "ChromeDriver files in /usr/local/bin"),
    ]
    
    for cmd, desc in commands:
        run_command(cmd, desc)
    
    # Check dependencies
    print(f"\n🔍 Checking Dependencies:")
    deps = [
        "libatk1.0-0",
        "libgtk-3-0", 
        "libnss3",
        "libxss1",
        "libgconf-2-4",
    ]
    
    for dep in deps:
        run_command(f"dpkg -l | grep {dep}", f"Check {dep}")
    
    # Try basic Chrome test
    if chrome_found and chromedriver_found:
        print(f"\n🧪 Basic Chrome Test:")
        print("Attempting to start Chrome in headless mode...")
        chrome_test_cmd = (
            f"/usr/bin/google-chrome --headless --no-sandbox --disable-dev-shm-usage "
            f"--disable-gpu --dump-dom --virtual-time-budget=1000 about:blank"
        )
        run_command(chrome_test_cmd, "Chrome headless test")
    
    print(f"\n✅ Debug report completed!")
    print("If Chrome/ChromeDriver are missing, check your Dockerfile and Render build logs.")

if __name__ == "__main__":
    main() 