
import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    timestamps: true,
    collection: 'parents'
  }
);

const Parent =
  mongoose.models.Parent || mongoose.model('Parent', parentSchema);

export default Parent;
