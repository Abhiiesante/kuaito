import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const PatientDashboard = () => {
    const { data: session, status } = useSession(); // Retrieve session
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Session:', session);
        const fetchData = async () => {
            try {
                // Check if session is loaded
                if (status === 'loading') return;



                const response = await fetch('/api/dashboard/patient', {
                    headers: {
                        Authorization: `Bearer ${session.user.email}`, // Pass session email
                    },
                });

                if (!response.ok) {
                    throw new Error('Unauthorized');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                console.error('Authorization Error:', err);
                setError('You are not authorized to access this page.');
                router.push('/auth/login'); // Redirect to login if unauthorized
            }
        };

        fetchData();
    }, [session, status, router]);

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/login' }); // Sign out and redirect
    };

    if (status === 'loading') {
        return <p>Loading session...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>Your role is: {user.role}</p>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">
                Logout
            </button>
        </div>
    );
};

export default PatientDashboard;
