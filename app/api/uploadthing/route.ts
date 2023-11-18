import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({
	fetch: globalThis.fetch,
	apiKey: process.env.UPLOADTHING_SECRET,
});

export const { GET, POST } = createNextRouteHandler({
	router: ourFileRouter,
});

export async function DELETE(req: Request) {
	const { userId, courseId } = await req.json();

	if (!userId) return new NextResponse("Unauthorized", { status: 401 });

	const course = await db.course.findUnique({
		where: { id: courseId, userId },
	});

	if (!course?.imageUrl || !course.imageKey)
		return NextResponse.json({ message: "ok" });

	await utapi.deleteFiles(course.imageKey);

	return NextResponse.json({ message: "deleted" });
}
