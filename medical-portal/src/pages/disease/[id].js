import { useRouter } from 'next/router';

const DiseasePage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <h1>Disease Details for {id}</h1>
            {/* Display symptoms, diagnosis, and treatment */}
        </div>
    );
};

export default DiseasePage;
