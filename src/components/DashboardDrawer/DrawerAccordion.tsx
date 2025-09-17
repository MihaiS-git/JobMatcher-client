import { Accordion } from "@radix-ui/react-accordion";
import DrawerAccordionItem from "./DrawerAccordionItem";

const DrawerAccordion = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full text-base font-medium text-blue-100 dark:text-gray-300"
      defaultValue="item-1"
    >
      <DrawerAccordionItem
        value="item-1"
        label="Projects"
        items={[
          { targetUrl: "/projects", itemTag: "Projects List" },
          { targetUrl: "/projects/create", itemTag: "Create Project" },
        ]}
      />

      <DrawerAccordionItem
        value="item-2"
        label="Proposals"
        items={[{ targetUrl: "/proposals", itemTag: "Proposals List" }]}
      />

      <DrawerAccordionItem
        value="item-3"
        label="Financial"
        items={[{ targetUrl: "/financial", itemTag: "Financial" }]}
      />

      <DrawerAccordionItem
        value="item-4"
        label="Profile"
        items={[
          { targetUrl: "/profile", itemTag: "Profile" },
          { targetUrl: "/edit_public_profile", itemTag: "Public Profile" },
          { targetUrl: "/portfolio", itemTag: "Portfolio" },
        ]}
      />
    </Accordion>
  );
};

export default DrawerAccordion;
