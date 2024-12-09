import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import NextAuth from '../auth/[...nextauth]'; // Import NextAuth configuration

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(
                'mongodb+srv://Abhiram:Christmastree03@cluster0.8pxdr.mongodb.net/medical-portal?retryWrites=true&w=majority'
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Fetch current session
        const session = await getServerSession(req, res, NextAuth);

        // Update session with user data
        session.user = { email: newUser.email, role: newUser.role };
        res.status(201).json({ message: 'User registered successfully', redirectTo: '/quiz/patient-details' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
