import mongoose from 'mongoose';
import PatientDetails from '../../../models/PatientDetails'; // Schema for patient details

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Connect to MongoDB if not already connected
        if (!mongoose.connection.readyState) {
            await mongoose.connect("mongodb+srv://Abhiram:Christmastree03@cluster0.8pxdr.mongodb.net/medical-portal?retryWrites=true&w=majority");
        }

        // Create and save the patient details
        const patientDetails = new PatientDetails(req.body);
        await patientDetails.save();

        res.status(201).json({ message: 'Patient details saved successfully' });
    } catch (error) {
        console.error('Error saving patient details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
