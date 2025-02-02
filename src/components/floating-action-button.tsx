// components/FloatingActionButton.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FABProps {
  actions: FABAction[];
}

const FloatingActionButton: React.FC<FABProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full px-4">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full mb-4 right-0 flex flex-col-reverse space-y-reverse space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                variant="default"
                className="rounded-full shadow-lg flex items-center"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
        <div className="flex justify-end">
          <Button
            onClick={toggleMenu}
            variant="default"
            size="icon"
            className={`rounded-full shadow-lg transition-transform ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingActionButton;