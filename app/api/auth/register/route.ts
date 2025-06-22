import { connectToDatabase } from "@/lib/bd";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    const newUser = new User({ email, password });
    await newUser.create();
    return NextResponse.json(
      { message: "Registration successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in registration route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
