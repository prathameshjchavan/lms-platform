"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
	onChange: (params: { url?: string; key?: string; name?: string }) => void;
	endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange({ url: res?.[0].url, key: res?.[0].key, name: res?.[0].name });
			}}
			onUploadError={(error: Error) => {
				toast.error(`${error?.message}`);
			}}
		/>
	);
};

export default FileUpload;
