"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
	const pathname = usePathname();
	const { userId } = useAuth();

	const isTeacherPage = pathname.startsWith("/teacher");
	const isCoursePage = pathname.includes("/courses");
	const isSearchPage = pathname === "/search";

	return (
		<Fragment>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="flex gap-x-2 ml-auto items-center">
				{isTeacherPage || isCoursePage ? (
					<Link href="/">
						<Button size="sm" variant="ghost">
							<LogOut className="h-4 w-4 mr-2" />
							Exit
						</Button>
					</Link>
				) : isTeacher(userId) ? (
					<Link href="/teacher/courses">
						<Button size="sm" variant="ghost">
							Teacher Mode
						</Button>
					</Link>
				) : null}
				<UserButton afterSignOutUrl={`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?redirect_url=https%3A%2F%2Flms-platform-lake.vercel.app%2F`} />
			</div>
		</Fragment>
	);
};

export default NavbarRoutes;
