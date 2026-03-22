import { createClient } from '@supabase/supabase-js';

/**
 * Creates a browser-safe Supabase client
 * Uses the anon key and is subject to Row Level Security policies
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We're using NextAuth, not Supabase auth
    },
  });
}

/**
 * Creates a server-side Supabase client with service role privileges
 * Bypasses Row Level Security - use with caution
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Generates a unique, secure filename for PDF uploads
 * Format: {timestamp}_{userId}_{randomString}_{sanitizedOriginalName}.pdf
 *
 * @param {string} userId - The user's ID from the session
 * @param {string} originalFileName - The original filename from the user's device
 * @returns {string} A unique, sanitized filename
 */
export function generateUniqueFileName(userId, originalFileName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);

  // Sanitize the original filename: remove special chars, keep alphanumeric, dots, underscores, hyphens
  const sanitized = originalFileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 50);

  return `${timestamp}_${userId}_${randomString}_${sanitized}`;
}

/**
 * Validates a PDF file before upload
 * Checks file type, size, and ensures file is not empty
 *
 * @param {File} file - The file object to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validatePdfFile(file) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
}
