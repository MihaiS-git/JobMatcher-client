import { useDeletePortfolioItemMutation } from "@/features/profile/portfolio/portfolioApi";
import type { PortfolioItemSummaryDTO } from "@/types/PortfolioDTO";
import { Trash2 } from "lucide-react";

type Props = {
  item: PortfolioItemSummaryDTO;
};

const PortfolioItemCard = ({ item }: Props) => {
  const [deletePortfolioItem] = useDeletePortfolioItemMutation();

  const handleDeleteItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePortfolioItem(item.id);
  };

  return (
    <div className="p-4 flex flex-row justify-between border rounded-lg shadow-sm bg-blue-400 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-blue-500 dark:hover:bg-gray-600 cursor-pointer">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-200">{item.title}</h2>
        <p className="text-sm text-gray-300">{item.description}</p>
        <p className="text-xs text-gray-300">
          Category: {item.category.name || "Not categorized"}
        </p>
        <p className="text-xs text-gray-300">
          Subcategory:{" "}
          {item.subcategories?.map((s) => s.name).join(", ") || "None"}
        </p>
      </div>
      <div className="flex flex-col justify-center">
        <Trash2 className="text-red-500 w-5 h-5" onClick={handleDeleteItem}/>
      </div>
    </div>
  );
};

export default PortfolioItemCard;
