import React, { useState } from "react";
import { Plus, UserPlus, Briefcase } from "lucide-react";

interface FABProps {
  onCreateCustomerPost: () => void;
  onCreateOpenJob: () => void;
}
const FloatingActionButton: React.FC<FABProps> = ({
  onCreateCustomerPost,
  onCreateOpenJob,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full px-4">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full mb-4 right-0 flex flex-col-reverse space-y-reverse space-y-2">
            <button
              onClick={() => {
                onCreateCustomerPost();
                setIsOpen(false);
              }}
              className="bg-indigo-500 text-white p-3 rounded-full shadow-lg flex items-center"
            >
              <UserPlus size={24} />
              <span className="ml-2">Customer Post</span>
            </button>
            <button
              onClick={() => {
                onCreateOpenJob();
                setIsOpen(false);
              }}
              className="bg-indigo-500 text-white p-3 rounded-full shadow-lg flex items-center"
            >
              <Briefcase size={24} />
              <span className="ml-2">Open Job</span>
            </button>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={toggleMenu}
            className={`bg-indigo-600 text-white p-4 rounded-full shadow-lg transition-transform ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FloatingActionButton;
