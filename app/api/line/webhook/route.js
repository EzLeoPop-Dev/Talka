import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

// Verify LINE signature
function verifySignature(body, signature) {
  if (!CHANNEL_SECRET) {
    console.error('CHANNEL_SECRET is not set');
    return false;
  }
  
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// Send reply message to LINE
async function replyMessage(replyToken, messages) {
  if (!CHANNEL_ACCESS_TOKEN) {
    console.error('CHANNEL_ACCESS_TOKEN is not set');
    return;
  }

  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('LINE API Error:', error);
  }

  return response.json();
}

// Handle incoming messages
function handleMessage(event) {
  const { type, text } = event.message;

  if (type === 'text') {
    return {
      type: 'text',
      text: `You said: ${text}`,
    };
  }

  return {
    type: 'text',
    text: 'I received your message!',
  };
}

// POST handler for webhook
export async function POST(request) {
  try {
    console.log('Webhook received');

    // Check environment variables
    if (!CHANNEL_ACCESS_TOKEN || !CHANNEL_SECRET) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('x-line-signature');

    console.log('Signature:', signature ? 'Present' : 'Missing');

    // Verify signature
    if (!signature || !verifySignature(body, signature)) {
      console.error('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);
    console.log('Events:', data.events?.length || 0);

    // Return 200 immediately for verification webhook
    if (!data.events || data.events.length === 0) {
      console.log('No events, returning 200');
      return NextResponse.json({ success: true });
    }

    // Process events asynchronously (don't await)
    processEvents(data.events).catch(err => {
      console.error('Error processing events:', err);
    });

    // Return 200 immediately
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  }
}

// Process events asynchronously
async function processEvents(events) {
  for (const event of events) {
    try {
      if (event.type === 'message' && event.replyToken) {
        const message = handleMessage(event);
        await replyMessage(event.replyToken, [message]);
      }
    } catch (error) {
      console.error('Error processing event:', error);
    }
  }
}

// GET handler for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'LINE Webhook is running',
    envCheck: {
      hasAccessToken: !!CHANNEL_ACCESS_TOKEN,
      hasSecret: !!CHANNEL_SECRET
    }
  });
}