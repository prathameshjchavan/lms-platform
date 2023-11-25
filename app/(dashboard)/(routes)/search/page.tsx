import { db } from "@/lib/db";
import Categories from "./_components/categories";
import { Fragment } from "react";
import SearchInput from "@/components/search-input";

const SearchPage = async () => {
	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	return (
		<Fragment>
			<div className="px-6 pt-6 md:hidden md:mb-0 block">
				<SearchInput />
			</div>
			<div className="p-6">
				<Categories items={categories} />
			</div>
		</Fragment>
	);
};

export default SearchPage;
