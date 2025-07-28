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
        items={[{ targetUrl: "/projects", itemTag: "Projects" }]}
      />

      <DrawerAccordionItem
        value="item-2"
        label="Financial"
        items={[{ targetUrl: "/financial", itemTag: "Financial" }]}
      />

      <DrawerAccordionItem
        value="item-3"
        label="Profile"
        items={[
          { targetUrl: "/profile", itemTag: "Edit Profile" },
          { targetUrl: "/portfolio", itemTag: "Edit Portfolio" },
        ]}
      />

      <DrawerAccordionItem
        value="item-4"
        label="Settings"
        items={[{ targetUrl: "/settings", itemTag: "Settings" }]}
      />
    </Accordion>
  );
};

export default DrawerAccordion;
