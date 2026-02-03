import axios, { AxiosError } from 'axios';
import { OPENAI_API_KEY } from '../config';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  result: OptimizationResponse;
  timestamp: number;
}

const optimizationCache = new Map<string, CacheEntry>();

export interface OptimizationRequest {
  type: 'resume' | 'post';
  content: string;
  context?: string;
}

export interface OptimizationResponse {
  optimized: string;
  score: number;
  suggestions: string[];
  metadata?: {
    missing_keywords?: string[];
    hashtags?: string[];
    alternatives?: string[];
  };
}

export class OptimizationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'OptimizationError';
  }
}

/**
 * Validates optimization request
 */
function validateRequest(request: OptimizationRequest): void {
  if (!request.content || request.content.trim().length === 0) {
    throw new OptimizationError(
      'Content cannot be empty',
      'INVALID_INPUT'
    );
  }

  if (request.content.length > 50000) {
    throw new OptimizationError(
      'Content exceeds maximum length of 50,000 characters',
      'CONTENT_TOO_LONG'
    );
  }

  if (request.type === 'resume' && (!request.context || request.context.trim().length === 0)) {
    throw new OptimizationError(
      'Job posting is required for resume optimization',
      'MISSING_CONTEXT'
    );
  }

  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
    throw new OptimizationError(
      'OpenAI API key not configured',
      'API_KEY_MISSING'
    );
  }
}

/**
 * Generates cache key for request
 */
function getCacheKey(request: OptimizationRequest): string {
  return `${request.type}:${request.context}:${request.content.substring(0, 100)}`;
}

/**
 * Checks cache for existing result
 */
function getCachedResult(request: OptimizationRequest): OptimizationResponse | null {
  const key = getCacheKey(request);
  const cached = optimizationCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('[OpenAI] Cache hit');
    return cached.result;
  }
  
  if (cached) {
    optimizationCache.delete(key);
  }
  
  return null;
}

/**
 * Stores result in cache
 */
function setCachedResult(request: OptimizationRequest, result: OptimizationResponse): void {
  const key = getCacheKey(request);
  optimizationCache.set(key, {
    result,
    timestamp: Date.now()
  });
}

/**
 * Delays execution for retry logic
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Makes API call with retry logic
 */
async function makeOpenAIRequest(
  prompt: string,
  retryCount = 0
): Promise<string> {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO and optimization specialist. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Rate limit or server error - retry
    if (
      retryCount < MAX_RETRIES &&
      (axiosError.response?.status === 429 || axiosError.response?.status === 503)
    ) {
      console.log(`[OpenAI] Retry ${retryCount + 1}/${MAX_RETRIES} after ${RETRY_DELAY}ms`);
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return makeOpenAIRequest(prompt, retryCount + 1);
    }

    // Authentication error
    if (axiosError.response?.status === 401) {
      throw new OptimizationError(
        'Invalid OpenAI API key',
        'INVALID_API_KEY',
        401
      );
    }

    // Quota exceeded
    if (axiosError.response?.status === 429) {
      throw new OptimizationError(
        'OpenAI API rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    // Generic error
    throw new OptimizationError(
      axiosError.response?.data?.error?.message || 'Failed to optimize content',
      'API_ERROR',
      axiosError.response?.status
    );
  }
}

/**
 * Generates optimization prompt
 */
function generatePrompt(request: OptimizationRequest): string {
  if (request.type === 'resume') {
    return `
You are an ATS (Applicant Tracking System) optimization expert.

JOB POSTING:
${request.context}

CURRENT RESUME:
${request.content}

TASK:
1. Extract key skills and keywords from the job posting
2. Optimize the resume to match these keywords naturally
3. Improve action verbs and quantify achievements
4. Format for ATS readability
5. Maintain truthfulness - do not add fake experience

OUTPUT (Valid JSON only):
{
  "optimized_resume": "full optimized resume text",
  "match_score": 85,
  "suggestions": ["list of key improvements made"],
  "missing_keywords": ["keyword1", "keyword2"]
}
    `.trim();
  } else {
    return `
You are a social media optimization expert.

PLATFORM: ${request.context || 'Instagram'}
CURRENT POST:
${request.content}

TASK:
1. Optimize for maximum engagement
2. Improve hook (first line)
3. Add relevant hashtags (max 10 for Instagram, 3-5 for others)
4. Include strong CTA
5. Create 2 alternative versions for A/B testing

OUTPUT (Valid JSON only):
{
  "optimized_post": "full optimized post text",
  "engagement_score": 78,
  "suggestions": ["list of improvements made"],
  "hashtags": ["#tag1", "#tag2"],
  "alternatives": ["version 2", "version 3"]
}
    `.trim();
  }
}

/**
 * Parses OpenAI response into OptimizationResponse
 */
function parseOptimizationResult(
  result: string,
  type: string
): OptimizationResponse {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || result.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    if (type === 'resume') {
      if (!parsed.optimized_resume || typeof parsed.match_score !== 'number') {
        throw new Error('Invalid resume optimization response format');
      }
      
      return {
        optimized: parsed.optimized_resume,
        score: Math.min(100, Math.max(0, parsed.match_score)),
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        metadata: {
          missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : []
        }
      };
    } else {
      if (!parsed.optimized_post || typeof parsed.engagement_score !== 'number') {
        throw new Error('Invalid post optimization response format');
      }
      
      return {
        optimized: parsed.optimized_post,
        score: Math.min(100, Math.max(0, parsed.engagement_score)),
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        metadata: {
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
          alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : []
        }
      };
    }
  } catch (e) {
    console.error('[OpenAI] Parse error:', e);
    throw new OptimizationError(
      'Failed to parse optimization result',
      'PARSE_ERROR'
    );
  }
}

/**
 * Main optimization function with validation, caching, and error handling
 */
export async function optimizeContent(
  request: OptimizationRequest
): Promise<OptimizationResponse> {
  // Validate input
  validateRequest(request);
  
  // Check cache
  const cached = getCachedResult(request);
  if (cached) {
    return cached;
  }

  console.log(`[OpenAI] Optimizing ${request.type} (${request.content.length} chars)`);

  // Generate prompt
  const prompt = generatePrompt(request);
  
  // Make API call with retry logic
  const rawResult = await makeOpenAIRequest(prompt);
  
  // Parse result
  const result = parseOptimizationResult(rawResult, request.type);
  
  // Cache result
  setCachedResult(request, result);
  
  console.log(`[OpenAI] Optimization complete (score: ${result.score})`);
  
  return result;
}

/**
 * Clears optimization cache
 */
export function clearOptimizationCache(): void {
  optimizationCache.clear();
  console.log('[OpenAI] Cache cleared');
}
