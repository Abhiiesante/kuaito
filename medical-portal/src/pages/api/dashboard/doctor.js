import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../../models/User'; // Adjust path based on your structure

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Connect to MongoDB if not already connected
        if (!mongoose.connection.readyState) {
            await mongoose.connect("mongodb+srv://Abhiram:Christmastree03@cluster0.8pxdr.mongodb.net/medical-portal?retryWrites=true&w=majority");
        }

        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'doctor') {
            return res.status(403).json({ error: 'Forbidden: Access denied' });
        }

        // Return doctor-specific data
        res.status(200).json({
            message: 'Welcome to the doctor dashboard!',
            user: { name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Token Verification Error:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}
