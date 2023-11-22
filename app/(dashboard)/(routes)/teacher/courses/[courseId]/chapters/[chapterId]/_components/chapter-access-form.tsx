"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessProps {
	initialData: {
		isFree: boolean;
	};
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterAccessProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const router = useRouter();

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: !!initialData.isFree,
		},
	});
	const { isSubmitting, isValid } = form.formState;

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

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter accesss
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<Fragment>Cancel</Fragment>
					) : (
						<Fragment>
							<Pencil className="h-4 w-4 mr-2" />
							Edit access
						</Fragment>
					)}
				</Button>
			</div>

			{isEditing ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this box if you want to make this chapter free for
											preview
										</FormDescription>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			) : (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData.isFree && "text-slate-500 italic"
					)}
				>
					{initialData.isFree ? (
						<Fragment>This chapter is free for preview.</Fragment>
					) : (
						<Fragment>This chapter is not free.</Fragment>
					)}
				</p>
			)}
		</div>
	);
};

export default ChapterAccessForm;