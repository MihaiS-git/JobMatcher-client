import { SquareArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  className?: string;
  label: string;
};

const BackButton = ({ className, label }: Props) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    const from = sessionStorage.getItem(label);
    navigate(from ?? "/projects");
  };

  return (
    <div className="w-full ms-8">
      <SquareArrowLeft
        onClick={handleBackClick}
        className={`cursor-pointer text-gray-500 hover:text-gray-700 ${className} my-2`}
      />
    </div>
  );
};

export default BackButton;
