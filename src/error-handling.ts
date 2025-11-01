/**
 * Error handling utilities
 */

export class ShoraError extends Error {
 public readonly status?: number;
 public readonly code?: string;
 public readonly context?: string;
 public readonly timestamp: string;

 constructor(
 message: string,
 status?: number,
 code?: string,
 context?: string
 ) {
 super(message);
 this.name = 'ShoraError';
 this.status = status;
 this.code = code;
 this.context = context;
 this.timestamp = new Date().toISOString();
 }
}

export function parseError(error: any): ShoraError {
 if (error instanceof ShoraError) {
 return error;
 }

 if (error.response) {
 // Axios error with response
 const { status, data } = error.response;
 const message = data?.message || data?.error || error.message;
 const code = data?.code || 'API_ERROR';
 
 return new ShoraError(
 message,
 status,
 code,
 'API_RESPONSE'
 );
 }

 if (error.request) {
 // Network error
 return new ShoraError(
 'Network error: No response received',
 0,
 'NETWORK_ERROR',
 'REQUEST'
 );
 }

 // Other error
 return new ShoraError(
 error.message || 'Unknown error occurred',
 0,
 'UNKNOWN_ERROR',
 'UNKNOWN'
 );
}

export function isRetryableError(error: any): boolean {
 if (error instanceof ShoraError) {
 // Retry on network errors and 5xx status codes
 return !error.status || error.status >= 500;
 }
 
 // Retry on network errors
 return !error.response;
}

export function getErrorMessage(error: any): string {
 if (error instanceof ShoraError) {
 return error.message;
 }
 
 if (error.response?.data?.message) {
 return error.response.data.message;
 }
 
 if (error.message) {
 return error.message;
 }
 
 return 'An unknown error occurred';
}

export function getErrorCode(error: any): string {
 if (error instanceof ShoraError) {
 return error.code || 'UNKNOWN_ERROR';
 }
 
 if (error.response?.data?.code) {
 return error.response.data.code;
 }
 
 return 'UNKNOWN_ERROR';
}

export function getErrorStatus(error: any): number | undefined {
 if (error instanceof ShoraError) {
 return error.status;
 }
 
 if (error.response?.status) {
 return error.response.status;
 }
 
 return undefined;
}