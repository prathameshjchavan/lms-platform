import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment } from "react";

interface TeacherLayoutProps {
	children: React.ReactNode;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
	const { userId } = auth();

	if (!isTeacher(userId)) return redirect("/");

	return <Fragment>{children}</Fragment>;
};

export default TeacherLayout;
