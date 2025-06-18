"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, GraduationCap, Building2, Calendar, Target } from 'lucide-react';
import { RegistrationData } from '../MultiStepRegistration';

interface AcademicInfoStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const commonInstitutions = [
  // California Community Colleges - Los Angeles Area
  'Los Angeles City College',
  'Los Angeles Harbor College', 
  'Los Angeles Mission College',
  'Los Angeles Pierce College',
  'Los Angeles Southwest College',
  'Los Angeles Trade-Technical College',
  'Los Angeles Valley College',
  'East Los Angeles College',
  'West Los Angeles College',
  'Santa Monica College',
  'Pasadena City College',
  'Glendale Community College',
  'Citrus College',
  'Mt. San Antonio College',
  'Rio Hondo College',
  'El Camino College',
  'Compton College',
  'Long Beach City College',
  'Cerritos College',
  'Cypress College',
  'Fullerton College',
  'Golden West College',
  'Orange Coast College',
  'Santiago Canyon College',
  'Irvine Valley College',
  'Saddleback College',
  'Moorpark College',
  'Oxnard College',
  'Ventura College',
  
  // San Francisco Bay Area
  'De Anza College',
  'Foothill College',
  'Mission College',
  'West Valley College',
  'San Jose City College',
  'Evergreen Valley College',
  'Gavilan College',
  'Ohlone College',
  'Chabot College',
  'Las Positas College',
  'Laney College',
  'Berkeley City College',
  'College of Alameda',
  'Merritt College',
  'Diablo Valley College',
  'Los Medanos College',
  'Contra Costa College',
  'College of San Mateo',
  'Cañada College',
  'Skyline College',
  'City College of San Francisco',
  'College of Marin',
  'Santa Rosa Junior College',
  'Napa Valley College',
  'Solano Community College',
  
  // Central Valley
  'American River College',
  'Sacramento City College',
  'Cosumnes River College',
  'Folsom Lake College',
  'Sierra College',
  'Yuba College',
  'Butte College',
  'Shasta College',
  'Lassen Community College',
  'Feather River College',
  'Modesto Junior College',
  'San Joaquin Delta College',
  'Columbia College',
  'Merced College',
  'Fresno City College',
  'Reedley College',
  'Kings River College',
  'West Hills College Coalinga',
  'West Hills College Lemoore',
  'Porterville College',
  'College of the Sequoias',
  'Bakersfield College',
  'Cerro Coso Community College',
  'Taft College',
  
  // San Diego Area
  'San Diego City College',
  'San Diego Mesa College',
  'San Diego Miramar College',
  'Grossmont College',
  'Cuyamaca College',
  'Southwestern College',
  'Imperial Valley College',
  'MiraCosta College',
  'Palomar College',
  
  // Other California Colleges
  'Allan Hancock College',
  'Antelope Valley College',
  'Barstow Community College',
  'Cabrillo College',
  'Cuesta College',
  'Hartnell College',
  'Mendocino College',
  'Monterey Peninsula College',
  'Palo Verde College',
  'Victor Valley College',
  
  // Out-of-State Community Colleges
  'Northern Virginia Community College',
  'Miami Dade College',
  'Houston Community College',
  'Austin Community College',
  'Tarrant County College',
  'Arizona State University (Community College)',
  'Phoenix College',
  'Mesa Community College',
  'Scottsdale Community College',
  'Other'
];

const targetInstitutions = [
  // UC System
  'UC Berkeley',
  'UC Los Angeles (UCLA)',
  'UC San Diego',
  'UC Davis',
  'UC Irvine',
  'UC Santa Barbara',
  'UC Santa Cruz',
  'UC Riverside',
  'UC Merced',
  
  // CSU System
  'Cal State Los Angeles',
  'Cal State Long Beach',
  'Cal State Northridge',
  'Cal State Fullerton',
  'Cal State Dominguez Hills',
  'Cal State East Bay',
  'Cal State Fresno',
  'Cal State Sacramento',
  'Cal State San Bernardino',
  'Cal State San Marcos',
  'Cal State Stanislaus',
  'Cal State Channel Islands',
  'Cal State Monterey Bay',
  'San Diego State',
  'San Francisco State',
  'San Jose State',
  'Cal Poly San Luis Obispo',
  'Cal Poly Pomona',
  'Humboldt State',
  'Chico State',
  'Sonoma State',
  'Cal Maritime',
  
  // Private California Universities
  'USC',
  'Stanford University',
  'California Institute of Technology (Caltech)',
  'Claremont McKenna College',
  'Pomona College',
  'Harvey Mudd College',
  'Pitzer College',
  'Scripps College',
  'Occidental College',
  'University of San Diego',
  'Santa Clara University',
  'Loyola Marymount University',
  'Pepperdine University',
  'Chapman University',
  'University of the Pacific',
  'Mills College',
  'Dominican University',
  'Saint Mary\'s College',
  
  // Out-of-State Universities
  'University of Washington',
  'University of Oregon',
  'Oregon State University',
  'Arizona State University',
  'University of Arizona',
  'University of Nevada Las Vegas',
  'University of Nevada Reno',
  'University of Texas Austin',
  'Texas A&M University',
  'University of Colorado Boulder',
  'Colorado State University',
  'New York University',
  'Columbia University',
  'Cornell University',
  'Harvard University',
  'MIT',
  'Yale University',
  'Princeton University',
  'University of Chicago',
  'Northwestern University',
  'Other'
];

