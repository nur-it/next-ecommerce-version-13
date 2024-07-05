import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { FiMove } from "react-icons/fi";
import { Link } from "react-scroll";
// internal imports
import useUtilsFunction from "@hooks/useUtilsFunction";

const MenuCard = ({ navRef, categoryList, handleSorting }) => {
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <div
      ref={navRef}
      className="flex w-full overflow-y-scroll scroll-smooth scrollbar-hide items-center gap-4 whitespace-nowrap"
    >
      <SortableList
        onSortEnd={handleSorting}
        className="flex justify-start gap-4"
        draggedItemClassName="dragged menu_list"
      >
        {categoryList?.map((category, index) => (
          <SortableItem key={category._id}>
            <div role="button" className="group">
              <div
                className={`flex items-center justify-center text-sm font-medium text-gray-700 tracking-wide w-full`}
              >
                <SortableKnob>
                  <div className="cursor-move p-2 font-semibold">
                    <FiMove />
                  </div>
                </SortableKnob>

                <Link
                  activeClass="border-b-4 border-gray-800"
                  spy={true}
                  smooth={true}
                  duration={250}
                  offset={-220}
                  to={`${category._id}-${index + 1}`}
                >
                  <div className="text-center">
                    {showingTranslateValue(category?.name)}
                  </div>
                </Link>
              </div>
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
};

export default MenuCard;
