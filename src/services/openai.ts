import axios, { AxiosError } from 'axios';
import { OPENAI_API_KEY } from '../config';
import { trackUsage } from './usageTracking';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 3000; // 3 seconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MIN_REQUEST_INTERVAL = 1000; // Minimum 1 second between requests

interface CacheEntry {
  result: OptimizationResponse;
  timestamp: number;
}

const optimizationCache = new Map<string, CacheEntry>();

// Request queue to prevent simultaneous API calls
let lastRequestTime = 0;
let promiseChain = Promise.resolve();

/**
 * Enqueues a request to ensure only one API call at a time
 */
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = promiseChain.then(fn, fn);
  promiseChain = run.then(() => undefined, () => undefined);
  return run;
}

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
 * Ensures minimum time between API requests to prevent rate limiting
 */
async function throttleRequest(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`[OpenAI] Throttling request: waiting ${waitTime}ms`);
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();
}

/**
 * Makes API call with retry logic - internal implementation
 */
async function makeOpenAIRequestInternal(
  prompt: string,
  retryCount = 0
): Promise<string> {
  // Throttle request to prevent rate limiting
  await throttleRequest();
  
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS resume optimizer. CRITICAL: Always use the candidate\'s REAL NAME from their resume - never use placeholders like "John Doe" or "Jane Smith". Extract and use their actual name. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ], 
        temperature: 0.7,
        max_tokens: 1500 // Reduced from 2000 to help with TPM limits
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
    
    // Extract error details
    const errorData = axiosError.response?.data as { error?: { message?: string; type?: string } } | undefined;
    const errorMessage = errorData?.error?.message?.toLowerCase() || '';
    
    // Check if this is a 429 error
    if (axiosError.response?.status === 429) {
      // Distinguish between quota and rate limit
      const isQuotaExceeded = errorMessage.includes('quota') || 
                              errorMessage.includes('billing') || 
                              errorMessage.includes('check your plan');
      
      if (isQuotaExceeded) {
        throw new OptimizationError(
          'OpenAI API quota/billing limit reached. Please check your OpenAI account usage limits and billing details at platform.openai.com.',
          'QUOTA_EXCEEDED',
          429
        );
      }
      
      // This is a rate limit (RPM/TPM) - check for Retry-After header first
      const retryAfter = axiosError.response?.headers?.['retry-after'];
      if (retryAfter && retryCount < MAX_RETRIES) {
        const waitMs = Number(retryAfter) * 1000;
        console.log(`[OpenAI] Rate limited. Retry-After header: ${retryAfter}s. Retry ${retryCount + 1}/${MAX_RETRIES}`);
        await delay(waitMs);
        return makeOpenAIRequestInternal(prompt, retryCount + 1);
      }
      
      // Fall back to exponential backoff if within retry limit
      if (retryCount < MAX_RETRIES) {
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, retryCount); // 3s, 6s, 12s
        console.log(`[OpenAI] Rate limited. Retry ${retryCount + 1}/${MAX_RETRIES} after ${delayMs}ms`);
        await delay(delayMs);
        return makeOpenAIRequestInternal(prompt, retryCount + 1);
      }
      
      // Exhausted retries
      throw new OptimizationError(
        'OpenAI API rate limit exceeded after retries. Please wait 30-60 seconds before trying again. Your API key may need higher rate limits.',
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }
    
    // Server error - retry with exponential backoff
    if (
      retryCount < MAX_RETRIES &&
      (axiosError.response?.status === 503 || axiosError.response?.status === 500)
    ) {
      const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`[OpenAI] Server error. Retry ${retryCount + 1}/${MAX_RETRIES} after ${delayMs}ms`);
      await delay(delayMs);
      return makeOpenAIRequestInternal(prompt, retryCount + 1);
    }

    // Authentication error
    if (axiosError.response?.status === 401) {
      throw new OptimizationError(
        'Invalid OpenAI API key',
        'INVALID_API_KEY',
        401
      );
    }

    // Generic error
    throw new OptimizationError(
      errorData?.error?.message || 'Failed to optimize content',
      'API_ERROR',
      axiosError.response?.status
    );
  }
}

/**
 * Makes API call with queue to prevent concurrent requests
 */
async function makeOpenAIRequest(
  prompt: string,
  retryCount = 0
): Promise<string> {
  return enqueue(() => makeOpenAIRequestInternal(prompt, retryCount));
}

/**
 * Generates optimization prompt
 */
