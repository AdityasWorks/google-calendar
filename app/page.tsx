"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import { SkeletonMonthView } from "./components/ui/SkeletonLoader";
import { useCalendar } from "./context/CalendarContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { fetchEvents } from "./lib/api-client";

export default function Home() {
    const { data: session, status } = useSession();
    const { setEvents } = useCalendar();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userSynced, setUserSynced] = useState(false);

    useKeyboardShortcuts();

    // Sync user to database on first load
    useEffect(() => {
        async function syncUser() {
            if (session?.user && !userSynced) {
                try {
                    await fetch("/api/sync-user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.name,
                            image: session.user.image,
                        }),
                    });
                    setUserSynced(true);
                } catch (err) {
                    console.error("Failed to sync user:", err);
                }
            }
        }

        if (status === "authenticated") {
            syncUser();
        }
    }, [session, status, userSynced]);

    const loadEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const events = await fetchEvents();
            setEvents(events);
        } catch (error) {
            console.error("Failed to load events:", error);
            setError("Failed to load events. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userSynced) {
            loadEvents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSynced]);

    useEffect(() => {
        const handleRefresh = () => {
            loadEvents();
        };

        window.addEventListener("refreshEvents", handleRefresh);
        return () => window.removeEventListener("refreshEvents", handleRefresh);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <SkeletonMonthView />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">⚠️ {error}</div>
                    <button
                        onClick={loadEvents}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return <Calendar user={session?.user} />;
}
