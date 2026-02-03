import axios from 'axios';
import { OPENAI_API_KEY } from '../config';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface OptimizationRequest {
  type: 'resume' | 'post';
  content: string;
  context?: string; // Job posting for resume, platform for post
}

export interface OptimizationResponse {
  optimized: string;
  score: number;
  suggestions: string[];
  metadata?: any;
}

export async function optimizeContent(
  request: OptimizationRequest
): Promise<OptimizationResponse> {
  const prompt = generatePrompt(request);

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO and optimization specialist.'
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
        }
      }
    );

    const result = response.data.choices[0].message.content;
    return parseOptimizationResult(result, request.type);
  } catch (error: any) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw new Error('Failed to optimize content');
  }
}

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

OUTPUT (JSON format):
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

OUTPUT (JSON format):
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

function parseOptimizationResult(
  result: string,
  type: string
): OptimizationResponse {
  try {
    // Try to parse JSON from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      if (type === 'resume') {
        return {
          optimized: parsed.optimized_resume,
          score: parsed.match_score,
          suggestions: parsed.suggestions,
          metadata: {
            missing_keywords: parsed.missing_keywords
          }
        };
      } else {
        return {
          optimized: parsed.optimized_post,
          score: parsed.engagement_score,
          suggestions: parsed.suggestions,
          metadata: {
            hashtags: parsed.hashtags,
            alternatives: parsed.alternatives
          }
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse OpenAI response:', e);
  }

  // Fallback if parsing fails
  return {
    optimized: result,
    score: 0,
    suggestions: ['Unable to generate specific suggestions']
  };
}
