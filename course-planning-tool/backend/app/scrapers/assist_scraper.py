from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time
import re
from bs4 import BeautifulSoup
import argparse
import sys
import os
from selenium.common.exceptions import TimeoutException

def scrape_assist_data(academic_year, institution, target_institution, major_filter):
    """
    Scrape ASSIST.org for transfer requirements
    
    Args:
        academic_year (str): Academic year (e.g., "2024-2025")
        institution (str): Source institution name (e.g., "De Anza College")
        target_institution (str): Target institution name (e.g., "University of California, Berkeley")
        major_filter (str): Major to filter for (e.g., "Applied Math")
    
    Returns:
        dict: Structured data containing transfer requirements
    """
    
    print(f"🚀 Starting ASSIST.org scraping...")
    print(f"   Academic Year: {academic_year}")
    print(f"   From: {institution}")
    print(f"   To: {target_institution}")
    print(f"   Major: {major_filter}")
    
    try:
        result = _scrape_assist_with_selenium(academic_year, institution, target_institution, major_filter)
        if result.get("success", False):
            print(f"✅ ASSIST.org scraping successful!")
            return result
        else:
            print(f"❌ ASSIST.org scraping failed: {result.get('error', 'Unknown error')}")
            print(f"🔄 Returning mock data as fallback...")
            return _get_fallback_data(academic_year, institution, target_institution, major_filter)
    except Exception as e:
        print(f"❌ ASSIST.org scraping crashed: {str(e)}")
        print(f"🔄 Returning mock data as fallback...")
        return _get_fallback_data(academic_year, institution, target_institution, major_filter)

