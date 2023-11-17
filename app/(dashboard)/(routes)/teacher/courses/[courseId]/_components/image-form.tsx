"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface ImageFormProps {
	initialData: {
		imageUrl: string | null;
	};
	courseId: string;
}

const formSchema = z.object({
	imageUrl: z.string().min(1, {
		message: "Description is required",
	}),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const router = useRouter();

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);

			toast.success("Course updated");
			toggleEdit();

			router.refresh();
		} catch (error) {
			toast.error("Something went wrong!");
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<Fragment>Cancel</Fragment>
					) : initialData.imageUrl ? (
						<Fragment>
							<Pencil className="h-4 w-4 mr-2" />
							Edit image
						</Fragment>
					) : (
						<Fragment>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add image
						</Fragment>
					)}
				</Button>
			</div>

			{isEditing ? (
				<div>
					<FileUpload
						endpoint="courseImage"
						onChange={(url) => {
							if (url) onSubmit({ imageUrl: url });
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
				</div>
			) : initialData.imageUrl ? (
				<div className="relative aspect-video mt-2">
					<Image
						src={initialData.imageUrl}
						fill
						className="object-cover rounded-md"
						alt="upload"
					/>
				</div>
			) : (
				<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
					<ImageIcon className="h-10 w-10 text-slate-500" />
				</div>
			)}
		</div>
	);
};

export default ImageForm;
