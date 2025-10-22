import { lazy, Suspense, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const HamburgerMenu = lazy(() => import("./HamburgerMenu"));

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <div
          className="p-2 w-8 h-8 space-y-1 bg-gray-200 hover:bg-gray-400 rounded xl:hidden"
          onClick={toggleMenu}
        >
          <span className="block w-4 h-0.5 bg-gray-900 animate-pulse"></span>
          <span className="block w-4 h-0.5 bg-gray-900 animate-pulse"></span>
          <span className="block w-4 h-0.5 bg-gray-900 animate-pulse"></span>
        </div>
      )}
      {isOpen && (
        <Suspense fallback={<LoadingSpinner fullScreen={false} size={24} />}>
          <HamburgerMenu openState={isOpen} handleClose={handleClose} />
        </Suspense>
      )}
    </>
  );
};

export default Hamburger;
