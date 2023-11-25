import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChapterIdPageProps {
	params: {
		courseId: string;
		chapterId: string;
	};
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
	const { userId } = auth();

	if (!userId) return redirect("/");

	const { chapter, course, attachments, nextChapter, userProgress, purchase } =
		await getChapter({
			userId,
			chapterId: params.chapterId,
			courseId: params.courseId,
		});

	if (!chapter || !course) return redirect("/");

	const isLocked = !chapter.isFree && !purchase;
	const completeOnEnd = !!purchase && !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner variant="success" label="You already completed this chapter." />
			)}
			{isLocked && (
				<Banner
					variant="warning"
					label="You need to purchase this course to watch this chapter."
				/>
			)}
		</div>
	);
};

export default ChapterIdPage;
