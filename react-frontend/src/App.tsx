import { PublicRoutes } from "./routes/PublicRoutes";

import { Toaster } from "@/components/ui/toaster";

import "./App.css";

const App = () => {
    return (
        <>
            <PublicRoutes />
            <Toaster />
        </>
    );
};

export default App;
