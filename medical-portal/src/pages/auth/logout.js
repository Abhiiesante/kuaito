import { useEffect } from 'react';
import { useRouter } from 'next/router';
import cookies from 'js-cookie'; // For managing cookies

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        cookies.remove('token'); // Clear the JWT token
        router.push('/auth/login'); // Redirect to login page
    }, [router]);

    return <p>Logging out...</p>;
};

export default Logout;
