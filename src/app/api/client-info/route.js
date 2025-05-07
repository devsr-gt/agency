import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to stored client info
    const clientInfoPath = path.join(process.cwd(), 'data', 'client-info.json');
    
    // Check if client info exists
    if (fs.existsSync(clientInfoPath)) {
      const clientData = JSON.parse(fs.readFileSync(clientInfoPath, 'utf8'));
      return NextResponse.json(clientData);
    } else {
      return NextResponse.json({ message: 'No client information found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in GET /api/client-info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const clientInfo = await request.json();
    
    // Validate required fields
    if (!clientInfo.businessName) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }
    
    // Save client info to file
    const clientDataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(clientDataDir)) {
      fs.mkdirSync(clientDataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(clientDataDir, 'client-info.json'),
      JSON.stringify(clientInfo, null, 2)
    );
    
    return NextResponse.json({
      message: 'Client information saved successfully',
      clientInfo
    });
  } catch (error) {
    console.error('Error in POST /api/client-info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}