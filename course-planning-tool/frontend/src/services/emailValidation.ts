// Abstract Email Validation API Service
// Make sure to add your Abstract API key to environment variables

interface AbstractEmailValidationResponse {
  email: string;
  autocorrect: string;
  deliverability: 'DELIVERABLE' | 'UNDELIVERABLE' | 'RISKY' | 'UNKNOWN';
  quality_score: number;
  is_valid_format: {
    value: boolean;
    text: string;
  };
  is_free_email: {
    value: boolean;
    text: string;
  };
  is_disposable_email: {
    value: boolean;
    text: string;
  };
  is_role_email: {
    value: boolean;
    text: string;
  };
  is_catchall_email: {
    value: boolean;
    text: string;
  };
  is_mx_found: {
    value: boolean | null;
    text: string;
  };
  is_smtp_valid: {
    value: boolean | null;
    text: string;
  };
}

interface EmailValidationResult {
  isValid: boolean;
  isEduEmail: boolean;
  isDisposable: boolean;
  isFreeEmail: boolean;
  deliverability: string;
  qualityScore: number;
  suggestions?: string;
  errorMessage?: string;
}

class EmailValidationService {
  private apiKey: string;
  private baseUrl = 'https://emailvalidation.abstractapi.com/v1/';

  constructor() {
    // In production, use environment variables
    this.apiKey = process.env.NEXT_PUBLIC_ABSTRACT_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Abstract API key not found. Email validation will use fallback validation.');
    }
  }

  /**
   * Validate email using Abstract Email Validation API
   */
  async validateEmail(email: string): Promise<EmailValidationResult> {
    if (!email || !email.trim()) {
      return {
        isValid: false,
        isEduEmail: false,
        isDisposable: false,
        isFreeEmail: false,
        deliverability: 'UNDELIVERABLE',
        qualityScore: 0,
        errorMessage: 'Email address is required'
      };
    }

    // If no API key, use basic validation
    if (!this.apiKey) {
      return this.fallbackValidation(email);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?api_key=${this.apiKey}&email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key.');
        } else {
          throw new Error('Email validation service temporarily unavailable.');
        }
      }

      const data: AbstractEmailValidationResponse = await response.json();
      
      return {
        isValid: data.is_valid_format.value && data.deliverability !== 'UNDELIVERABLE',
        isEduEmail: this.isEducationalEmail(email),
        isDisposable: data.is_disposable_email.value,
        isFreeEmail: data.is_free_email.value,
        deliverability: data.deliverability,
        qualityScore: data.quality_score,
        suggestions: data.autocorrect || undefined
      };

    } catch (error) {
      console.error('Email validation error:', error);
      
      // Fallback to basic validation if API fails
      return this.fallbackValidation(email);
    }
  }

  /**
   * Specifically validate .edu emails for student verification
   */
  async validateEduEmail(email: string): Promise<EmailValidationResult & { isStudentEmail: boolean }> {
    const result = await this.validateEmail(email);
    
    return {
      ...result,
      isStudentEmail: result.isEduEmail && result.isValid && !result.isDisposable
    };
  }

  /**
   * Validate personal email (non-edu, non-disposable preferred)
   */
  async validatePersonalEmail(email: string): Promise<EmailValidationResult & { isRecommended: boolean }> {
    const result = await this.validateEmail(email);
    
    // Personal emails should be valid, not disposable, and ideally not role-based
    const isRecommended = result.isValid && 
                         !result.isDisposable && 
                         !result.isEduEmail &&
                         result.qualityScore > 0.7;
    
    return {
      ...result,
      isRecommended
    };
  }

  /**
   * Check if email domain is educational
   */
  private isEducationalEmail(email: string): boolean {
    if (!email || !email.includes('@')) return false;
    
    const domain = email.split('@')[1].toLowerCase();
    
    // Common educational domain patterns
    const eduPatterns = [
      /\.edu$/,           // .edu domains
      /\.edu\./,          // .edu subdomains
      /\.ac\./,           // Academic domains
      /\.k12\./,          // K-12 schools
      /college\.edu$/,
      /university\.edu$/,
      /school\.edu$/
    ];

    return eduPatterns.some(pattern => pattern.test(domain));
  }

  /**
   * Fallback validation when API is unavailable
   */
  private fallbackValidation(email: string): EmailValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    const isEduEmail = this.isEducationalEmail(email);
    
    // Basic disposable email detection
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'throwaway.email'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase() || '';
    const isDisposable = disposableDomains.includes(domain);
    
    // Basic free email detection
    const freeEmailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'icloud.com', 'protonmail.com'
    ];
    
    const isFreeEmail = freeEmailDomains.includes(domain);

    return {
      isValid,
      isEduEmail,
      isDisposable,
      isFreeEmail,
      deliverability: isValid ? 'UNKNOWN' : 'UNDELIVERABLE',
      qualityScore: isValid ? 0.7 : 0,
      errorMessage: isValid ? undefined : 'Invalid email format'
    };
  }
}

// Export singleton instance
export const emailValidationService = new EmailValidationService();

// Export types for use in components
export type { EmailValidationResult }; 