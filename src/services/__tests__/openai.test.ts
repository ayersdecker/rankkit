import { optimizeContent, OptimizationError, clearOptimizationCache } from '../openai';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock config
jest.mock('../../config', () => ({
  OPENAI_API_KEY: 'test-api-key'
}));

describe('OpenAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearOptimizationCache();
  });

  describe('optimizeContent', () => {
    it('should optimize resume content successfully', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                optimized_resume: 'Optimized resume content',
                match_score: 85,
                suggestions: ['Added action verbs', 'Quantified achievements'],
                missing_keywords: ['JavaScript', 'React']
              })
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await optimizeContent({
        type: 'resume',
        content: 'Original resume',
        context: 'Job posting for React developer'
      });

      expect(result.optimized).toBe('Optimized resume content');
      expect(result.score).toBe(85);
      expect(result.suggestions).toHaveLength(2);
      expect(result.metadata?.missing_keywords).toContain('JavaScript');
    });

    it('should optimize post content successfully', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                optimized_post: 'Optimized post content',
                engagement_score: 78,
                suggestions: ['Improved hook', 'Added CTA'],
                hashtags: ['#coding', '#tech'],
                alternatives: ['Alternative 1', 'Alternative 2']
              })
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await optimizeContent({
        type: 'post',
        content: 'Original post',
        context: 'instagram'
      });

      expect(result.optimized).toBe('Optimized post content');
      expect(result.score).toBe(78);
      expect(result.metadata?.hashtags).toContain('#coding');
    });

    it('should validate empty content', async () => {
      await expect(
        optimizeContent({
          type: 'resume',
          content: '',
          context: 'Job posting'
        })
      ).rejects.toThrow(OptimizationError);
    });

    it('should validate content length', async () => {
      const longContent = 'a'.repeat(60000);

      await expect(
        optimizeContent({
          type: 'resume',
          content: longContent,
          context: 'Job posting'
        })
      ).rejects.toThrow('exceeds maximum length');
    });

    it('should require context for resume optimization', async () => {
      await expect(
        optimizeContent({
          type: 'resume',
          content: 'Resume content',
          context: ''
        })
      ).rejects.toThrow('Job posting is required');
    });

    it('should use cached result for duplicate requests', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                optimized_resume: 'Cached content',
                match_score: 90,
                suggestions: ['Test'],
                missing_keywords: []
              })
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const request = {
        type: 'resume' as const,
        content: 'Test content',
        context: 'Test context'
      };

      // First call
      const result1 = await optimizeContent(request);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await optimizeContent(request);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(result2).toEqual(result1);
    });

    it('should retry on rate limit error', async () => {
      mockedAxios.post
        .mockRejectedValueOnce({
          response: { status: 429 }
        })
        .mockResolvedValueOnce({
          data: {
            choices: [{
              message: {
                content: JSON.stringify({
                  optimized_resume: 'Success after retry',
                  match_score: 85,
                  suggestions: [],
                  missing_keywords: []
                })
              }
            }]
          }
        });

      const result = await optimizeContent({
        type: 'resume',
        content: 'Test',
        context: 'Test job'
      });

      expect(result.optimized).toBe('Success after retry');
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('should handle invalid API key', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { error: { message: 'Invalid API key' } }
        }
      });

      await expect(
        optimizeContent({
          type: 'resume',
          content: 'Test',
          context: 'Test job'
        })
      ).rejects.toThrow('Invalid OpenAI API key');
    });

    it('should clamp score between 0 and 100', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                optimized_resume: 'Test',
                match_score: 150, // Invalid score
                suggestions: [],
                missing_keywords: []
              })
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await optimizeContent({
        type: 'resume',
        content: 'Test',
        context: 'Test job'
      });

      expect(result.score).toBe(100);
    });
  });

  describe('clearOptimizationCache', () => {
    it('should clear cache', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                optimized_resume: 'Test',
                match_score: 85,
                suggestions: [],
                missing_keywords: []
              })
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const request = {
        type: 'resume' as const,
        content: 'Test',
        context: 'Test job'
      };

      // First call
      await optimizeContent(request);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      // Clear cache
      clearOptimizationCache();

      // Second call should not use cache
      await optimizeContent(request);
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });
});
