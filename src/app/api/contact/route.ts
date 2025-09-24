import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable (free tier: 1,200 records)
const initAirtable = () => {
  if (process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN && process.env.AIRTABLE_BASE_ID) {
    return new Airtable({
      apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
    }).base(process.env.AIRTABLE_BASE_ID);
  }
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Store the message
    const contactData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    };

    // Store in Airtable (if configured)
    const base = initAirtable();
    if (base) {
      try {
        await base('Contact Messages').create([
          {
            fields: {
              'Name': contactData.name,
              'Email': contactData.email,
              'Subject': contactData.subject,
              'Message': contactData.message,
              'Submitted': contactData.timestamp,
              'IP Address': contactData.ip,
              'Status': 'New'
            }
          }
        ]);
        console.log('Contact message stored in Airtable');
      } catch (airtableError) {
        console.error('Airtable storage error:', airtableError);
        // Continue with the response even if Airtable fails
      }
    } else {
      // Fallback: log to console if Airtable not configured
      console.log('Contact form submission (Airtable not configured):', contactData);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.',
        id: Date.now().toString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}