function generatePrompt(request: OptimizationRequest): string {
  // Trim content to reduce token usage
  const maxContentLength = 8000;
  const trimmedContent = request.content.length > maxContentLength 
    ? request.content.substring(0, maxContentLength) + '\n[... content trimmed for API limits ...]'
    : request.content;
  
  const maxContextLength = 4000;
  const trimmedContext = request.context && request.context.length > maxContextLength
    ? request.context.substring(0, maxContextLength) + '\n[... context trimmed for API limits ...]'
    : request.context;
  
  if (request.type === 'resume') {
    return `
CRITICAL FIRST STEP: Look at the resume below and find the candidate's real name (usually at the top). You MUST use this exact name in your output.

JOB POSTING:
${trimmedContext}

CURRENT RESUME:
${trimmedContent}

INSTRUCTIONS:
1. **MOST IMPORTANT**: Find the candidate's name in the resume above (look at the very beginning)
   - If you see "Decker Ayers" → Use "Decker Ayers"
   - If you see "Sarah Johnson" → Use "Sarah Johnson"  
   - NEVER use "John Doe", "Jane Smith", "Candidate's Actual Name", or ANY generic placeholder
   - The name is usually in the first few lines of the resume

2. Extract key skills and keywords from the job posting
3. EXPAND and enhance the resume - DO NOT SHORTEN IT
4. Add relevant keywords naturally throughout
5. Improve action verbs and quantify achievements where possible
6. Maintain or INCREASE the level of detail
7. Add proper formatting with section headers
8. Preserve all original accomplishments and experience
9. Format for both ATS readability and human review
10. Maintain truthfulness - do not add fake experience

OUTPUT FORMAT (Valid JSON only):
{
  "optimized_resume": "# [PUT THE REAL NAME YOU FOUND HERE]\\n\\n## PROFESSIONAL SUMMARY\\n[2-3 sentence compelling summary]\\n\\n## PROFESSIONAL EXPERIENCE\\n\\n### [Company Name] | [Job Title]\\n*[Dates]*\\n- [Achievement with metrics]\\n- [Achievement with metrics]\\n\\n### [Next Company] | [Job Title]\\n*[Dates]*\\n- [Achievement]\\n\\n## EDUCATION\\n\\n### [Institution] - [Degree]\\n*[Graduation Date]*\\n\\n## TECHNICAL SKILLS\\n\\n**Languages:** [List]  \\n**Frameworks:** [List]  \\n**Tools:** [List]\\n\\n## KEY STRENGTHS\\n- [Notable strengths or achievements]",
  "match_score": 85,
  "suggestions": ["Specific improvements made to enhance the resume"],
  "missing_keywords": ["keyword1", "keyword2"]
}

REMINDER: Start your optimized_resume with "# " followed by THE ACTUAL NAME from the resume, NOT a placeholder!
    `.trim();
  } else {
    return `
You are a social media optimization expert.

PLATFORM: ${trimmedContext || 'Instagram'}
CURRENT POST:
${trimmedContent}

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
  type: string,
  originalContent?: string
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
      
      let optimizedResume = parsed.optimized_resume;
      
      // Post-process: Check if AI used placeholder names and try to extract real name
      const placeholders = ['john doe', 'jane smith', 'candidate\'s actual name', '[candidate', 'your name'];
      const firstLine = optimizedResume.split('\n')[0].toLowerCase();
      const hasPlaceholder = placeholders.some(p => firstLine.includes(p));
      
      if (hasPlaceholder && originalContent) {
        // Try to extract name from original content (usually first line or near the top)
        const originalLines = originalContent.split('\n').slice(0, 10); // Check first 10 lines
        let extractedName = null;
        
        // Look for lines that look like names (2-4 words, capitalized, no special chars)
        for (const line of originalLines) {
          const trimmed = line.trim();
          const words = trimmed.split(/\s+/);
          
          // Name heuristic: 2-4 words, each starting with capital, no numbers/symbols
          if (words.length >= 2 && words.length <= 4) {
            const looksLikeName = words.every(w => 
              w.length > 0 && 
              w[0] === w[0].toUpperCase() && 
              /^[A-Z][a-z]+$/.test(w)
            );
            
            if (looksLikeName && trimmed.length < 50) {
              extractedName = trimmed;
              break;
            }
          }
        }
        
        if (extractedName) {
          console.log(`[OpenAI] Replaced placeholder name with extracted name: ${extractedName}`);
          optimizedResume = optimizedResume.replace(/^#\s*.+$/m, `# ${extractedName}`);
        }
      }
      
      return {
        optimized: optimizedResume,
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
  request: OptimizationRequest,
  userId?: string
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
  
  // Parse result with original content for name extraction fallback
  const result = parseOptimizationResult(rawResult, request.type, request.content);
  
  // Cache result
  setCachedResult(request, result);
  
  // Track usage
  if (userId) {
    const toolType = request.type === 'resume' ? 'resume' : request.type === 'post' ? 'post' : 'resume';
    await trackUsage(userId, toolType, true);
  }
  
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

/**
 * Generates a cover letter based on resume and job description
 */
export async function generateCoverLetter(params: {
  resumeContent: string;
  jobDescription: string;
  bio?: string;
  userId?: string;
}): Promise<{ letter: string; suggestions: string[] }> {
  if (!params.resumeContent || params.resumeContent.trim().length === 0) {
    throw new OptimizationError('Resume content cannot be empty', 'INVALID_INPUT');
  }

  if (!params.jobDescription || params.jobDescription.trim().length === 0) {
    throw new OptimizationError('Job description cannot be empty', 'INVALID_INPUT');
  }

  const prompt = `
You are an expert career advisor and cover letter writer.

${params.bio ? `BIO/BACKGROUND:\n${params.bio}\n\n` : ''}RESUME:
${params.resumeContent}

JOB DESCRIPTION:
${params.jobDescription}

TASK:
Create a compelling, professional cover letter that:
1. Addresses the specific job requirements
2. Highlights relevant experience from the resume
3. Shows enthusiasm and cultural fit
4. Uses a professional but engaging tone
5. Is 3-4 paragraphs in length
6. Includes a strong opening and closing

OUTPUT (Valid JSON only):
{
  "cover_letter": "full cover letter text with proper formatting",
  "suggestions": ["tip 1", "tip 2", "tip 3"]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'cover-letter', true);
    }

    return {
      letter: parsed.cover_letter,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    };
  } catch (error) {
    console.error('[OpenAI] Cover letter generation error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'cover-letter', false);
    }
    throw new OptimizationError(
      'Failed to generate cover letter',
      'GENERATION_FAILED'
    );
  }
}

/**
 * Generates interview preparation materials
 */
export async function generateInterviewPrep(params: {
  jobDescription: string;
  resumeContent?: string;
  userId?: string;
}): Promise<{
  commonQuestions: string[];
  suggestedAnswers: { question: string; answer: string }[];
  questionsToAsk: string[];
  tips: string[];
}> {
  if (!params.jobDescription || params.jobDescription.trim().length === 0) {
    throw new OptimizationError('Job description cannot be empty', 'INVALID_INPUT');
  }

  const prompt = `
You are an expert interview coach and career advisor.

JOB DESCRIPTION:
${params.jobDescription}

${params.resumeContent ? `CANDIDATE RESUME:\n${params.resumeContent}\n\n` : ''}

TASK:
Provide comprehensive interview preparation including:
1. 8-10 common interview questions for this role
2. 3-4 detailed answer frameworks for key questions (if resume provided, personalize them)
3. 5-7 thoughtful questions the candidate should ask
4. 5-7 practical interview tips specific to this role

OUTPUT (Valid JSON only):
{
  "common_questions": ["question 1", "question 2", ...],
  "suggested_answers": [
    {"question": "Tell me about yourself", "answer": "framework/example answer"},
    ...
  ],
  "questions_to_ask": ["question 1", "question 2", ...],
  "tips": ["tip 1", "tip 2", ...]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'interview', true);
    }

    return {
      commonQuestions: Array.isArray(parsed.common_questions) ? parsed.common_questions : [],
      suggestedAnswers: Array.isArray(parsed.suggested_answers) ? parsed.suggested_answers : [],
      questionsToAsk: Array.isArray(parsed.questions_to_ask) ? parsed.questions_to_ask : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };
  } catch (error) {
    console.error('[OpenAI] Interview prep generation error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'interview', false);
    }
    throw new OptimizationError(
      'Failed to generate interview prep',
      'GENERATION_FAILED'
    );
  }
}

