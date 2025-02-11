import { DeepSeek } from '@deepseek/api';

export const deepseekClient = new DeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseUrl: 'https://api.deepseek.com/v1',
  chatEndpoint: '/chat/completions'
});