const commonMajors = [
  // STEM Fields
  'Computer Science',
  'Computer Engineering',
  'Software Engineering',
  'Data Science',
  'Information Systems',
  'Cybersecurity',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biomedical Engineering',
  'Aerospace Engineering',
  'Environmental Engineering',
  'Industrial Engineering',
  'Materials Science',
  'Mathematics',
  'Applied Mathematics',
  'Statistics',
  'Physics',
  'Chemistry',
  'Biology',
  'Biochemistry',
  'Molecular Biology',
  'Microbiology',
  'Biotechnology',
  'Environmental Science',
  'Geology',
  'Astronomy',
  
  // Business & Economics
  'Business Administration',
  'Accounting',
  'Finance',
  'Marketing',
  'Management',
  'International Business',
  'Entrepreneurship',
  'Economics',
  'Applied Economics',
  'Business Economics',
  
  // Health Sciences
  'Pre-Med',
  'Pre-Dental',
  'Pre-Pharmacy',
  'Pre-Veterinary',
  'Nursing',
  'Public Health',
  'Health Sciences',
  'Kinesiology',
  'Exercise Science',
  'Sports Medicine',
  'Physical Therapy',
  'Occupational Therapy',
  'Nutrition',
  
  // Social Sciences
  'Psychology',
  'Sociology',
  'Anthropology',
  'Political Science',
  'International Relations',
  'Criminal Justice',
  'Social Work',
  'Human Development',
  'Gender Studies',
  'Ethnic Studies',
  
  // Liberal Arts & Humanities
  'English',
  'English Literature',
  'Creative Writing',
  'History',
  'Philosophy',
  'Religious Studies',
  'Art History',
  'Classics',
  'Linguistics',
  'Foreign Languages',
  'Spanish',
  'French',
  'Chinese',
  'Japanese',
  
  // Communications & Media
  'Communications',
  'Journalism',
  'Media Studies',
  'Film Studies',
  'Television Production',
  'Digital Media',
  'Public Relations',
  'Advertising',
  
  // Arts & Design
  'Art',
  'Fine Arts',
  'Graphic Design',
  'Industrial Design',
  'Fashion Design',
  'Interior Design',
  'Architecture',
  'Music',
  'Theatre Arts',
  'Dance',
  'Photography',
  
  // Education
  'Education',
  'Elementary Education',
  'Secondary Education',
  'Special Education',
  'Early Childhood Education',
  'Educational Psychology',
  
  // Legal & Pre-Professional
  'Pre-Law',
  'Legal Studies',
  'Paralegal Studies',
  
  // Agriculture & Environmental
  'Agriculture',
  'Agricultural Business',
  'Environmental Studies',
  'Forestry',
  'Marine Biology',
  'Conservation Biology',
  
  // Other Popular Majors
  'Undeclared',
  'General Studies',
  'Liberal Studies',
  'Interdisciplinary Studies',
  'Other'
];

const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

