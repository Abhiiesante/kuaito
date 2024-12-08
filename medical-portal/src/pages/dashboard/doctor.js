import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cookies from 'js-cookie';

const DoctorDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const handleLogout = () => {
        cookies.remove('token'); // Clear token
        router.push('/auth/logout'); // Redirect to logout logic
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = cookies.get('token');
                if (!token) {
                    throw new Error('Unauthorized');
                }

                const response = await fetch('/api/dashboard/doctor', {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                router.push('/auth/login');
            }
        };

        fetchData();
    }, [router]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
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

export default DoctorDashboard;
