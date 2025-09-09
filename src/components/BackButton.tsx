import { SquareArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
    
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="w-full ms-8">
      <SquareArrowLeft
        onClick={handleBackClick}
        className="cursor-pointer text-gray-500 hover:text-gray-700"
      />
    </div>
  );
};

export default BackButton;
