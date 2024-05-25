import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) throw new Error("No Token");

  try {
    const order = await db.order.findFirst({
      where: {
        token,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!order) {
      return NextResponse.json({ isValid: false }, { status: 200 });
    }

    return NextResponse.json(
      { isValid: true, orderId: order.id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ isValid: false }, { status: 500 });
  }
}
