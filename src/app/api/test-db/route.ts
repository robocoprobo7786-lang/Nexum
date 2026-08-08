import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
    try {
        const result = await db.execute(sql`SELECT NOW()`);

        return Response.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return Response.json({
            success: false,
            error,
        });
    }
}