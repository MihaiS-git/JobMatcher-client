import { useIsMobile } from "@/hooks/useIsMobile";
import { NavLink } from "react-router-dom";

interface SubitemProps {
    targetUrl: string;
    itemTag: string;
};

const DrawerAccordionSubitem = ({targetUrl, itemTag}: SubitemProps) => {
  const isMobile = useIsMobile();

  const handleItemClick = () => {
    if (isMobile) {
      close();
    } else {
      return;
    }
  };

  return (
    <li onClick={handleItemClick}>
      <NavLink
        to={targetUrl}
        className={({ isActive }) =>
          isActive
            ? "text-blue-950 dark:text-blue-400"
            : "text-blue-100 hover:text-blue-950 dark:text-blue-100 dark:hover:text-blue-400"
        }
      >
        {itemTag}
      </NavLink>
    </li>
  );
};

export default DrawerAccordionSubitem;
