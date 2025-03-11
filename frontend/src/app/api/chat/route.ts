import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CHAT_SECRET = process.env.CHAT_SECRET;

if (!NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

export async function POST(request: NextRequest) {
  if (!CHAT_SECRET) {
    throw new Error("CHAT_SECRET is not defined");
  }

  // Parse the request body
  const { message, chat_session_id } = await request.json();

  // Validate required fields
  if (!message || !chat_session_id) {
    return NextResponse.json(
      { message: "Missing required fields: message or chat_session_id" },
      { status: 400 }
    );
  }

  try {
    // Send request to backend
    const response = await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/chat_send`, {
      user_message: message,
      chat_session_id: chat_session_id,
      chat_secret: CHAT_SECRET,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
