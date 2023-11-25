import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";

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
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4">
					<VideoPlayer
						chapterId={params.chapterId}
						title={chapter.title}
						courseId={params.courseId}
						nextChapterId={nextChapter?.id}
						playbackId={chapter.videoUrl!}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
						{purchase ? (
							<div>{/* TODO: Add CourseProgressButton */}</div>
						) : (
							<CourseEnrollButton
								courseId={params.courseId}
								price={course.price!}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