def _scrape_assist_with_selenium(academic_year, institution, target_institution, major_filter):
    
    # Set up Chrome options for production and local environments
    chrome_options = Options()
    
    # Basic options for stability - ESSENTIAL for production environments
    chrome_options.add_argument("--no-sandbox")                    # Critical for Docker/containers
    chrome_options.add_argument("--disable-dev-shm-usage")         # Critical for limited memory
    chrome_options.add_argument("--disable-gpu")                   # Disable GPU for headless
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-plugins")
    chrome_options.add_argument("--disable-images")               # Faster loading
    chrome_options.add_argument("--disable-javascript")          # Faster, we only need DOM
    chrome_options.add_argument("--disable-css")                 # Faster loading
    chrome_options.add_argument("--disable-web-security")        # Avoid CORS issues
    chrome_options.add_argument("--disable-features=VizDisplayCompositor")
    chrome_options.add_argument("--disable-software-rasterizer")
    chrome_options.add_argument("--disable-background-timer-throttling")
    chrome_options.add_argument("--disable-backgrounding-occluded-windows")
    chrome_options.add_argument("--disable-renderer-backgrounding")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--single-process")              # Use single process for stability
    chrome_options.add_argument("--no-zygote")                   # Disable zygote process
    chrome_options.add_argument("--disable-background-networking")
    chrome_options.add_argument("--disable-default-apps")
    chrome_options.add_argument("--disable-sync")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36")
    
    # ALWAYS run headless in production (Render doesn't have display)
    chrome_options.add_argument("--headless=new")  # Use new headless mode
    
    # Set Chrome binary path - try common production paths
    chrome_paths = [
        "/usr/bin/chromium",                # Chromium binary (from our Dockerfile)
        "/usr/bin/chromium-browser",       # Alternative Chromium path
        "/usr/bin/google-chrome",           # Chrome fallback
        "/usr/bin/google-chrome-stable",   # Alternative Chrome path  
        "/opt/google/chrome/chrome",       # Another common Chrome path
    ]
    
    chrome_binary = os.getenv("CHROME_BINARY_PATH")
    if chrome_binary:
        chrome_options.binary_location = chrome_binary
        print(f"🔧 Using specified Chrome binary: {chrome_binary}")
    else:
        # Auto-detect Chrome/Chromium binary
        for path in chrome_paths:
            if os.path.exists(path):
                chrome_options.binary_location = path
                print(f"🔧 Auto-detected Chrome/Chromium binary: {path}")
                break
    
    # Set ChromeDriver path - try common paths
    chromedriver_paths = [
        "/usr/bin/chromedriver",            # ChromeDriver from chromium-driver package
        "/usr/local/bin/chromedriver",      # Alternative path
        "/opt/chromedriver/chromedriver",   # Another common path
    ]
    
    chromedriver_path = os.getenv("CHROME_DRIVER_PATH")
    if chromedriver_path:
        print(f"🔧 Using specified ChromeDriver: {chromedriver_path}")
    else:
        # Auto-detect ChromeDriver
        for path in chromedriver_paths:
            if os.path.exists(path):
                chromedriver_path = path
                print(f"🔧 Auto-detected ChromeDriver: {path}")
                break
        if not chromedriver_path:
            chromedriver_path = "/usr/local/bin/chromedriver"  # Default from Dockerfile
    
    print(f"🚀 Initializing Chrome WebDriver...")
    print(f"   ChromeDriver path: {chromedriver_path}")
    print(f"   Chrome binary: {chrome_options.binary_location}")
    
    try:
        # Try to create service with specified path
        if chromedriver_path and os.path.exists(chromedriver_path):
            print(f"✅ Found ChromeDriver at: {chromedriver_path}")
            service = Service(chromedriver_path)
            driver = webdriver.Chrome(service=service, options=chrome_options)
            print(f"✅ Chrome WebDriver initialized successfully!")
        else:
            print(f"❌ ChromeDriver not found at: {chromedriver_path}")
            # Fallback: let webdriver-manager handle it (for local development)
            try:
                print(f"🔄 Trying webdriver-manager fallback...")
                from webdriver_manager.chrome import ChromeDriverManager
                service = Service(ChromeDriverManager().install())
                driver = webdriver.Chrome(service=service, options=chrome_options)
                print(f"✅ Chrome WebDriver initialized with webdriver-manager!")
            except ImportError:
                print(f"❌ webdriver-manager not available")
                # Last resort: try without service specification
                print(f"🔄 Trying without service specification...")
                driver = webdriver.Chrome(options=chrome_options)
                print(f"✅ Chrome WebDriver initialized without service!")
    except Exception as e:
        print(f"❌ Failed to initialize ChromeDriver: {e}")
        print(f"🔄 Last resort: trying basic Chrome initialization...")
        try:
            driver = webdriver.Chrome(options=chrome_options)
            print(f"✅ Chrome WebDriver initialized (basic)!")
        except Exception as e2:
            print(f"❌ All Chrome initialization attempts failed:")
            print(f"   Original error: {e}")
            print(f"   Fallback error: {e2}")
            raise Exception(f"Could not initialize Chrome WebDriver. Check if Chrome and ChromeDriver are installed. Original: {e}, Fallback: {e2}")
    
    driver.get("https://assist.org/")

    wait = WebDriverWait(driver, 20)

    try:
        # Find the left panel form
        left_panel = wait.until(EC.presence_of_element_located((By.ID, "agreementInformationForm")))

        # Print debug info about form elements
        ng_selects = left_panel.find_elements(By.TAG_NAME, "ng-select")
        print(f"Found ng-selects in left panel: {len(ng_selects)}")
        for idx, elem in enumerate(ng_selects):
            print(f"ng-select {idx}:")
            print("formcontrolname:", elem.get_attribute("formcontrolname"))

        omniselects = left_panel.find_elements(By.TAG_NAME, "awc-omniselect")
        print(f"Found awc-omniselects in left panel: {len(omniselects)}")

        # 1. Select Academic Year
        print(f"Selecting academic year: {academic_year}...")
        year_dropdown = left_panel.find_element(By.CSS_SELECTOR, "ng-select[formcontrolname='academicYear'] .ng-select-container")
        year_dropdown.click()
        time.sleep(1)
        year_option = wait.until(EC.element_to_be_clickable((By.XPATH, f"//div[@role='option' and contains(@class, 'ng-option') and .='{academic_year}']")))
        year_option.click()
        print("Academic year selected.")

        # 2. Select Institution
        print(f"Selecting institution: {institution}...")
        try:
            # 1. Click the wrapper div to open the dropdown
            wrapper = wait.until(EC.element_to_be_clickable(
                (By.CSS_SELECTOR, ".mat-mdc-text-field-wrapper.mdc-text-field--filled")
            ))
            print("Institution input wrapper found, clicking...")
            wrapper.click()
            time.sleep(1)  # Wait for dropdown to open

            # 2. Wait for the dropdown options to appear and click the desired one
            dropdown_option = wait.until(EC.element_to_be_clickable(
                (By.XPATH, f"//span[contains(@class, 'option__primary-text') and contains(text(), '{institution}')]")
            ))
            print("Dropdown option found, clicking...")
            dropdown_option.click()
            print("Institution selected.")

        except Exception as inst_error:
            print(f"Institution selection failed: {inst_error}")
            print(f"Current URL: {driver.current_url}")
            print(f"Page title: {driver.title}")
            raise

        # 3. Select Target Institution (Agreements with Other Institutions)
        print(f"Selecting target institution: {target_institution}...")
        try:
            # Find the wrapper for the 'Agreements with Other Institutions' field
            wrappers = driver.find_elements(By.CSS_SELECTOR, ".mat-mdc-text-field-wrapper.mdc-text-field--filled")
            if len(wrappers) < 2:
                raise Exception("Could not find the target institution input wrapper.")
            target_wrapper = wrappers[1]  # The second wrapper is for 'Agreements with Other Institutions'
            print("Target institution input wrapper found")

            # Click wrapper to open dropdown
            print("Clicking wrapper to open dropdown...")
            target_wrapper.click()
            time.sleep(1)  # Wait for dropdown to open

            # Input the name to filter the dropdown options
            print("Finding input field and typing institution name...")
            target_input = target_wrapper.find_element(By.XPATH, ".//input")
            target_input.clear()
            
            # Type the institution name character by character
            for char in target_institution:
                target_input.send_keys(char)
                time.sleep(0.05)
            print(f"Typed: {target_institution}")
            
            time.sleep(2)  # Wait for dropdown options to filter

            # Click the correct option from the filtered dropdown (use the working selector)
            print("Looking for and clicking the dropdown option...")
            dropdown_option = wait.until(EC.presence_of_element_located((By.XPATH, f"//span[contains(text(), 'To: {target_institution}')]")))
            print("Target institution dropdown option found, clicking with JavaScript...")
            # Use JavaScript to click the option to avoid any overlay issues
            driver.execute_script("arguments[0].click();", dropdown_option)
            print("Target institution selected.")
            time.sleep(1)  # Wait for selection to register

        except Exception as tgt_error:
            print(f"Target institution selection failed: {tgt_error}")
            print(f"Current URL: {driver.current_url}")
            print(f"Page title: {driver.title}")
            raise

        # 4. Click "View Agreements"
        print("Clicking View Agreements...")
        view_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'View Agreements')]")))
        view_btn.click()
        print("View Agreements clicked.")

        # Wait for results to load
        time.sleep(5)
        print(driver.title)

        # 5. Input major name in the filter major box
        print(f"Filtering for major: {major_filter}")
        filter_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Filter Major List']")))
        filter_input.clear()
        filter_input.send_keys(major_filter)
        time.sleep(2)  # Wait for the filter to apply
        print("Major filter applied.")

        # 6. Click the first 'viewByRowColRadio' button
        print("Clicking the first major radio button...")
        first_radio = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".viewByRowColRadio")))
        first_radio.click()
        print("First major selected.")

        # 7. Scrape and parse the requirements
        print(f"\n===== {major_filter} Transfer Requirements =====")
        # Wait for the report container to be present
        report_container = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".reportContainer")))
        
        # Get the HTML of the entire report container
        report_html = report_container.get_attribute('outerHTML')
        soup = BeautifulSoup(report_html, 'html.parser')

        def extract_course_info(course_elem):
            """Extract course code, title, and units from a course element"""
            # Look for course code in prefixCourseNumber class
            code_elem = course_elem.find('div', class_='prefixCourseNumber')
            if not code_elem:
                # Fall back to courseCode class
                code_elem = course_elem.find('div', class_=lambda c: c and 'courseCode' in c)
            
            # Look for course title and units in the full text
            full_text = course_elem.get_text(strip=True)
            code = code_elem.get_text(strip=True) if code_elem else ''
            
            # Extract title and units from the full text
            if code and code in full_text:
                # Remove the code from the beginning
                remaining = full_text.replace(code, '', 1).strip()
                
                # Look for units pattern (e.g., "4.00units" or "5.00 units")
                units_match = re.search(r'(\d+\.?\d*)\s*units?', remaining, re.IGNORECASE)
                if units_match:
                    units_part = units_match.group(1) + ' units'
                    # Extract title by removing units from the end
                    title = remaining[:units_match.start()].strip()
                    # Clean up common suffixes/prefixes in title
                    title = re.sub(r'\s*-\s*$', '', title)  # Remove trailing dash
                else:
                    title = remaining
                    units_part = ''
            else:
                title = ''
                units_part = ''
            
            return code, title, units_part

        def parse_articulation_structure(container):
            """Parse the articulation agreement structure"""
            sections = []
            
            # Find group containers which represent sections
            group_containers = container.find_all('div', class_='groupContainer')
            
            for group_container in group_containers:
                full_text = group_container.get_text(strip=True)
                
                # Check for HIGHLY RECOMMENDED section
                if 'HIGHLY RECOMMENDED' in full_text:
                    section = {
                        'number': 'HIGHLY_RECOMMENDED',
                        'title': 'Highly Recommended',
                        'subsections': [],
                        'structure': 'recommended'
                    }
                    
                    # Look for numbered subsections within HIGHLY RECOMMENDED
                    subsection_containers = group_container.find_all('div', class_='sectionContainer')
                    if not subsection_containers:
                        # Fallback: look for any containers with section numbers
                        subsection_containers = group_container.find_all('div', class_='groupContainer')
                    
                    for subsection_container in subsection_containers:
                        subsection_text = subsection_container.get_text(strip=True)
                        
                        # Look for numbered subsections like "2Complete A"
                        if re.match(r'\d+Complete', subsection_text):
                            subsection_number = re.match(r'(\d+)', subsection_text).group(1)
                            
                            subsection = {
                                'number': subsection_number,
                                'title': subsection_text.split('Complete')[1].strip() if 'Complete' in subsection_text else 'Complete Requirements',
                                'options': [],
                                'structure': 'choice'
                            }
                            
                            # Find option groups (A, B, etc.)
                            option_containers = subsection_container.find_all('div', class_='sectionMain')
                            if not option_containers:
                                # Fallback: look for any div that might contain options
                                option_containers = subsection_container.find_all('div', recursive=True)
                                option_containers = [div for div in option_containers if div.find('div', class_='courseLine')]
                            
                            option_letter = 'A'
                            for option_container in option_containers:
                                option_text = option_container.get_text(strip=True)
                                
                                # Skip if this doesn't look like an option section
                                if not option_container.find('div', class_='courseLine'):
                                    continue
                                
                                option = {
                                    'letter': option_letter,
                                    'courses': []
                                }
                                
                                # Find course lines in this option
                                course_lines = option_container.find_all('div', class_='courseLine')
                                for course_line in course_lines:
                                    # Check if this is a receiving course (target institution side)
                                    if course_line.find_parent('div', class_='rowReceiving'):
                                        code, title, units = extract_course_info(course_line)
                                        if code:
                                            option['courses'].append({
                                                'code': code,
                                                'title': title,
                                                'units': units,
                                                'type': 'receiving'
                                            })
                                
                                if option['courses']:
                                    subsection['options'].append(option)
                                    option_letter = chr(ord(option_letter) + 1)
                            
                            if subsection['options']:
                                section['subsections'].append(subsection)
                    
                    if section['subsections']:
                        sections.append(section)
                
                # Check if this is section 1 (Complete the following)
                elif full_text.startswith('1Complete the following'):
                    section = {
                        'number': '1',
                        'title': 'Complete the following',
                        'courses': [],
                        'structure': 'sequence'
                    }
                    
                    # Find all course rows in this section
                    course_lines = group_container.find_all('div', class_='courseLine')
                    
                    # For receiving courses (target institution requirements)
                    for course_line in course_lines:
                        # Check if this is a receiving course (target institution side)
                        if course_line.find_parent('div', class_='rowReceiving'):
                            code, title, units = extract_course_info(course_line)
                            if code:
                                section['courses'].append({
                                    'code': code,
                                    'title': title,
                                    'units': units,
                                    'type': 'receiving'
                                })
                    
                    sections.append(section)
                    
                # Check if this is section 2 (Complete A or B) - but not part of HIGHLY RECOMMENDED
                elif full_text.startswith('2Complete') and ('A' in full_text and 'B' in full_text) and 'HIGHLY RECOMMENDED' not in full_text:
                    section = {
                        'number': '2',
                        'title': 'Complete A or B',
                        'options': [],
                        'structure': 'choice'
                    }
                    
                    # Find sections marked with emphasis--section
                    section_mains = group_container.find_all('div', class_='sectionMain')
                    
                    option_letter = 'A'
                    for section_main in section_mains:
                        option = {
                            'letter': option_letter,
                            'courses': []
                        }
                        
                        # Find course lines in this section
                        course_lines = section_main.find_all('div', class_='courseLine')
                        for course_line in course_lines:
                            # Check if this is a receiving course (target institution side)
                            if course_line.find_parent('div', class_='rowReceiving'):
                                code, title, units = extract_course_info(course_line)
                                if code:
                                    option['courses'].append({
                                        'code': code,
                                        'title': title,
                                        'units': units
                                    })
                        
                        if option['courses']:
                            section['options'].append(option)
                            option_letter = chr(ord(option_letter) + 1)
                    
                    sections.append(section)
            
            return sections

        def get_sending_requirements(container):
            """Get the sending institution (source college) course requirements"""
            # Find all bracket wrappers which contain the source institution course requirements
            bracket_wrappers = container.find_all('div', class_='bracketWrapper')
            
            # Group courses by their section/requirement
            section_groups = {}
            
            # Also look for articulation rows that contain course mappings
            artic_rows = container.find_all('div', class_='articRow')
            
            for artic_row in artic_rows:
                # Get the target institution course this fulfills
                receiving_course = artic_row.find('div', class_='rowReceiving')
                if receiving_course:
                    target_course_line = receiving_course.find('div', class_='courseLine')
                    if target_course_line:
                        target_code, target_title, target_units = extract_course_info(target_course_line)
                        
                        # Create a key for this target course
                        if target_code:
                            key = f"{target_code}"
                            if key not in section_groups:
                                section_groups[key] = []
                            
                            # Get source institution courses that fulfill this requirement
                            sending_side = artic_row.find('div', class_='rowSending')
                            if sending_side:
                                # Look for bracket wrappers (OR groups)
                                bracket_wrappers_in_row = sending_side.find_all('div', class_='bracketWrapper')
                                
                                if bracket_wrappers_in_row:
                                    # Handle OR groups
                                    for wrapper in bracket_wrappers_in_row:
                                        group = []
                                        course_lines = wrapper.find_all('div', class_='courseLine')
                                        for course_line in course_lines:
                                            code, title, units = extract_course_info(course_line)
                                            if code:
                                                group.append({
                                                    'code': code,
                                                    'title': title,
                                                    'units': units
                                                })
                                        
                                        if group:
                                            section_groups[key].append(group)
                                else:
                                    # Handle single courses (no OR groups)
                                    course_lines = sending_side.find_all('div', class_='courseLine')
                                    if course_lines:
                                        group = []
                                        for course_line in course_lines:
                                            code, title, units = extract_course_info(course_line)
                                            if code:
                                                group.append({
                                                    'code': code,
                                                    'title': title,
                                                    'units': units
                                                })
                                        
                                        if group:
                                            section_groups[key].append(group)
                                    else:
                                        # No course articulated
                                        section_groups[key].append([{
                                            'code': 'NO_COURSE',
                                            'title': 'No Course Articulated',
                                            'units': ''
                                        }])
            
            # Fallback: use the original bracket wrapper method for any missed courses
            for wrapper in bracket_wrappers:
                # Find parent articRow to determine which target requirement this fulfills
                parent_row = wrapper.find_parent('div', class_='articRow')
                if parent_row:
                    # Get the target institution course this fulfills
                    receiving_course = parent_row.find('div', class_='rowReceiving')
                    if receiving_course:
                        target_course_line = receiving_course.find('div', class_='courseLine')
                        if target_course_line:
                            target_code, target_title, target_units = extract_course_info(target_course_line)
                            key = f"{target_code}"
                            
                            # Only add if we haven't already processed this target course
                            if key not in section_groups:
                                section_groups[key] = []
                                
                                # Get source institution courses in this option
                                group = []
                                course_lines = wrapper.find_all('div', class_='courseLine')
                                for course_line in course_lines:
                                    code, title, units = extract_course_info(course_line)
                                    if code:
                                        group.append({
                                            'code': code,
                                            'title': title,
                                            'units': units
                                        })
                                
                                if group:
                                    section_groups[key].append(group)
            
            return section_groups

        # Parse the data
        sections = parse_articulation_structure(soup)
        sending_requirements = get_sending_requirements(soup)
        
        # Create structured data to return
        result = {
            'academic_year': academic_year,
            'source_institution': institution,
            'target_institution': target_institution,
            'major': major_filter,
            'target_requirements': sections,
            'source_requirements': sending_requirements
        }
        
        return {
            "success": True,
            "data": result,
            "error": None
        }

    except Exception as e:
        print(f"❌ Selenium error during scraping: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "data": {}
        }
    finally:
        try:
            driver.quit()
        except:
            pass  # Ignore errors when closing driver

