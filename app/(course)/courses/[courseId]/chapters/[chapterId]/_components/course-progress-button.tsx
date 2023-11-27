"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface CourseProgressButtonProps {
	chapterId: string;
	courseId: string;
	nextChapterId?: string;
	isCompleted?: boolean;
}

const CourseProgressButton = ({
	chapterId,
	courseId,
	nextChapterId,
	isCompleted,
}: CourseProgressButtonProps) => {
	const Icon = isCompleted ? XCircle : CheckCircle;

	return (
		<Button
			type="button"
			variant={isCompleted ? "outline" : "success"}
			className="w-full md:w-auto"
		>
			{isCompleted ? "Not completed" : "Mark as complete"}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};

export default CourseProgressButton;
