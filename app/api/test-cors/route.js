// app/api/test-cors/route.js
export async function GET() {
  return Response.json({ 
    message: "CORS test successful",
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return Response.json({ 
      message: "POST test successful",
      received: body,
      timestamp: new Date().toISOString(),
      cors: "enabled"
    });
  } catch (error) {
    return Response.json({ 
      message: "POST test failed",
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
