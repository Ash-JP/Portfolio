import { NextResponse } from 'next/server';
import { portfolioData } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: portfolioData
  });
}
