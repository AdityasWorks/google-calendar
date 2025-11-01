"use client";

import { Event } from "@/app/context/CalendarContext";
import { createEventAPI, deleteEventAPI, updateEventAPI } from "@/app/lib/api-client";
import { AlignLeft, Clock, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EventFormProps {
    event: Event | null;
    onSave: () => void;
    onClose: () => void;
    initialDate?: Date;
}

export default function EventForm({ event, onSave, onClose, initialDate }: EventFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [color, setColor] = useState("#4285f4");
    const [isAllDay, setIsAllDay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Color presets (Google Calendar colors)
    const colorPresets = [
        { name: "Blue", value: "#4285f4" },
        { name: "Red", value: "#ea4335" },
        { name: "Yellow", value: "#fbbc04" },
        { name: "Green", value: "#34a853" },
        { name: "Purple", value: "#a142f4" },
        { name: "Orange", value: "#ff6d00" },
        { name: "Teal", value: "#00897b" },
        { name: "Pink", value: "#e91e63" },
    ];

    useEffect(() => {
        if (event) {
            // Edit mode
            setTitle(event.title);
            setDescription(event.description || "");
            setStartTime(event.start_time.slice(0, 16));
            setEndTime(event.end_time.slice(0, 16));
            setLocation(event.location || "");
            setColor(event.color);
            setIsAllDay(event.is_all_day);
        } else if (initialDate) {
            // Create mode with initial date
            const year = initialDate.getFullYear();
            const month = String(initialDate.getMonth() + 1).padStart(2, "0");
            const day = String(initialDate.getDate()).padStart(2, "0");
            const hours = String(initialDate.getHours() || 9).padStart(2, "0");
            const minutes = String(initialDate.getMinutes()).padStart(2, "0");

            const dateStr = `${year}-${month}-${day}`;
            const timeStr = `${hours}:${minutes}`;

            setStartTime(`${dateStr}T${timeStr}`);

            // Set end time 1 hour later
            const endDate = new Date(initialDate);
            endDate.setHours((initialDate.getHours() || 9) + 1);
            const endHours = String(endDate.getHours()).padStart(2, "0");
            const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
            setEndTime(`${dateStr}T${endHours}:${endMinutes}`);
        }
    }, [event, initialDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const eventData = {
                title,
                description,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                location,
                color,
                is_all_day: isAllDay,
            };

            if (event) {
                // Update existing event
                await updateEventAPI(event.id, eventData);
            } else {
                // Create new event
                await createEventAPI(eventData);
            }

            onSave();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save event");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!event) return;

        if (!confirm("Are you sure you want to delete this event?")) return;

        setIsLoading(true);
        try {
            await deleteEventAPI(event.id);
            onSave();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete event");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
            )}

            {/* Title */}
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Add title"
                    required
                    className="w-full text-2xl font-normal border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none px-0 py-2 placeholder-gray-400 text-gray-900"
                />
            </div>

            {/* Time */}
            <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gray-500 mt-3" />
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAllDay}
                            onChange={e => setIsAllDay(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">All day</span>
                    </label>
                </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-500 mt-3" />
                <div className="flex-1">
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="Add location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
                <AlignLeft className="w-5 h-5 text-gray-500 mt-3" />
                <div className="flex-1">
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Add description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
                <div className="flex gap-2 flex-wrap">
                    {colorPresets.map(preset => (
                        <button
                            key={preset.value}
                            type="button"
                            onClick={() => setColor(preset.value)}
                            className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                                color === preset.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                            }`}
                            style={{ backgroundColor: preset.value }}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                    {event && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Saving..." : event ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </form>
    );
}
