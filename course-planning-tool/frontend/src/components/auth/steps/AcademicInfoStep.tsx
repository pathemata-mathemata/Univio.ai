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
  'Allan Hancock College',
  'American River College',
  'Antelope Valley College',
  'Bakersfield College',
  'Barstow Community College',
  'Berkeley City College',
  'Butte College',
  'Cabrillo College',
  'Cañada College',
  'Cerro Coso Community College',
  'Cerritos College',
  'Chabot College',
  'Chaffey College',
  'Citrus College',
  'City College of San Francisco',
  'College of Alameda',
  'College of Marin',
  'College of San Mateo',
  'College of the Sequoias',
  'Columbia College',
  'Compton College',
  'Contra Costa College',
  'Cosumnes River College',
  'Cuesta College',
  'Cuyamaca College',
  'Cypress College',
  'De Anza College',
  'Diablo Valley College',
  'East Los Angeles College',
  'El Camino College',
  'Evergreen Valley College',
  'Feather River College',
  'Folsom Lake College',
  'Foothill College',
  'Fresno City College',
  'Fullerton College',
  'Gavilan College',
  'Glendale Community College',
  'Golden West College',
  'Grossmont College',
  'Hartnell College',
  'Imperial Valley College',
  'Irvine Valley College',
  'Kings River College',
  'Laney College',
  'Las Positas College',
  'Lassen Community College',
  'Long Beach City College',
  'Los Angeles City College',
  'Los Angeles Harbor College',
  'Los Angeles Mission College',
  'Los Angeles Pierce College',
  'Los Angeles Southwest College',
  'Los Angeles Trade-Technical College',
  'Los Angeles Valley College',
  'Los Medanos College',
  'Mendocino College',
  'Merced College',
  'Merritt College',
  'MiraCosta College',
  'Mission College',
  'Modesto Junior College',
  'Monterey Peninsula College',
  'Moorpark College',
  'Mt. San Antonio College',
  'Napa Valley College',
  'Ohlone College',
  'Orange Coast College',
  'Oxnard College',
  'Palomar College',
  'Palo Verde College',
  'Pasadena City College',
  'Porterville College',
  'Reedley College',
  'Rio Hondo College',
  'Sacramento City College',
  'Saddleback College',
  'San Diego City College',
  'San Diego Mesa College',
  'San Diego Miramar College',
  'San Joaquin Delta College',
  'San Jose City College',
  'Santa Monica College',
  'Santa Rosa Junior College',
  'Santiago Canyon College',
  'Shasta College',
  'Sierra College',
  'Skyline College',
  'Solano Community College',
  'Southwestern College',
  'Taft College',
  'Ventura College',
  'Victor Valley College',
  'West Hills College Coalinga',
  'West Hills College Lemoore',
  'West Los Angeles College',
  'West Valley College',
  'Yuba College',
  
  // Out-of-State Community Colleges (sorted)
  'Arizona State University (Community College)',
  'Austin Community College',
  'Houston Community College',
  'Mesa Community College',
  'Miami Dade College',
  'Northern Virginia Community College',
  'Phoenix College',
  'Scottsdale Community College',
  'Tarrant County College'
].sort().concat(['Other']); // Sort alphabetically and add Other at the end

const targetInstitutions = [
  // UC System
  'UC Berkeley',
  'UC Davis',
  'UC Irvine',
  'UC Los Angeles (UCLA)',
  'UC Merced',
  'UC Riverside',
  'UC San Diego',
  'UC Santa Barbara',
  'UC Santa Cruz',
  
  // CSU System
  'Cal Maritime',
  'Cal Poly Pomona',
  'Cal Poly San Luis Obispo',
  'Cal State Channel Islands',
  'Cal State Dominguez Hills',
  'Cal State East Bay',
  'Cal State Fresno',
  'Cal State Fullerton',
  'Cal State Long Beach',
  'Cal State Los Angeles',
  'Cal State Monterey Bay',
  'Cal State Northridge',
  'Cal State Sacramento',
  'Cal State San Bernardino',
  'Cal State San Marcos',
  'Cal State Stanislaus',
  'Chico State',
  'Humboldt State',
  'San Diego State',
  'San Francisco State',
  'San Jose State',
  'Sonoma State',
  
  // Private California Universities
  'California Institute of Technology (Caltech)',
  'Chapman University',
  'Claremont McKenna College',
  'Dominican University',
  'Harvey Mudd College',
  'Loyola Marymount University',
  'Mills College',
  'Occidental College',
  'Pepperdine University',
  'Pitzer College',
  'Pomona College',
  'Saint Mary\'s College',
  'Santa Clara University',
  'Scripps College',
  'Stanford University',
  'University of San Diego',
  'University of the Pacific',
  'USC',
  
  // Out-of-State Universities
  'Arizona State University',
  'Colorado State University',
  'Columbia University',
  'Cornell University',
  'Harvard University',
  'MIT',
  'New York University',
  'Northwestern University',
  'Oregon State University',
  'Princeton University',
  'Texas A&M University',
  'University of Arizona',
  'University of Chicago',
  'University of Colorado Boulder',
  'University of Nevada Las Vegas',
  'University of Nevada Reno',
  'University of Oregon',
  'University of Texas Austin',
  'University of Washington',
  'Yale University'
].sort().concat(['Other']); // Sort alphabetically and add Other at the end

