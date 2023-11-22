"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";
import { Chapter } from "@prisma/client";
import dynamic from "next/dynamic";

interface ChapterVideoFormProps {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	videoUrl: z.string().min(1),
	videoKey: z.string().min(1),
});

const ChapterVideoForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterVideoFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const router = useRouter();
	const ReactPlayer = useMemo(
		() => dynamic(() => import("react-player"), { ssr: false }),
		[]
	);

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);

			toast.success("Chapter updated");
			toggleEdit();

			router.refresh();
		} catch (error) {
			toast.error("Something went wrong!");
		}
	};

	const deleteExistingCourseVideo = async (
		courseId: string,
		chapterId: string
	) => {
		const response = await axios.delete("/api/uploadthing", {
			data: { courseId, chapterId, file: "chapterVideo" },
		});
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course video
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<Fragment>Cancel</Fragment>
					) : initialData.videoUrl ? (
						<Fragment>
							<Pencil className="h-4 w-4 mr-2" />
							Edit video
						</Fragment>
					) : (
						<Fragment>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add video
						</Fragment>
					)}
				</Button>
			</div>

			{isEditing ? (
				<div>
					<FileUpload
						endpoint="chapterVideo"
						onChange={async ({ url, key }) => {
							if (!url || !key) return;

							if (initialData.videoUrl) {
								await deleteExistingCourseVideo(courseId, chapterId);
							}

							onSubmit({ videoUrl: url, videoKey: key });
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Upload this chapter&apos;s video
					</div>
				</div>
			) : initialData.videoUrl ? (
				<div className="relative aspect-video mt-2">
					<ReactPlayer
						url={initialData.videoUrl || ""}
						playing
						controls
						width="100%"
						height="100%"
					/>
				</div>
			) : (
				<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
					<Video className="h-10 w-10 text-slate-500" />
				</div>
			)}

			{initialData.videoUrl && !isEditing && (
				<div className="text-xs text-muted-foreground mt-2">
					Videos can take a few minutes to process. Refresh the page if video
					does not appear.
				</div>
			)}
		</div>
	);
};

export default ChapterVideoForm;
