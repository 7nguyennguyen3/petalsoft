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

  const { user_message, history } = await request.json();

  if (!user_message) {
    return NextResponse.json(
      { message: "Missing required field: user_message" },
      { status: 400 }
    );
  }

  const combinedMessage = `You are an assistant at Petalsoft, a skincare and perfume company. 
  You are tasked with answering user questions about our products and services. Add in emojis where appropriate.
  
  \nUser question: ${user_message}\Conversation history:\n${history}`;

  try {
    const response = await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/petalsoft`, {
      user_message: combinedMessage,
      chat_secret: CHAT_SECRET,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Backend error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
