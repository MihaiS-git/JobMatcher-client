import { useGetAllLanguagesQuery } from "@/features/languages/languagesApi";

interface Option {
  value: number;
  label: string;
}

function useLanguages() {
  const { data: languages, error, isLoading } = useGetAllLanguagesQuery();

  const languageOptions: Option[] =
    languages?.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })) ?? [];

  return {languageOptions, isLoading, error};
}

export default useLanguages;
