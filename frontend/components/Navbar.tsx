"use client";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    if (loading) {
        return (
            <nav className="flex justify-between items-center p-4 bg-gray-900 text-white h-16">
                <span className="font-bold">BestBuy Hub</span>
                <span className="text-sm text-gray-400">Verifying session...</span>
            </nav>
        );
    }

    return (
        <div>
            Best Buy Hub
            {isAuthenticated ? (
                <>
                    <div>
                        Hello World Authenticated
                    </div>
                </>
            ) : (
                <>
                    <div>
                        Hello world not authenticated
                    </div>
                </>
            )}
        </div>
    )
}