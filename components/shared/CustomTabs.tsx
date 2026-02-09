import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface TabsProps {
  labels: string[];
  links?: (string | null)[];
  className?: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  disabledTabs?: number[]; // New prop for disabled tab indices
}

const Tabs: React.FC<TabsProps> = ({
  labels,
  links = [],
  className,
  activeIndex,
  setActiveIndex,
  disabledTabs = [], // Default to an empty array if no tabs are disabled
}) => {
  const tabRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (currentTab) {
      setUnderlineStyle({
        width: currentTab.offsetWidth,
        left: currentTab.offsetLeft,
      });
    }
  }, [activeIndex]);

  return (
    <div
      className={cn(
        "border-b w-full flex gap-6 relative pt-3 overflow-x-auto",
        className,
      )}
    >
      {labels.map((label, index) => {
        const hasLink = links[index] && links[index] !== null;
        const isDisabled = disabledTabs.includes(index); // Check if the tab is disabled

        return hasLink ? (
          <Link
            key={index}
            ref={(el) => {
              if (el) {
                tabRefs.current[index] = el;
              }
            }}
            href={isDisabled ? "#" : links[index]!} // Prevent navigation if disabled
            className={`relative pb-2 cursor-pointer ${
              activeIndex === index ? "" : "text-gray-500"
            } ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}`} // Apply disabled styles
            onClick={() => !isDisabled && setActiveIndex(index)} // Prevent click if disabled
          >
            <p className="whitespace-nowrap capitalize">
              {label === "addProduct"
                ? "Add Product"
                : label == "viewProduct"
                  ? "View Product"
                  : label}
            </p>
          </Link>
        ) : (
          <button
            key={index}
            ref={(el) => {
              if (el) {
                tabRefs.current[index] = el;
              }
            }}
            className={`relative pb-2 cursor-pointer ${
              activeIndex === index ? "" : "text-gray-500"
            } ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}`} // Apply disabled styles
            onClick={() => !isDisabled && setActiveIndex(index)} // Prevent click if disabled
            disabled={isDisabled} // Add disabled attribute for accessibility
          >
            <p className="whitespace-nowrap">{label}</p>
          </button>
        );
      })}

      {/* Single underline that moves under the active tab */}
      <span
        className="absolute bg-primary h-0.5 rounded-md bottom-0 transition-all duration-300 ease-in-out"
        style={{
          width: `${underlineStyle.width}px`,
          left: `${underlineStyle.left}px`,
        }}
      ></span>
    </div>
  );
};

export default Tabs;
