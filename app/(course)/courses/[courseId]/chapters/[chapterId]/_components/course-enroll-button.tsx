"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
	courseId: string;
	price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onClick = async () => {
		try {
			setIsLoading(true);

			const response = await axios.post(`/api/courses/${courseId}/checkout`);

			window.location.assign(response.data.url);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			className="w-full md:w-auto"
			size="sm"
		>
			Enroll for {formatPrice(price)}
		</Button>
	);
};

export default CourseEnrollButton;
