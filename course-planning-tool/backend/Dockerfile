# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including Chrome
RUN apt-get update && apt-get install -y \
    # Basic system tools
    curl \
    wget \
    gnupg \
    unzip \
    # Chrome dependencies
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    # Additional dependencies
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install ChromeDriver using Chrome for Testing API (new method for Chrome 115+)
RUN CHROME_VERSION=$(google-chrome --version | cut -d' ' -f3) \
    && echo "Chrome version: $CHROME_VERSION" \
    && MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d'.' -f1) \
    && echo "Chrome major version: $MAJOR_VERSION" \
    && if [ "$MAJOR_VERSION" -ge "115" ]; then \
        echo "Using Chrome for Testing API for Chrome $MAJOR_VERSION"; \
        CHROMEDRIVER_URL=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone-with-downloads.json" \
            | grep -A 50 "\"$MAJOR_VERSION\":" \
            | grep -A 5 '"chromedriver"' \
            | grep -A 2 '"linux64"' \
            | grep '"url"' \
            | head -1 \
            | sed 's/.*"url": "\([^"]*\)".*/\1/'); \
        echo "ChromeDriver URL: $CHROMEDRIVER_URL"; \
        wget -O /tmp/chromedriver.zip "$CHROMEDRIVER_URL"; \
    else \
        echo "Using legacy ChromeDriver API for Chrome $MAJOR_VERSION"; \
        CHROME_DRIVER_VERSION=$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE); \
        echo "ChromeDriver version: $CHROME_DRIVER_VERSION"; \
        wget -O /tmp/chromedriver.zip "http://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip"; \
    fi \
    && unzip /tmp/chromedriver.zip \
    && if [ -f chromedriver-linux64/chromedriver ]; then \
        mv chromedriver-linux64/chromedriver /usr/local/bin/; \
    else \
        mv chromedriver /usr/local/bin/; \
    fi \
    && rm -rf /tmp/chromedriver.zip chromedriver-linux64 \
    && chmod +x /usr/local/bin/chromedriver \
    && chromedriver --version

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 