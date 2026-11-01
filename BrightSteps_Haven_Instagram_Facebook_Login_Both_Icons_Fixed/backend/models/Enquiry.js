import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  parentName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
  phone: { type: String, required: true, trim: true, maxlength: 25 },
  childAge: { type: String, trim: true, maxlength: 40, default: '' },
  service: { type: String, required: true, trim: true, maxlength: 100 },
  date: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' }
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);
