import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const PatientDetailsQuiz = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Initialize form data
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
        phone: '',
        email: '', // Will be auto-populated from session
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
        },
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Populate email field from session
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.email) {
            setFormData((prev) => ({ ...prev, email: session.user.email }));
        }
    }, [session, status]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('address.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else if (name.includes('emergencyContact.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/quiz/patient-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Quiz Submission Success:', data);
                router.push('/dashboard/patient'); // Redirect to patient dashboard
            } else {
                const errorData = await response.json();
                console.error('Quiz Submission Failed:', errorData);
                setError(errorData.error || 'Failed to save details');
            }
        } catch (error) {
            console.error('Error Submitting Quiz:', error);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading indicator while fetching session or submitting form
    if (status === 'loading' || loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-white rounded shadow-md w-full max-w-lg"
            >
                <h1 className="text-2xl font-bold mb-4">Patient Details Quiz</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}

                {/* Full Name */}
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Date of Birth */}
                <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Gender */}
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="" disabled>
                        Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                {/* Blood Group */}
                <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="" disabled>
                        Select Blood Group
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>

                {/* Address Fields */}
                <h2 className="text-lg font-bold mb-2">Address</h2>
                {['street', 'city', 'state', 'zip', 'country'].map((field) => (
                    <input
                        key={field}
                        type="text"
                        name={`address.${field}`}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData.address[field]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                    />
                ))}

                {/* Phone Number */}
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Email (Read-only) */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4 bg-gray-100"
                />

                {/* Emergency Contact Fields */}
                <h2 className="text-lg font-bold mb-2">Emergency Contact</h2>
                {['name', 'relationship', 'phone'].map((field) => (
                    <input
                        key={field}
                        type="text"
                        name={`emergencyContact.${field}`}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData.emergencyContact[field]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                    />
                ))}

                <button
                    type="submit"
                    className="w-full p-2 bg-green-500 text-white rounded"
                    disabled={loading}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PatientDetailsQuiz;
