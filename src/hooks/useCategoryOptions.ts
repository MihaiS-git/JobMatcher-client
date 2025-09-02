import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import type { JobCategoryDTO } from "@/types/JobCategoryDTO";
import { useMemo } from "react";

export function useCategoryOptions(): JobCategoryDTO[] {
  const { data: jobCategories } = useGetAllJobCategoriesQuery();

  return useMemo(() => jobCategories ?? [], [jobCategories]);
}
