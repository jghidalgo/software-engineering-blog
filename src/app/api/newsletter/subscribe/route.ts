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

interface SubscriptionRequest {
  email: string;
  name?: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    subscribedAt: string;
  };
}

// Simple email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest): Promise<NextResponse<SubscriptionResponse>> {
  try {
    const body: SubscriptionRequest = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email address is required',
        },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a valid email address',
        },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();
    
    const subscriberData = {
      email: normalizedEmail,
      name: name?.trim() || '',
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source: 'website'
    };

    // Store in Airtable (if configured)
    const base = initAirtable();
    if (base) {
      try {
        // Check if email already exists
        const existingRecords = await base('Newsletter Subscribers').select({
          filterByFormula: `{Email} = '${normalizedEmail}'`,
          maxRecords: 1
        }).firstPage();

        if (existingRecords.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message: 'Email is already subscribed to our newsletter',
            },
            { status: 409 }
          );
        }

        // Add new subscriber
        await base('Newsletter Subscribers').create([
          {
            fields: {
              'Email': subscriberData.email,
              'Name': subscriberData.name,
              'Subscribed At': subscriberData.subscribedAt,
              'Status': subscriberData.status,
              'Source': subscriberData.source
            }
          }
        ]);
        console.log('Newsletter subscriber added to Airtable');
      } catch (airtableError) {
        console.error('Airtable newsletter error:', airtableError);
        
        // Check if it's a duplicate error
        if (airtableError instanceof Error && airtableError.message.includes('duplicate')) {
          return NextResponse.json(
            {
              success: false,
              message: 'Email is already subscribed to our newsletter',
            },
            { status: 409 }
          );
        }
        
        // Continue with the response even if Airtable fails
      }
    } else {
      // Fallback: log to console if Airtable not configured
      console.log('Newsletter subscription (Airtable not configured):', subscriberData);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: {
          email: normalizedEmail,
          subscribedAt: subscriberData.subscribedAt,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while subscribing. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { message: 'Newsletter subscription endpoint. Use POST to subscribe.' },
    { status: 405 }
  );
}