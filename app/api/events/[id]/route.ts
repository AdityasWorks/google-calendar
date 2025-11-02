import { deleteEvent, getEventById, updateEvent } from "@/app/lib/db-helpers";
import { updateEventSchema } from "@/app/lib/validation";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

interface EventUpdateData {
    title?: string;
    description?: string;
    start_time?: Date;
    end_time?: Date;
    location?: string;
    color?: string;
    is_all_day?: boolean;
    recurrence_rule?: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { id } = await params;
        const eventId = parseInt(id, 10);

        if (isNaN(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        const event = await getEventById(eventId, session.user.id);

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Event not found",
                },
                { status: 404 }
            );
        }

        const serializedEvent = {
            ...event,
            start_time: event.start_time.toISOString(),
            end_time: event.end_time.toISOString(),
            created_at: event.created_at.toISOString(),
            updated_at: event.updated_at.toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: serializedEvent,
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch event",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { id } = await params;
        const eventId = parseInt(id, 10);

        if (isNaN(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const validatedData = updateEventSchema.parse(body);

        const updates: EventUpdateData = {};

        if (validatedData.title !== undefined) updates.title = validatedData.title;
        if (validatedData.description !== undefined) updates.description = validatedData.description;
        if (validatedData.location !== undefined) updates.location = validatedData.location;
        if (validatedData.color !== undefined) updates.color = validatedData.color;
        if (validatedData.is_all_day !== undefined) updates.is_all_day = validatedData.is_all_day;
        if (validatedData.recurrence_rule !== undefined) updates.recurrence_rule = validatedData.recurrence_rule;

        if (validatedData.start_time !== undefined) {
            updates.start_time = new Date(validatedData.start_time);
        }
        if (validatedData.end_time !== undefined) {
            updates.end_time = new Date(validatedData.end_time);
        }

        const updatedEvent = await updateEvent(eventId, session.user.id, updates);

        if (!updatedEvent) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Event not found or update failed",
                },
                { status: 404 }
            );
        }

        const serializedEvent = {
            ...updatedEvent,
            start_time: updatedEvent.start_time.toISOString(),
            end_time: updatedEvent.end_time.toISOString(),
            created_at: updatedEvent.created_at.toISOString(),
            updated_at: updatedEvent.updated_at.toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: serializedEvent,
            message: "Event updated successfully",
        });
    } catch (error) {
        console.error("Error updating event:", error);

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid request data",
                    details: error.issues,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to update event",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { id } = await params;
        const eventId = parseInt(id, 10);

        if (isNaN(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        const success = await deleteEvent(eventId, session.user.id);

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Event not found or delete failed",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete event",
            },
            { status: 500 }
        );
    }
}
