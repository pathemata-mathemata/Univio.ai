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
   * Validate email using Hunter.io API - REAL DATA ONLY
   */
  async validateEmail(email: string): Promise<EmailValidationResult> {
    if (!email || typeof email !== 'string') {
      throw new Error('Valid email address is required');
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (!this.apiKey) {
      throw new Error('Hunter.io API key not configured - email validation unavailable');
    }

    try {
      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(trimmedEmail)}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Hunter.io API authentication failed');
        } else if (response.status === 429) {
          throw new Error('Hunter.io API rate limit exceeded');
        } else {
          throw new Error(`Hunter.io API error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`Hunter.io API error: ${data.errors[0]?.details || 'Unknown error'}`);
      }

      return this.parseHunterResponse(data.data);

    } catch (error) {
      if (error instanceof Error && error.message.includes('Hunter.io')) {
        // Re-throw Hunter.io specific errors
        throw error;
      }
      // For network or other errors, throw a descriptive error
      throw new Error(`Email validation service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  private parseHunterResponse(data: any): EmailValidationResult {
    return {
      isValid: data.result === 'deliverable',
      isEduEmail: this.isEducationalEmail(data.email || ''),
      isDisposable: data.disposable || false,
      isFreeEmail: data.webmail || false,
      deliverability: data.result === 'deliverable' ? 'DELIVERABLE' : 
                      data.result === 'undeliverable' ? 'UNDELIVERABLE' : 'UNKNOWN',
      qualityScore: data.score || 0,
      errorMessage: data.result === 'deliverable' ? undefined : 'Email validation failed'
    };
  }

  
}

// Export singleton instance
export const emailValidationService = new EmailValidationService();

// Export types for use in components
export type { EmailValidationResult }; 