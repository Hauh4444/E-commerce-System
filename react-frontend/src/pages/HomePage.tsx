import { useAuth } from '@/contexts/AuthContext';
import { Header } from "@/components/Header";

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <>
            <Header />
            <main className="">
                <section className="">
                    <h1>{isAuthenticated && `Welcome back, ${user?.email}`}</h1>
                </section>
            </main>
        </>
    );
};

export default HomePage;

