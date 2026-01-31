import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  console.log("➡️ SIGNUP API CALLED");

  try {
    const body = await req.json();
    console.log("📦 BODY:", body);

    const { name, email, password } = body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("🔌 Connecting to MongoDB...");
    await connectToDatabase();
    console.log("✅ MongoDB connected");

    console.log("🔍 Checking existing user...");
    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("📝 Creating user...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("👤 User created:", user._id);

    // Do NOT set a token cookie on signup — require explicit login
    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        message: "User created. Please sign in.",
      },
      { status: 201 }
    );

    console.log("🎉 Signup success");
    return response;
  } catch (error) {
    console.error("🔥 SIGNUP API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
