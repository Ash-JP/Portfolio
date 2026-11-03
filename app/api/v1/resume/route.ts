import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Aashray_J_Pramod_Resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Resume file not found' }, { status: 404 });
  }
}
