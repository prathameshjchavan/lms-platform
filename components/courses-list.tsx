import { Category, Course } from "@prisma/client";

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
			{items.map((item) => (
				<div key={item.id}>{item.title}</div>
			))}
		</div>
	);
};

export default CoursesList;
