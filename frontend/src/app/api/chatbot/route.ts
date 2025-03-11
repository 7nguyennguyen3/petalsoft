import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await axios.post(process.env.CHATBOT_API!, body);

  return NextResponse.json(response.data);
}