const commonMajors = [
  // All majors combined and sorted
  'Accounting',
  'Advertising',
  'Aerospace Engineering',
  'Agriculture',
  'Agricultural Business',
  'Anthropology',
  'Applied Economics',
  'Applied Mathematics',
  'Architecture',
  'Art',
  'Art History',
  'Astronomy',
  'Biochemistry',
  'Biology',
  'Biomedical Engineering',
  'Biotechnology',
  'Business Administration',
  'Business Economics',
  'Chemical Engineering',
  'Chemistry',
  'Chinese',
  'Civil Engineering',
  'Classics',
  'Communications',
  'Computer Engineering',
  'Computer Science',
  'Conservation Biology',
  'Creative Writing',
  'Criminal Justice',
  'Cybersecurity',
  'Dance',
  'Data Science',
  'Digital Media',
  'Early Childhood Education',
  'Economics',
  'Education',
  'Educational Psychology',
  'Electrical Engineering',
  'Elementary Education',
  'English',
  'English Literature',
  'Entrepreneurship',
  'Environmental Engineering',
  'Environmental Science',
  'Environmental Studies',
  'Ethnic Studies',
  'Exercise Science',
  'Fashion Design',
  'Film Studies',
  'Finance',
  'Fine Arts',
  'Foreign Languages',
  'Forestry',
  'French',
  'Gender Studies',
  'General Studies',
  'Geology',
  'Graphic Design',
  'Health Sciences',
  'History',
  'Human Development',
  'Industrial Design',
  'Industrial Engineering',
  'Information Systems',
  'Interdisciplinary Studies',
  'Interior Design',
  'International Business',
  'International Relations',
  'Japanese',
  'Journalism',
  'Kinesiology',
  'Legal Studies',
  'Liberal Studies',
  'Linguistics',
  'Management',
  'Marine Biology',
  'Marketing',
  'Materials Science',
  'Mathematics',
  'Mechanical Engineering',
  'Media Studies',
  'Microbiology',
  'Molecular Biology',
  'Music',
  'Nursing',
  'Nutrition',
  'Occupational Therapy',
  'Paralegal Studies',
  'Philosophy',
  'Photography',
  'Physical Therapy',
  'Physics',
  'Political Science',
  'Pre-Dental',
  'Pre-Law',
  'Pre-Med',
  'Pre-Pharmacy',
  'Pre-Veterinary',
  'Psychology',
  'Public Health',
  'Public Relations',
  'Religious Studies',
  'Secondary Education',
  'Social Work',
  'Sociology',
  'Software Engineering',
  'Spanish',
  'Special Education',
  'Sports Medicine',
  'Statistics',
  'Television Production',
  'Theatre Arts',
  'Undeclared'
].sort().concat(['Other']); // Sort alphabetically and add Other at the end

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
          </select>
          
          {showCurrentInstitutionOther && (
            <Input
              placeholder="Enter your current institution name"
              value={data.currentInstitution === 'Other' ? '' : data.currentInstitution}
              onChange={(e) => handleFieldChange('currentInstitution', e.target.value)}
              className={errors.currentInstitution ? 'border-red-500' : ''}
              autoFocus
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#111416] ${
              errors.currentMajor ? 'border-red-500' : 'border-[#e5e8ea]'
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
              placeholder="Enter your major name"
              value={data.currentMajor === 'Other' ? '' : data.currentMajor}
              onChange={(e) => handleFieldChange('currentMajor', e.target.value)}
              className={errors.currentMajor ? 'border-red-500' : ''}
              autoFocus
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#111416] ${
              errors.expectedTransferQuarter ? 'border-red-500' : 'border-[#e5e8ea]'
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#111416] ${
              errors.expectedTransferYear ? 'border-red-500' : 'border-[#e5e8ea]'
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#111416] ${
              errors.targetInstitution ? 'border-red-500' : 'border-[#e5e8ea]'
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
              placeholder="Enter target institution name"
              value={data.targetInstitution === 'Other' ? '' : data.targetInstitution}
              onChange={(e) => handleFieldChange('targetInstitution', e.target.value)}
              className={errors.targetInstitution ? 'border-red-500' : ''}
              autoFocus
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#111416] ${
              errors.targetMajor ? 'border-red-500' : 'border-[#e5e8ea]'
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
              placeholder="Enter target major name"
              value={data.targetMajor === 'Other' ? '' : data.targetMajor}
              onChange={(e) => handleFieldChange('targetMajor', e.target.value)}
              className={errors.targetMajor ? 'border-red-500' : ''}
              autoFocus
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