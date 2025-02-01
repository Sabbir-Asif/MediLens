import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

const Home = () => {
    return (
        <div className="flex">
        <Navbar />
        <Outlet />
    </div>
);
};

export default Home;