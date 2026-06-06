import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), 'deploy.log');
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf8');
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Try public directory fallback
    const publicLogPath = path.join(process.cwd(), 'public', 'deploy.log');
    if (fs.existsSync(publicLogPath)) {
      const content = fs.readFileSync(publicLogPath, 'utf8');
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Deploy log not found', 
      processCwd: process.cwd(),
      searchedPaths: [logPath, publicLogPath]
    }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
