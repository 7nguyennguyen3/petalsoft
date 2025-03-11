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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const updatedProduct = await db.pRODUCTS.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        stock: body.stock,
        price: body.price,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Unable to update product.", { status: 500 });
  }
}
