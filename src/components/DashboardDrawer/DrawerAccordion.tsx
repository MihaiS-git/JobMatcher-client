import { Accordion } from "@radix-ui/react-accordion";
import DrawerAccordionItem from "./DrawerAccordionItem";
import useAuth from "@/hooks/useAuth";

const DrawerAccordion = () => {
  const auth = useAuth();
  const role = auth?.user?.role;

  const projectItems = [{ targetUrl: "/projects", itemTag: "Projects List" }];
  if (role === "CUSTOMER") {
    projectItems.push({ targetUrl: "/projects/create", itemTag: "Create Project" });
  }

  const profileItems = [{ targetUrl: "/profile", itemTag: "Profile" }, { targetUrl: "/edit_public_profile", itemTag: "Public Profile" }];
  if( role === "STAFF" ) {
    profileItems.push({ targetUrl: "/portfolio", itemTag: "Portfolio" });
  }

  const financialItems = [{ targetUrl: "/contracts", itemTag: "Contracts" }, { targetUrl: "/invoices", itemTag: "Invoices" }, { targetUrl: "/payments", itemTag: "Payments" }];

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
        items={projectItems}
      />

      <DrawerAccordionItem
        value="item-2"
        label="Proposals"
        items={[{ targetUrl: "/proposals", itemTag: "Proposals List" }]}
      />

      <DrawerAccordionItem
        value="item-3"
        label="Financials"
        items={financialItems}
      />

      <DrawerAccordionItem
        value="item-4"
        label="Profile"
        items={profileItems}
      />
    </Accordion>
  );
};

export default DrawerAccordion;
