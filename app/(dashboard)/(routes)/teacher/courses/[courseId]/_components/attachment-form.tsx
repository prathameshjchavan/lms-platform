"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";
import { Attachment } from "@prisma/client";

interface AttachmentFormProps {
	initialData: {
		attachments: Attachment[];
	};
	courseId: string;
	userId: string;
}

const formSchema = z.object({
	url: z.string().min(1, {
		message: "Attachment URL is required",
	}),
	key: z.string().min(1, {
		message: "Attachment Key is required",
	}),
});

const AttachmentForm = ({
	initialData,
	courseId,
	userId,
}: AttachmentFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const router = useRouter();

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, values);

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
				Course attachments
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<Fragment>Cancel</Fragment>
					) : (
						<Fragment>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add file
						</Fragment>
					)}
				</Button>
			</div>

			{isEditing ? (
				<div>
					<FileUpload
						endpoint="courseAttachments"
						onChange={async (url, key) => {
							if (!url || !key) return;

							onSubmit({ url, key });
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Add anything your students might need to complete the course.
					</div>
				</div>
			) : (
				<Fragment>
					{!initialData.attachments.length && (
						<p className="text-sm mt-2 text-slate-500 italic">
							No attachments yet
						</p>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default AttachmentForm;
