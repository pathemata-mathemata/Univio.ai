// Shared verification code storage
// In production, use Redis or a database instead of in-memory storage

interface VerificationData {
  code: string;
  expires: number;
  attempts: number;
  email: string;
  createdAt: number;
}

class VerificationStore {
  private store = new Map<string, VerificationData>();

  // Store a verification code
  set(email: string, code: string, expiresInMinutes: number = 10): void {
    const expires = Date.now() + (expiresInMinutes * 60 * 1000);
    this.store.set(email.toLowerCase(), {
      code,
      expires,
      attempts: 0,
      email: email.toLowerCase(),
      createdAt: Date.now()
    });
    
    console.log(`📝 Stored verification code for ${email}: ${code} (expires in ${expiresInMinutes}min)`);
  }

  // Get verification data
  get(email: string): VerificationData | null {
    return this.store.get(email.toLowerCase()) || null;
  }

  // Check if code exists and is valid
  isValid(email: string): boolean {
    const data = this.get(email);
    if (!data) return false;
    
    // Check if expired
    if (data.expires < Date.now()) {
      this.delete(email);
      return false;
    }
    
    return true;
  }

  // Verify a code
  verify(email: string, inputCode: string): { success: boolean; error?: string; attemptsLeft?: number } {
    const data = this.get(email);
    
    if (!data) {
      return { success: false, error: 'No verification code found. Please request a new one.' };
    }

    // Check if expired
    if (data.expires < Date.now()) {
      this.delete(email);
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    // Check attempt limit
    const MAX_ATTEMPTS = 3;
    if (data.attempts >= MAX_ATTEMPTS) {
      this.delete(email);
      return { success: false, error: 'Too many failed attempts. Please request a new verification code.' };
    }

    // Check the code
    if (data.code !== inputCode.toString()) {
      data.attempts += 1;
      this.store.set(email.toLowerCase(), data);
      
      const attemptsLeft = MAX_ATTEMPTS - data.attempts;
      return { 
        success: false, 
        error: `Invalid verification code. ${attemptsLeft} attempts remaining.`,
        attemptsLeft 
      };
    }

    // Success! Remove the code
    this.delete(email);
    return { success: true };
  }

  // Delete a verification code
  delete(email: string): void {
    this.store.delete(email.toLowerCase());
    console.log(`🗑️ Deleted verification code for ${email}`);
  }

  // Clean up expired codes (call this periodically)
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [email, data] of this.store.entries()) {
      if (data.expires < now) {
        this.store.delete(email);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired verification codes`);
    }
  }

  // Get stats (for debugging)
  getStats(): { total: number; expired: number } {
    const now = Date.now();
    let expired = 0;
    
    for (const data of this.store.values()) {
      if (data.expires < now) expired++;
    }
    
    return {
      total: this.store.size,
      expired
    };
  }
}

// Export singleton instance
export const verificationStore = new VerificationStore();

// Clean up expired codes every 5 minutes
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    verificationStore.cleanup();
  }, 5 * 60 * 1000);
} 