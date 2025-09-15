import { NextRequest, NextResponse } from 'next/server';

// This is a mock implementation. In production, you would integrate with:
// - Mailchimp, ConvertKit, EmailOctopus, or similar service
// - A database to store email addresses
// - Email validation service

interface SubscriptionRequest {
  email: string;
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
    const { email } = body;

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

    // TODO: In production, you would:
    // 1. Check if email already exists in your database
    // 2. Save to database or send to email service provider
    // 3. Send welcome email
    // 4. Handle any errors from the email service

    // Mock successful subscription
    console.log(`Newsletter subscription for: ${normalizedEmail}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: {
          email: normalizedEmail,
          subscribedAt: new Date().toISOString(),
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