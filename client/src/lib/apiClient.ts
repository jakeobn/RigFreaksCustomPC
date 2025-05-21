import { API_URL, IS_PRODUCTION } from '../env';

/**
 * API client for making requests to the backend
 * Automatically handles API URL configuration for different environments
 */

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

/**
 * Fetch wrapper with enhanced error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { 
    method = 'GET', 
    body, 
    headers = {}, 
    credentials = 'same-origin' 
  } = options;

  // Build the complete URL
  const url = `${API_URL}${endpoint}`;
  
  // Set up default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Create the fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
    credentials,
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Check if the response is an error
      if (!response.ok) {
        if (IS_PRODUCTION) {
          console.error(`API error (${response.status}):`, data);
        } else {
          console.error(`API error (${response.status}):`, { 
            url, 
            method, 
            data,
            response
          });
        }
        
        throw new Error(data.message || 'An error occurred with the API request');
      }
      
      return data as T;
    } else {
      // For non-JSON responses, return the response object
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      return response as unknown as T;
    }
  } catch (error) {
    if (!IS_PRODUCTION) {
      console.error('API request failed:', error);
    }
    throw error;
  }
}

// Convenience methods
export const get = <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
  apiRequest<T>(endpoint, { ...options, method: 'GET' });

export const post = <T = any>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
  apiRequest<T>(endpoint, { ...options, method: 'POST', body });

export const put = <T = any>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
  apiRequest<T>(endpoint, { ...options, method: 'PUT', body });

export const patch = <T = any>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
  apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });

export const del = <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) => 
  apiRequest<T>(endpoint, { ...options, method: 'DELETE' });