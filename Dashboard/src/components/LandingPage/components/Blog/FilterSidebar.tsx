import React from "react";

const FilterSidebar = ({
  courses,
  selectedCourses,
  onCourseChange,
  priceRange,
  onPriceChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="py-4  max-w-xs mt-20">
      <h3 className="text-lg font-semibold mb-4">Filter & Sort</h3>

      {/* Courses Multi-select */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Courses</h4>
        <div className="flex flex-col space-y-2 max-h-48 overflow-auto">
          {courses.map((course) => (
            <label key={course} className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCourses.includes(course)}
                onChange={() => onCourseChange(course)}
                className="form-checkbox text-purple-600"
              />
              <span className="text-gray-700">{course}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort by */}
      <div>
        <label htmlFor="sort" className="block font-medium mb-2">
          Sort by
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="latest">Date: Latest</option>
          <option value="oldest">Date: Oldest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="titleAZ">Title: A to Z</option>
          <option value="titleZA">Title: Z to A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
