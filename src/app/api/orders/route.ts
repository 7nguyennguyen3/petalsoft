import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const orders = await db.order.findMany();

  return NextResponse.json(orders, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const updatedProduct = await db.order.update({
      where: {
        id: body.id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Unable to update product.", { status: 500 });
  }
}