/**
 * Generates job search strategy and platform recommendations
 */
export async function generateJobSearchStrategy(params: {
  jobTitle: string;
  skills: string[];
  experience: string;
  location?: string;
  userId?: string;
}): Promise<{
  platforms: string[];
  searchStrategies: string[];
  keywords: string[];
}> {
  if (!params.jobTitle || params.jobTitle.trim().length === 0) {
    throw new OptimizationError('Job title cannot be empty', 'INVALID_INPUT');
  }

  const prompt = `
You are an expert job search strategist and recruiter.

TARGET ROLE: ${params.jobTitle}
SKILLS: ${params.skills.join(', ')}
EXPERIENCE LEVEL: ${params.experience}
${params.location ? `LOCATION: ${params.location}` : ''}

TASK:
Provide comprehensive job search guidance including:
1. 8-10 best job platforms/websites for this role (specific and relevant)
2. 7-10 effective search strategies and networking tips
3. 15-20 keywords and search terms to use

OUTPUT (Valid JSON only):
{
  "platforms": ["LinkedIn", "Indeed", "specific industry site", ...],
  "search_strategies": ["strategy 1", "strategy 2", ...],
  "keywords": ["keyword 1", "keyword 2", ...]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'job-search', true);
    }

    return {
      platforms: Array.isArray(parsed.platforms) ? parsed.platforms : [],
      searchStrategies: Array.isArray(parsed.search_strategies) ? parsed.search_strategies : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
    };
  } catch (error) {
    console.error('[OpenAI] Job search strategy generation error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'job-search', false);
    }
    throw new OptimizationError(
      'Failed to generate job search strategy',
      'GENERATION_FAILED'
    );
  }
}

/**
 * Analyzes product/service and extracts selling points
 */
export async function analyzeSellingPoints(params: {
  productUrl?: string;
  productDescription: string;
  targetAudience?: string;
  userId?: string;
}): Promise<{
  sellingPoints: string[];
  uniqueValueProps: string[];
  competitiveAdvantages: string[];
  targetPainPoints: string[];
  messagingTips: string[];
}> {
  if (!params.productDescription || params.productDescription.trim().length === 0) {
    throw new OptimizationError('Product description cannot be empty', 'INVALID_INPUT');
  }

  const prompt = `
You are an expert sales strategist and marketing analyst.

${params.productUrl ? `PRODUCT URL: ${params.productUrl}\n\n` : ''}PRODUCT/SERVICE DESCRIPTION:
${params.productDescription}

${params.targetAudience ? `TARGET AUDIENCE: ${params.targetAudience}\n\n` : ''}

TASK:
Analyze this product/service and provide:
1. 5-7 key selling points (features that matter most)
2. 3-5 unique value propositions (what makes it different)
3. 4-6 competitive advantages (why choose this over competitors)
4. 5-7 target pain points this addresses
5. 5-7 messaging tips for sales conversations

OUTPUT (Valid JSON only):
{
  "selling_points": ["point 1", "point 2", ...],
  "unique_value_props": ["prop 1", "prop 2", ...],
  "competitive_advantages": ["advantage 1", "advantage 2", ...],
  "target_pain_points": ["pain 1", "pain 2", ...],
  "messaging_tips": ["tip 1", "tip 2", ...]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'selling-points', true);
    }

    return {
      sellingPoints: Array.isArray(parsed.selling_points) ? parsed.selling_points : [],
      uniqueValueProps: Array.isArray(parsed.unique_value_props) ? parsed.unique_value_props : [],
      competitiveAdvantages: Array.isArray(parsed.competitive_advantages) ? parsed.competitive_advantages : [],
      targetPainPoints: Array.isArray(parsed.target_pain_points) ? parsed.target_pain_points : [],
      messagingTips: Array.isArray(parsed.messaging_tips) ? parsed.messaging_tips : []
    };
  } catch (error) {
    console.error('[OpenAI] Selling points analysis error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'selling-points', false);
    }
    throw new OptimizationError(
      'Failed to analyze selling points',
      'GENERATION_FAILED'
    );
  }
}

