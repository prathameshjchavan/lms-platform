import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressAndCategory = Course & {
	category: Category | null;
	chapters: { id: string }[];
	progress: number | null;
};

interface CourseListProps {
	items: CourseWithProgressAndCategory[];
}

const CoursesList = ({ items }: CourseListProps) => {
	return (
		<div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{items.map((item) => (
					<CourseCard
						key={item.id}
						id={item.id}
						title={item.title}
						imageUrl={item.imageUrl!}
						chaptersLength={item.chapters.length}
						price={item.price!}
						progress={item.progress}
						category={item.category?.name!}
					/>
				))}
			</div>
			{!items.length && (
				<div className="text-center text-sm text-muted-foreground mt-10">
					No courses found
				</div>
			)}
		</div>
	);
};

export default CoursesList;
