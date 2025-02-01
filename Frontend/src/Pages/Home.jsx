import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Modern Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 left-4 p-2 bg-orange-primary rounded-lg shadow-md hover:bg-orange-secondary transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-orange-primary focus:ring-offset-2"
            >
                {/* Hamburger Icon */}
                <div className="space-y-1.5">
                    <span
                        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                            isOpen ? "rotate-45 translate-y-2" : ""
                        }`}
                    ></span>
                    <span
                        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                            isOpen ? "opacity-0" : "opacity-100"
                        }`}
                    ></span>
                    <span
                        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                            isOpen ? "-rotate-45 -translate-y-2" : ""
                        }`}
                    ></span>
                </div>
            </button>

            {/* Conditional Rendering of Navbar */}
            {isOpen && (
                <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40">
                    <Navbar />
                </div>
            )}

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default Home;