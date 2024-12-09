import mongoose from 'mongoose';

const patientDetailsSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
    },
});

export default mongoose.models.PatientDetails ||
    mongoose.model('PatientDetails', patientDetailsSchema);
