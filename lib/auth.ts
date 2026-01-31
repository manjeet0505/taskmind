import jwt, { JwtPayload } from "jsonwebtoken";
import { connectToDatabase } from "./mongoose";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

// --------------------
// SIGN TOKEN
// --------------------
export function signToken(payload: { id: string }) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

// --------------------
// VERIFY TOKEN
// --------------------
export function verifyToken(token: string): { id: string } {
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

  if (!decoded || typeof decoded !== "object" || !decoded.id) {
    throw new Error("Invalid token");
  }

  return { id: decoded.id as string };
}

// --------------------
// GET USER FROM TOKEN
// --------------------
export async function getUserFromToken(token: string) {
  const { id } = verifyToken(token);
  await connectToDatabase();
  const user = await User.findById(id).lean();
  return user;
}
