import { NextResponse } from 'next/server';
import { deepseekClient } from '@/lib/clients/deepseek';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  try {
    const response = await deepseekClient.chat.completions.create({
      messages,
      model: 'deepseek-coder-33b-instruct'
    });
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'DeepSeek API Error' }, 
      { status: 500 }
    );
  }
}