/**
 * Generates a personalized cold email
 */
export async function generateColdEmail(params: {
  recipientInfo: string;
  yourCompany: string;
  yourValue: string;
  callToAction: string;
  userId?: string;
}): Promise<{
  subject: string;
  email: string;
  alternatives: string[];
  tips: string[];
}> {
  if (!params.recipientInfo || !params.yourCompany || !params.yourValue) {
    throw new OptimizationError('All fields are required', 'INVALID_INPUT');
  }

  const prompt = `
You are an expert cold email copywriter with high response rates.

RECIPIENT INFO: ${params.recipientInfo}
YOUR COMPANY/OFFERING: ${params.yourCompany}
VALUE PROPOSITION: ${params.yourValue}
DESIRED ACTION: ${params.callToAction}

TASK:
Create a personalized cold email that:
1. Has a compelling subject line
2. Opens with relevant personalization
3. Clearly states value proposition
4. Includes a soft, low-pressure call to action
5. Is concise (under 150 words)
6. Provide 2 alternative subject lines
7. Include 3-4 tips for follow-up

OUTPUT (Valid JSON only):
{
  "subject": "subject line",
  "email": "full email body",
  "alternatives": ["alt subject 1", "alt subject 2"],
  "tips": ["tip 1", "tip 2", ...]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'cold-email', true);
    }

    return {
      subject: parsed.subject || '',
      email: parsed.email || '',
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };
  } catch (error) {
    console.error('[OpenAI] Cold email generation error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'cold-email', false);
    }
    throw new OptimizationError(
      'Failed to generate cold email',
      'GENERATION_FAILED'
    );
  }
}

/**
 * Generates a sales script
 */
export async function generateSalesScript(params: {
  scriptType: string;
  productService: string;
  targetAudience: string;
  goals: string;
  userId?: string;
}): Promise<{
  script: string;
  keyPoints: string[];
  objectionHandles: string[];
  tips: string[];
}> {
  if (!params.scriptType || !params.productService) {
    throw new OptimizationError('Script type and product/service are required', 'INVALID_INPUT');
  }

  const prompt = `
You are an expert sales trainer and script writer.

SCRIPT TYPE: ${params.scriptType}
PRODUCT/SERVICE: ${params.productService}
TARGET AUDIENCE: ${params.targetAudience}
GOALS: ${params.goals}

TASK:
Create a proven sales script with:
1. Full conversation flow with examples
2. 5-7 key talking points
3. 4-6 common objections with responses
4. 5-7 execution tips

OUTPUT (Valid JSON only):
{
  "script": "full script with clear sections and examples",
  "key_points": ["point 1", "point 2", ...],
  "objection_handles": ["How to handle: objection", ...],
  "tips": ["tip 1", "tip 2", ...]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'sales-script', true);
    }

    return {
      script: parsed.script || '',
      keyPoints: Array.isArray(parsed.key_points) ? parsed.key_points : [],
      objectionHandles: Array.isArray(parsed.objection_handles) ? parsed.objection_handles : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };
  } catch (error) {
    console.error('[OpenAI] Sales script generation error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'sales-script', false);
    }
    throw new OptimizationError(
      'Failed to generate sales script',
      'GENERATION_FAILED'
    );
  }
}

