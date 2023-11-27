"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
	chapterId: string;
	title: string;
	courseId: string;
	nextChapterId?: string;
	playbackId: string;
	isLocked: boolean;
	completeOnEnd: boolean;
}

const VideoPlayer = ({
	chapterId,
	courseId,
	nextChapterId,
	playbackId,
	isLocked,
	completeOnEnd,
}: VideoPlayerProps) => {
	const [isReady, setIsReady] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const router = useRouter();
	const confetti = useConfettiStore();

	const ReactPlayer = useMemo(
		() => dynamic(() => import("react-player"), { ssr: false }),
		[]
	);

	const onEnd = async () => {
		try {
			if (completeOnEnd) {
				await axios.put(
					`/api/courses/${courseId}/chapters/${chapterId}/progress`,
					{
						isCompleted: true,
					}
				);

				toast.success("Progress updated");

				if (!nextChapterId) {
					confetti.onOpen();
				} else {
					router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
				}

				router.refresh();
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="relative aspect-video">
			{isLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
					<Lock className="h-8 w-8" />
					<p className="text-sm">This chapter is locked</p>
				</div>
			)}

			{!isLocked && !isReady && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
					<Loader2 className="h-8 w-8 animate-spin text-secondary" />
				</div>
			)}

			{!isLocked && (
				<div className={cn(!isReady && "hidden", "video-player-react")}>
					<ReactPlayer
						url={playbackId || ""}
						playing={isPlaying}
						controls
						width="100%"
						height="100%"
						onReady={() => {
							setIsReady(true);
							setIsPlaying(true);
						}}
						onEnded={onEnd}
					/>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
