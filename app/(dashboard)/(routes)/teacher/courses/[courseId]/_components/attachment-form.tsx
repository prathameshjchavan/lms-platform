"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
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
	name: z.string().min(1, {
		message: "Attachment Name is required",
	}),
});

const AttachmentForm = ({
	initialData,
	courseId,
	userId,
}: AttachmentFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
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

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id);
			await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
			toast.success("Attachment deleted");
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setDeletingId(null);
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
						onChange={async ({ url, key, name }) => {
							if (!url || !key || !name) return;

							onSubmit({ url, key, name });
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Add anything your students might need to complete the course.
					</div>
				</div>
			) : (
				<Fragment>
					{!initialData.attachments.length ? (
						<p className="text-sm mt-2 text-slate-500 italic">
							No attachments yet
						</p>
					) : (
						<div className="space-y-2">
							{initialData.attachments.map((attachment) => (
								<div
									key={attachment.id}
									className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
								>
									<File className="h-4 w-4 mr-2 flex-shrink-0" />
									<p className="text-xs line-clamp-1">{attachment.name}</p>
									{deletingId === attachment.id ? (
										<Loader2 className="h-4 w-4 ml-auto animate-spin" />
									) : (
										<button
											onClick={() => onDelete(attachment.id)}
											className="ml-auto hover:opacity-75 transition"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default AttachmentForm;
