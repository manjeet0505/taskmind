import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  preferences?: Record<string, any>;
  workingHours?: any;
  aiSettings?: Record<string, any>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  preferences: { type: Schema.Types.Mixed, default: {} },
  workingHours: { type: Schema.Types.Mixed, default: {} },
  aiSettings: { type: Schema.Types.Mixed, default: {} },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
