import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-center absolute top-0">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-6">
                    Oops! The page you are looking for does not exist.
                </p>
                <Button
                    className="text-lg"
                    onClick={() => window.location.href = "/"}
                >
                    Go to Home
                </Button>
            </main>
        </>
    );
};

export default NotFoundPage;
