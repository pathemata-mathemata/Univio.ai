// Simple Email Validation Service for Resend Integration
// No external APIs required - uses local validation + Resend verification

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
  // Common disposable email domains
  private disposableDomains = new Set([
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'yopmail.com', 'getnada.com',
    'maildrop.cc', 'sharklasers.com', 'guerrillamail.info', 'guerrillamail.net',
    'guerrillamail.org', 'guerrillamail.biz', 'spam4.me', 'grr.la',
    'guerrillamailblock.com', 'pokemail.net', 'spamherald.com', 'spamthisplease.com'
  ]);

  // Common free email providers
  private freeEmailDomains = new Set([
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com',
    'live.com', 'msn.com', 'yahoo.co.uk', 'googlemail.com'
  ]);

  // Common typos and their corrections
  private commonTypos: Record<string, string> = {
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com'
  };

  /**
   * Basic email validation without external APIs
   */
  async validateEmail(email: string): Promise<EmailValidationResult> {
    if (!email || typeof email !== 'string') {
      throw new Error('Valid email address is required');
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        isValid: false,
        isEduEmail: false,
        isDisposable: false,
        isFreeEmail: false,
        deliverability: 'INVALID',
        qualityScore: 0,
        errorMessage: 'Please enter a valid email address'
      };
    }

    const domain = trimmedEmail.split('@')[1];
    
    // Check for common typos
    if (this.commonTypos[domain]) {
      return {
        isValid: false,
        isEduEmail: false,
        isDisposable: false,
        isFreeEmail: false,
        deliverability: 'INVALID',
        qualityScore: 0,
        suggestions: trimmedEmail.replace(domain, this.commonTypos[domain]),
        errorMessage: `Did you mean ${this.commonTypos[domain]}?`
      };
    }

    const isEduEmail = this.isEducationalEmail(trimmedEmail);
    const isDisposable = this.disposableDomains.has(domain);
    const isFreeEmail = this.freeEmailDomains.has(domain);

    // Block disposable emails
    if (isDisposable) {
      return {
        isValid: false,
        isEduEmail,
        isDisposable: true,
        isFreeEmail,
        deliverability: 'UNDELIVERABLE',
        qualityScore: 0,
        errorMessage: 'Disposable email addresses are not allowed'
      };
    }

    // Calculate quality score
    let qualityScore = 0.7; // Base score
    if (isEduEmail) qualityScore += 0.2;
    if (!isFreeEmail) qualityScore += 0.1;
    qualityScore = Math.min(qualityScore, 1.0);

    return {
      isValid: true,
      isEduEmail,
      isDisposable: false,
      isFreeEmail,
      deliverability: 'DELIVERABLE',
      qualityScore,
    };
  }

  /**
   * Specifically validate .edu emails for student verification
   */
  async validateEduEmail(email: string): Promise<EmailValidationResult & { isStudentEmail: boolean }> {
    const result = await this.validateEmail(email);
    
    if (!result.isValid) {
      return {
        ...result,
        isStudentEmail: false
      };
    }

    // For .edu emails, we're more permissive since verification happens via Resend
    const isStudentEmail = result.isEduEmail && result.isValid && !result.isDisposable;
    
    return {
      ...result,
      isStudentEmail
    };
  }

  /**
   * Validate personal email (non-edu, non-disposable preferred)
   */
  async validatePersonalEmail(email: string): Promise<EmailValidationResult & { isRecommended: boolean }> {
    const result = await this.validateEmail(email);
    
    if (!result.isValid) {
      return {
        ...result,
        isRecommended: false
      };
    }

    // Personal emails should be valid, not disposable, and ideally not .edu
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
      /\.ac\./,           // Academic domains (international)
      /\.k12\./,          // K-12 schools
      /college\.edu$/,
      /university\.edu$/,
      /school\.edu$/,
      // Add some specific known educational domains
      /\.ac\.uk$/,        // UK academic
      /\.edu\.au$/,       // Australian education
      /\.edu\.ca$/,       // Canadian education
    ];

    return eduPatterns.some(pattern => pattern.test(domain));
  }
}

// Export singleton instance
export const emailValidationService = new EmailValidationService();

// Export types for use in components
export type { EmailValidationResult }; 