def _get_fallback_data(academic_year, institution, target_institution, major_filter):
    """
    Provide fallback mock data when ASSIST.org scraping fails
    This ensures the system continues to work even when scraping fails
    """
    print(f"📚 Generating fallback data for {major_filter} transfer requirements...")
    
    # Generate some common transfer requirements based on the major
    major_lower = major_filter.lower()
    
    # Common course patterns for different majors
    if 'computer science' in major_lower or 'cs' in major_lower:
        source_requirements = {
            "Programming Fundamentals": [
                [{"code": "CS 1A", "title": "Object-Oriented Programming", "units": "4.5"}],
                [{"code": "CS 1B", "title": "Advanced Programming", "units": "4.5"}]
            ],
            "Mathematics for CS": [
                [{"code": "MATH 1A", "title": "Calculus I", "units": "5"}],
                [{"code": "MATH 1B", "title": "Calculus II", "units": "5"}],
                [{"code": "MATH 1C", "title": "Calculus III", "units": "5"}]
            ],
            "Physics Requirements": [
                [{"code": "PHYS 4A", "title": "Physics for Engineers I", "units": "5"}],
                [{"code": "PHYS 4B", "title": "Physics for Engineers II", "units": "5"}]
            ]
        }
    elif 'math' in major_lower:
        source_requirements = {
            "Calculus Sequence": [
                [{"code": "MATH 1A", "title": "Calculus I", "units": "5"}],
                [{"code": "MATH 1B", "title": "Calculus II", "units": "5"}],
                [{"code": "MATH 1C", "title": "Calculus III", "units": "5"}],
                [{"code": "MATH 1D", "title": "Calculus IV", "units": "5"}]
            ],
            "Linear Algebra": [
                [{"code": "MATH 2A", "title": "Linear Algebra", "units": "4"}]
            ],
            "Differential Equations": [
                [{"code": "MATH 2B", "title": "Differential Equations", "units": "4"}]
            ]
        }
    elif 'business' in major_lower:
        source_requirements = {
            "Business Core": [
                [{"code": "BUS 1A", "title": "Financial Accounting", "units": "4"}],
                [{"code": "BUS 1B", "title": "Managerial Accounting", "units": "4"}],
                [{"code": "BUS 10", "title": "Introduction to Business", "units": "4"}]
            ],
            "Economics": [
                [{"code": "ECON 1", "title": "Macroeconomics", "units": "4"}],
                [{"code": "ECON 2", "title": "Microeconomics", "units": "4"}]
            ],
            "Mathematics": [
                [{"code": "MATH 10", "title": "Business Mathematics", "units": "4"}],
                [{"code": "MATH 12", "title": "Statistics", "units": "4"}]
            ]
        }
    else:
        # Generic requirements for other majors
        source_requirements = {
            "General Education": [
                [{"code": "ENGL 1A", "title": "Composition and Reading", "units": "4"}],
                [{"code": "ENGL 1B", "title": "Critical Thinking and Writing", "units": "4"}]
            ],
            "Mathematics": [
                [{"code": "MATH 12", "title": "Statistics", "units": "4"}]
            ],
            "Major Prerequisites": [
                [{"code": "MAJOR 1", "title": f"Introduction to {major_filter}", "units": "3"}],
                [{"code": "MAJOR 2", "title": f"Fundamentals of {major_filter}", "units": "3"}]
            ]
        }
    
    result = {
        'academic_year': academic_year,
        'source_institution': institution,
        'target_institution': target_institution,
        'major': major_filter,
        'target_requirements': [],
        'source_requirements': source_requirements,
        'is_fallback': True,
        'fallback_reason': 'ASSIST.org scraping unavailable'
    }
    
    return {
        "success": True,
        "data": result,
        "error": None,
        "is_fallback": True
    }

