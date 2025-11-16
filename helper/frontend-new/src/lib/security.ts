// Security utilities for protecting against attacks

// Rate limiting - prevent spam attacks
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }

  reset(identifier: string) {
    this.attempts.delete(identifier);
  }
}

export const betRateLimiter = new RateLimiter(10, 60000); // 10 bets per minute

// Input validation
export function validateBetAmount(amount: number): boolean {
  const MIN_BET = 10_000_000; // 0.01 OCT
  const MAX_BET = 50_000_000; // 0.05 OCT
  
  if (typeof amount !== 'number' || isNaN(amount)) {
    return false;
  }
  
  if (amount < MIN_BET || amount > MAX_BET) {
    return false;
  }
  
  // Check if amount is one of the allowed values
  const allowedAmounts = [10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000];
  return allowedAmounts.includes(amount);
}

// Sanitize user inputs
export function sanitizeInput(input: string): string {
  return input.replace(/[<>\"']/g, '');
}

// Detect suspicious activity
export function detectSuspiciousActivity(
  address: string,
  betAmount: number,
  recentBets: number[]
): { suspicious: boolean; reason?: string } {
  // Check for rapid betting pattern (bot detection)
  if (recentBets.length > 20) {
    const timeDiffs = [];
    for (let i = 1; i < recentBets.length; i++) {
      timeDiffs.push(recentBets[i] - recentBets[i - 1]);
    }
    
    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    
    // If bets are too consistent (likely a bot)
    if (avgTimeDiff < 2000 && timeDiffs.every(diff => Math.abs(diff - avgTimeDiff) < 500)) {
      return { suspicious: true, reason: 'Bot-like betting pattern detected' };
    }
  }
  
  // Check for unusual bet amounts
  if (!validateBetAmount(betAmount)) {
    return { suspicious: true, reason: 'Invalid bet amount' };
  }
  
  return { suspicious: false };
}

// XSS Protection
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// CSRF Token generation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Verify transaction integrity
export function verifyTransactionIntegrity(
  expectedAmount: number,
  expectedChoice: boolean,
  transaction: any
): boolean {
  try {
    // Verify transaction hasn't been tampered with
    if (!transaction || typeof transaction !== 'object') {
      return false;
    }
    
    // Add more specific checks based on your transaction structure
    return true;
  } catch (error) {
    console.error('Transaction integrity check failed:', error);
    return false;
  }
}

// Honeypot detection (detect if user is a bot)
export class HoneypotDetector {
  private static honeypotTriggered = false;

  static setTrap() {
    // Create invisible honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    
    honeypot.addEventListener('input', () => {
      this.honeypotTriggered = true;
    });
    
    document.body.appendChild(honeypot);
  }

  static isBot(): boolean {
    return this.honeypotTriggered;
  }
}

// Session management
export class SessionManager {
  private static readonly SESSION_KEY = 'game_session';
  private static readonly SESSION_DURATION = 3600000; // 1 hour

  static createSession(address: string): string {
    const sessionId = generateCSRFToken();
    const session = {
      id: sessionId,
      address,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    
    return sessionId;
  }

  static validateSession(address: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const sessionData = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return false;
    
    try {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check if session expired
      if (now - session.lastActivity > this.SESSION_DURATION) {
        this.clearSession();
        return false;
      }
      
      // Check if address matches
      if (session.address !== address) {
        return false;
      }
      
      // Update last activity
      session.lastActivity = now;
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      
      return true;
    } catch {
      return false;
    }
  }

  static clearSession() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }
}

// IP-based rate limiting (would need backend support)
export function hashIP(ip: string): string {
  // Simple hash for client-side tracking
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Detect replay attacks
export class ReplayAttackDetector {
  private static usedNonces = new Set<string>();
  private static readonly MAX_NONCES = 1000;

  static generateNonce(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static validateNonce(nonce: string): boolean {
    if (this.usedNonces.has(nonce)) {
      return false;
    }
    
    this.usedNonces.add(nonce);
    
    // Prevent memory leak
    if (this.usedNonces.size > this.MAX_NONCES) {
      const firstNonce = this.usedNonces.values().next().value;
      if (firstNonce) {
        this.usedNonces.delete(firstNonce);
      }
    }
    
    return true;
  }
}

// Content Security Policy helper
export function setupCSP() {
  if (typeof window === 'undefined') return;
  
  // Add CSP meta tag if not present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(meta);
  }
}

// Detect DevTools (anti-debugging)
export function detectDevTools(): boolean {
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  return widthThreshold || heightThreshold;
}

// Prevent clickjacking
export function preventClickjacking() {
  if (typeof window === 'undefined') return;
  
  if (window.top !== window.self) {
    // Page is in an iframe
    window.top!.location.href = window.self.location.href;
  }
}
