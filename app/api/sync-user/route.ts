import { syncUserToDatabase } from "@/app/lib/sync-user";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Sync user to database
        await syncUserToDatabase({
            id: body.id,
            email: body.email,
            name: body.name,
            image: body.image,
        });

        return NextResponse.json({
            success: true,
            message: "User synced successfully",
        });
    } catch (error) {
        console.error("Error syncing user:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to sync user",
            },
            { status: 500 }
        );
    }
}