def print_formatted_output(sections, source_requirements):
    """Print the De Anza College course requirements (right side data)"""
    print("\n" + "="*60)
    print("DE ANZA COLLEGE COURSE REQUIREMENTS")
    print("For Applied Mathematics/Applied Mathematics B.A.")
    print("Transfer to: University of California, Berkeley")
    print("Academic Year: 2024-2025")
    print("="*60)
    
    if not sections:
        print("No course requirements found in the articulation agreement.")
        return
    
    for section in sections:
        print(f"\n{section['number']}. {section['title']}")
        print("-" * 50)
        
        if section['structure'] == 'sequence':
            # Sequential requirements - courses you must take
            print("Required courses at De Anza College:")
            for i, course in enumerate(section['courses']):
                if course['units']:
                    print(f"   • {course['code']} - {course['title']} ({course['units']})")
                else:
                    print(f"   • {course['code']} - {course['title']}")
                
        elif section['structure'] == 'choice':
            # Multiple options to choose from
            print("Choose one of the following options:")
            for option in section['options']:
                print(f"\n   Option {option['letter']}:")
                for course in option['courses']:
                    if course['units']:
                        print(f"      • {course['code']} - {course['title']} ({course['units']})")
                    else:
                        print(f"      • {course['code']} - {course['title']}")
                    
                # Add AND/OR indicators
                if len(option['courses']) > 1:
                    print("        (Take ALL courses in this option)")
        
        print()

    print("\n" + "="*60)
    print("SUMMARY:")
    print("These are the courses you need to take at De Anza College")
    print("to fulfill the UC Berkeley Applied Mathematics requirements.")
    print("="*60)

def main():
    """Main function to handle command line arguments or default execution"""
    parser = argparse.ArgumentParser(description='Scrape ASSIST.org for transfer requirements')
    parser.add_argument('--academic-year', required=True, help='Academic year (e.g., 2024-2025)')
    parser.add_argument('--institution', required=True, help='Source institution name')
    parser.add_argument('--target-institution', required=True, help='Target institution name')
    parser.add_argument('--major', required=True, help='Major to filter for')
    parser.add_argument('--json-output', action='store_true', help='Output as JSON instead of formatted text')
    
    args = parser.parse_args()
    
    # Scrape the data
    data = scrape_assist_data(
        academic_year=args.academic_year,
        institution=args.institution,
        target_institution=args.target_institution,
        major_filter=args.major
    )
    
    if data is None:
        print("Failed to scrape data. Please check the error messages above.")
        return
    
    if args.json_output:
        import json
        print(json.dumps(data, indent=2))
    else:
        # Pass the target_requirements (sections) to the print function
        print_formatted_output(data['target_requirements'], data['source_requirements'])

if __name__ == "__main__":
    main()
