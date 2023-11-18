"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
	onChange: (url?: string, key?: string) => void;
	endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url, res?.[0].key);
			}}
			onUploadError={(error: Error) => {
				toast.error(`${error?.message}`);
			}}
		/>
	);
};

export default FileUpload;
