import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) throw new Error("No UserId");

  try {
    const orders = await db.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const orderDetail = await db.lineItem.findMany({
      where: {
        orderId: body.orderId,
      },
    });

    return NextResponse.json(orderDetail, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const customerShippingAddress = await db.shippingAddress.findUnique({
      where: {
        id: body.shippingAddressId,
      },
    });
    return NextResponse.json(customerShippingAddress, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Unable to fetch shipping address.", {
      status: 500,
    });
  }
}
