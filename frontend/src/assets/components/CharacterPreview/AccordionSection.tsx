import { ChevronDown } from "lucide-react";
import type { CharacterSectionProps, AccordionItem, StatDetail } from "./types";

interface AccordionSectionProps extends CharacterSectionProps {
  content: AccordionItem[];
}

export function AccordionSection({
  content,
  expandedItems,
  toggleItem,
}: AccordionSectionProps) {
  const items = content as AccordionItem[];

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const itemId = `accordion-${index}`;
        const isOpen = expandedItems.has(itemId);

        return (
          <div key={itemId} className="flex flex-col">
            <button
              type="button"
              onClick={() => toggleItem(itemId)}
              className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral transition-colors ${
                isOpen
                  ? "bg-light/50 hover:bg-light/60"
                  : "bg-neutral hover:bg-light/50"
              }`}
              aria-expanded={isOpen}
              aria-controls={`${itemId}-panel`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-text">
                    {item.title}
                  </h3>
                  {typeof item.content === "string" && (
                    <p className="text-xs uppercase tracking-widest text-gray-light mt-1">
                      {item.content}
                    </p>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text flex-shrink-0">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-180 text-gold-neutral" : ""
                    }`}
                  />
                  {isOpen ? "Close" : "Open"}
                </span>
              </div>
            </button>

            {isOpen && (
              <div
                id={`${itemId}-panel`}
                className="bg-neutral border-2 border-t-0 border-gold-dark p-4 flex flex-col gap-3"
              >
                {Array.isArray(item.content) && item.content.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {item.content.map(
                      (subItem: StatDetail, subIndex: number) => (
                        <div
                          key={subIndex}
                          className="flex items-center justify-between gap-4 border border-gold-dark bg-dark p-3"
                        >
                          <p className="text-sm text-neutral-text">
                            {typeof subItem === "object" && "name" in subItem
                              ? subItem.name
                              : subItem}
                          </p>
                          {typeof subItem === "object" &&
                            "value" in subItem && (
                              <p className="text-sm font-semibold text-gold-neutral">
                                {subItem.value}
                              </p>
                            )}
                        </div>
                      ),
                    )}
                  </div>
                ) : null}

                {item.subitems && item.subitems.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {item.subitems.map((subitem, subIndex) => {
                      const subitemId = `${itemId}-subitem-${subIndex}`;
                      const isSubitemOpen = expandedItems.has(subitemId);

                      return (
                        <div key={subitemId} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => toggleItem(subitemId)}
                            className={`w-full p-3 text-left cursor-pointer border border-gold-dark transition-colors ${
                              isSubitemOpen
                                ? "bg-light hover:bg-light/50"
                                : "bg-dark hover:bg-light/30"
                            }`}
                            aria-expanded={isSubitemOpen}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <p className="font-medium text-neutral-text">
                                {subitem.title}
                              </p>
                              <ChevronDown
                                className={`h-3 w-3 transition-transform flex-shrink-0 ${
                                  isSubitemOpen
                                    ? "rotate-180 text-gold-neutral"
                                    : "text-gray-neutral"
                                }`}
                              />
                            </div>
                          </button>

                          {isSubitemOpen && (
                            <div className="bg-dark p-3 border border-t-0 border-gold-dark text-sm text-neutral-text leading-7">
                              {subitem.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
