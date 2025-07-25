import { IoMdCloseCircle } from "react-icons/io";

const CloseButton = ({handleClose}: {handleClose: () => void}) => {

  return (
    <button
      className="bg-gray-950 dark:bg-gray-200 hover:bg-red-600 text-gray-200 dark:text-gray-950 rounded-full cursor-pointer"
      onClick={handleClose}
    >
      <IoMdCloseCircle className="w-6 h-6" />
    </button>
  );
};

export default CloseButton;
