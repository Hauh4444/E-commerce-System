import { useAuth } from "@/features/auth/useAuth";

import { Header } from "@/components/Header";

const ProfilePage = () => {
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

export default ProfilePage;

