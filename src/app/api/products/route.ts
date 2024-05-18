import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const products = await db.pRODUCTS.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
