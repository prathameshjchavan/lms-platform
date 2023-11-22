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
	try {
		const { userId, courseId, chapterId, file } = await req.json();

		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		if (file === "courseImage") {
			const course = await db.course.findUnique({
				where: { id: courseId, userId },
			});

			if (!course?.imageUrl || !course.imageKey)
				return new NextResponse("Course Image not found", { status: 404 });

			await utapi.deleteFiles(course.imageKey);

			return NextResponse.json({ message: "deleted" });
		}

		if (file === "chapterVideo") {
			const chapter = await db.chapter.findUnique({
				where: {
					id: chapterId,
					courseId,
				},
			});

			if (!chapter?.videoUrl || !chapter.videoKey)
				return new NextResponse("Chapter Video not found", { status: 404 });

			await utapi.deleteFiles(chapter.videoKey);

			return NextResponse.json({ message: "deleted" });
		}

		return new NextResponse("Invalid File Type", { status: 400 });
	} catch (error) {
		console.log("[UPLOAD_THING]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