export function AcademicInfoStep({ data, updateData, onNext, onPrev, isLoading }: AcademicInfoStepProps) {
  const [errors, setErrors] = useState<{
    currentInstitution?: string;
    currentMajor?: string;
    currentGPA?: string;
    expectedTransferYear?: string;
    expectedTransferQuarter?: string;
    targetInstitution?: string;
    targetMajor?: string;
  }>({});

  const [showCurrentInstitutionOther, setShowCurrentInstitutionOther] = useState(false);
  const [showTargetInstitutionOther, setShowTargetInstitutionOther] = useState(false);
  const [showCurrentMajorOther, setShowCurrentMajorOther] = useState(false);
  const [showTargetMajorOther, setShowTargetMajorOther] = useState(false);

  const validateGPA = (gpa: string): boolean => {
    const gpaNum = parseFloat(gpa);
    return !isNaN(gpaNum) && gpaNum >= 0 && gpaNum <= 4.0;
  };

  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
    updateData({ [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!data.currentInstitution) {
      newErrors.currentInstitution = 'Current institution is required';
    }

    if (!data.currentMajor) {
      newErrors.currentMajor = 'Current major is required';
    }

    if (!data.currentGPA) {
      newErrors.currentGPA = 'Current GPA is required';
    } else if (!validateGPA(data.currentGPA)) {
      newErrors.currentGPA = 'Please enter a valid GPA between 0.0 and 4.0';
    }

    if (!data.expectedTransferYear) {
      newErrors.expectedTransferYear = 'Expected transfer year is required';
    }

    if (!data.expectedTransferQuarter) {
      newErrors.expectedTransferQuarter = 'Expected transfer quarter is required';
    }

    if (!data.targetInstitution) {
      newErrors.targetInstitution = 'Target institution is required';
    }

    if (!data.targetMajor) {
      newErrors.targetMajor = 'Target major is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatGPA = (input: string): string => {
    // Allow only numbers and one decimal point
    const cleaned = input.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return cleaned;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#eff2f4] rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-[#111416]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111416] mb-2">Academic Information</h2>
        <p className="text-[#607589]">
          Tell us about your current academic status and transfer goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Institution */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Institution
          </label>
          <select
            value={data.currentInstitution}
            onChange={(e) => {
              const value = e.target.value;
              handleFieldChange('currentInstitution', value);
              setShowCurrentInstitutionOther(value === 'Other');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#111416] ${
              errors.currentInstitution ? 'border-red-500' : 'border-[#e5e8ea]'
            }`}
          >
            <option value="">Select your current college</option>
            {commonInstitutions.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          
          {showCurrentInstitutionOther && (
            <Input
              placeholder="Enter your current institution"
              value={data.currentInstitution === 'Other' ? '' : data.currentInstitution}
              onChange={(e) => handleFieldChange('currentInstitution', e.target.value)}
              className={errors.currentInstitution ? 'border-red-500' : ''}
            />
          )}
          
          {errors.currentInstitution && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.currentInstitution}
            </div>
          )}
        </div>

        {/* Current Major */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Major
          </label>
          <select
            value={data.currentMajor}
            onChange={(e) => {
              const value = e.target.value;
              handleFieldChange('currentMajor', value);
              setShowCurrentMajorOther(value === 'Other');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.currentMajor ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your major</option>
            {commonMajors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          
          {showCurrentMajorOther && (
            <Input
              placeholder="Enter your major"
              value={data.currentMajor === 'Other' ? '' : data.currentMajor}
              onChange={(e) => handleFieldChange('currentMajor', e.target.value)}
              className={errors.currentMajor ? 'border-red-500' : ''}
            />
          )}
          
          {errors.currentMajor && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.currentMajor}
            </div>
          )}
        </div>

        {/* Current GPA */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current GPA
          </label>
          <Input
            type="text"
            placeholder="3.50"
            value={data.currentGPA}
            onChange={(e) => handleFieldChange('currentGPA', formatGPA(e.target.value))}
            className={errors.currentGPA ? 'border-red-500' : ''}
          />
          {errors.currentGPA && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.currentGPA}
            </div>
          )}
          <p className="text-xs text-gray-500">Enter your current cumulative GPA (0.0 - 4.0)</p>
        </div>

        {/* Expected Transfer Quarter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Expected Transfer Quarter
          </label>
          <select
            value={data.expectedTransferQuarter}
            onChange={(e) => handleFieldChange('expectedTransferQuarter', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expectedTransferQuarter ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select quarter</option>
            {quarters.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
          {errors.expectedTransferQuarter && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.expectedTransferQuarter}
            </div>
          )}
        </div>

        {/* Expected Transfer Year */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Expected Transfer Year
          </label>
          <select
            value={data.expectedTransferYear}
            onChange={(e) => handleFieldChange('expectedTransferYear', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expectedTransferYear ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          {errors.expectedTransferYear && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.expectedTransferYear}
            </div>
          )}
        </div>

        {/* Target Institution */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Target Institution
          </label>
          <select
            value={data.targetInstitution}
            onChange={(e) => {
              const value = e.target.value;
              handleFieldChange('targetInstitution', value);
              setShowTargetInstitutionOther(value === 'Other');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.targetInstitution ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select target university</option>
            {targetInstitutions.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))}
          </select>
          
          {showTargetInstitutionOther && (
            <Input
              placeholder="Enter target institution"
              value={data.targetInstitution === 'Other' ? '' : data.targetInstitution}
              onChange={(e) => handleFieldChange('targetInstitution', e.target.value)}
              className={errors.targetInstitution ? 'border-red-500' : ''}
            />
          )}
          
          {errors.targetInstitution && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.targetInstitution}
            </div>
          )}
        </div>

        {/* Target Major */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Target Major
          </label>
          <select
            value={data.targetMajor}
            onChange={(e) => {
              const value = e.target.value;
              handleFieldChange('targetMajor', value);
              setShowTargetMajorOther(value === 'Other');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.targetMajor ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select target major</option>
            {commonMajors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          
          {showTargetMajorOther && (
            <Input
              placeholder="Enter target major"
              value={data.targetMajor === 'Other' ? '' : data.targetMajor}
              onChange={(e) => handleFieldChange('targetMajor', e.target.value)}
              className={errors.targetMajor ? 'border-red-500' : ''}
            />
          )}
          
          {errors.targetMajor && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.targetMajor}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={isLoading} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
} 