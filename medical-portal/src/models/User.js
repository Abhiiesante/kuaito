import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor'], required: true },
    provider: { type: String }, // e.g., 'google', 'azure-ad'
    accessToken: { type: String },
    refreshToken: { type: String },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
