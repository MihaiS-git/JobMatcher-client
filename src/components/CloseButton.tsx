import { IoMdCloseCircle } from "react-icons/io";

const CloseButton = ({handleClose}: {handleClose: () => void}) => {

  return (
    <button
      /* className="fixed bottom-24 right-6 bg-red-600 text-gray-950 rounded-full" */
      className="bg-gray-950 dark:bg-gray-200 text-gray-200 dark:text-gray-950 rounded-full"
      onClick={handleClose}
    >
      <IoMdCloseCircle className="w-6 h-6" />
    </button>
  );
};

export default CloseButton;
