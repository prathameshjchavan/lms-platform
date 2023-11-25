"use client";

import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

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
	title,
	courseId,
	nextChapterId,
	playbackId,
	isLocked,
	completeOnEnd,
}: VideoPlayerProps) => {
	const [isReady, setIsReady] = useState<boolean>(false);

	const ReactPlayer = useMemo(
		() => dynamic(() => import("react-player"), { ssr: false }),
		[]
	);

	return (
		<div className="relative aspect-video">
			{!isLocked && !isReady && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
					<Loader2 className="h-8 w-8 animate-spin text-secondary" />
				</div>
			)}
			{isLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
					<Lock className="h-8 w-8" />
					<p className="text-sm">This chapter is locked</p>
				</div>
			)}
			{!isLocked && (
				<div className={cn(!isReady && "hidden")}>
					<ReactPlayer
						url={playbackId || ""}
						controls
						playing
						width="100%"
						height="100%"
						onReady={() => setIsReady(true)}
						onEnded={() => {}}
					/>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
