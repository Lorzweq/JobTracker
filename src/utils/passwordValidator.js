/**
 * Calculate password strength score (0-5)
 * Returns: { score: 0-5, level: 'weak'|'fair'|'good'|'strong'|'very-strong', feedback: string }
 */
export const calculatePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password) return { score: 0, level: 'weak', feedback: ['Password is empty'] };

  // Length checks
  if (password.length >= 6) score++;
  if (password.length >= 12) score++;
  if (password.length >= 18) score++;

  // Character variety
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Normalize score to 0-5
  score = Math.min(5, Math.ceil((score / 7) * 5));

  // Generate feedback
  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters');

  const levels = ['weak', 'fair', 'good', 'strong', 'very-strong'];
  const level = levels[Math.max(0, score - 1)] || 'weak';

  return { score, level, feedback };
};

/**
 * Check if password has been compromised using Have I Been Pwned API
 * Uses k-anonymity model - password never sent to API
 * Returns: { isPwned: boolean, count: number, error: string|null }
 */
export const checkPasswordPwned = async (password) => {
  try {
    // Convert password to SHA-1 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Use only first 5 characters (k-anonymity)
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Query the API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) {
      return { isPwned: false, count: 0, error: 'Could not check password security' };
    }
    
    const text = await response.text();
    const hashes = text.split('\r\n');
    
    // Check if our suffix matches any in the response
    for (const hash of hashes) {
      const [hashSuffix, count] = hash.split(':');
      if (hashSuffix === suffix) {
        return { isPwned: true, count: parseInt(count), error: null };
      }
    }
    
    return { isPwned: false, count: 0, error: null };
  } catch (err) {
    console.error('Password check error:', err);
    return { isPwned: false, count: 0, error: 'Could not check password security' };
  }
};

/**
 * Full password validation with pwned check
 */
export const validatePasswordSecurity = async (password) => {
  const strength = calculatePasswordStrength(password);
  const pwned = await checkPasswordPwned(password);
  
  return {
    ...strength,
    isPwned: pwned.isPwned,
    pwnedCount: pwned.count,
    pwnedError: pwned.error,
  };
};