/**
 * Generates relevant hashtags for social media content
 */
export async function generateHashtags(params: {
  platform: string;
  contentDescription: string;
  niche?: string;
  userId?: string;
}): Promise<{
  hashtags: string[];
  categories: {
    popular: string[];
    niche: string[];
    trending: string[];
  };
}> {
  if (!params.contentDescription) {
    throw new OptimizationError('Content description is required', 'INVALID_INPUT');
  }

  const prompt = `
You are a social media expert specializing in hashtag strategy.

PLATFORM: ${params.platform}
CONTENT: ${params.contentDescription}
NICHE: ${params.niche || 'general'}

TASK:
Generate relevant hashtags organized by category:
1. Popular hashtags (high volume, competitive)
2. Niche hashtags (targeted, lower competition)
3. Trending hashtags (current trends)

Total: 20-30 hashtags for Instagram, 15-20 for others

OUTPUT (Valid JSON only):
{
  "hashtags": ["#tag1", "#tag2", ...],
  "popular": ["#populartag1", ...],
  "niche": ["#nichetag1", ...],
  "trending": ["#trendingtag1", ...]
}
  `.trim();

  try {
    const rawResult = await makeOpenAIRequest(prompt);
    const jsonMatch = rawResult.match(/```json\s*([\s\S]*?)\s*```/) || rawResult.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Track usage
    if (params.userId) {
      await trackUsage(params.userId, 'hashtag', true);
    }

    return {
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      categories: {
        popular: Array.isArray(parsed.popular) ? parsed.popular : [],
        niche: Array.isArray(parsed.niche) ? parsed.niche : [],
        trending: Array.isArray(parsed.trending) ? parsed.trending : []
      }
    };
  } catch (error) {
    console.error('[OpenAI] Hashtag generation error:', error);
    if (params.userId) {
      await trackUsage(params.userId, 'hashtag', false);
    }
    throw new OptimizationError(
      'Failed to generate hashtags',
      'GENERATION_FAILED'
    );
  }
}
