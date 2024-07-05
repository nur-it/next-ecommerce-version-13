import { useRouter } from "next/router";
import { useContext } from "react";

//internal import
import CMSkeleton from "@component/preloader/CMSkeleton";
import { SidebarContext } from "@context/SidebarContext";
import useAsync from "@hooks/useAsync";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CategoryServices from "@services/CategoryServices";

const FeatureCategory = ({}) => {
  const router = useRouter();

  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomizationSetting, loading } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const { data, error } = useAsync(CategoryServices.getShowingCategory);

  const handleCategoryClick = (id, categoryName) => {
    const nameConvert = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${nameConvert}&_id=${id}`;
    router.push(url);
    setIsLoading(!isLoading);
  };

  // console.log("data", data);

  return (
    <>
      {loading ? (
        <CMSkeleton count={10} height={20} error={error} loading={loading} />
      ) : (
        // <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        //   {data[0]?.children
        //     ?.slice(0, storeCustomizationSetting?.home?.feature_product_limit)
        //     ?.map((category, i) => (
        //       <li className="group" key={i + 1}>
        //         <div className="flex w-full h-full border border-gray-100 shadow-sm bg-white p-4 cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-lg">
        //           <div className="flex items-center">
        // <div className="relative h-8 w-8">
        //   {category.icon ? (
        //     <Image
        //       src={category.icon}
        //       alt="category"
        //       width={35}
        //       height={35}
        //     />
        //   ) : (
        //     <Image
        //       src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
        //       alt="category"
        //       width={35}
        //       height={35}
        //     />
        //   )}
        // </div>

        //             <div className="pl-4">
        //               <h3
        // onClick={() =>
        //   handleCategoryClick(
        //     category._id,
        //     showingTranslateValue(category?.name)
        //   )
        // }
        //                 className="text-sm text-gray-600 font-serif font-medium leading-tight line-clamp-1  group-hover"
        //               >
        //                 {showingTranslateValue(category?.name)}
        //               </h3>

        //               <ul className="pt-1 mt-1">
        //                 {category?.children?.slice(0, 3).map((child) => (
        //                   <li key={child._id} className="pt-1">
        //                     <button
        //                       onClick={() =>
        //                         handleCategoryClick(
        //                           child._id,
        //                           showingTranslateValue(child?.name)
        //                         )
        //                       }
        //                       className="flex items-center font-serif text-xs text-gray-400 cursor-pointer"
        //                     >
        //                       <span className="text-xs text-gray-400">
        //                         <IoChevronForwardSharp />
        //                       </span>
        //                       {showingTranslateValue(child?.name)}
        //                     </button>
        //                   </li>
        //                 ))}
        //               </ul>
        //             </div>
        //           </div>
        //         </div>
        //       </li>
        //     ))}
        // </ul>

        <>
          <ul className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center -mx-1 gap-3">
            {data[0]?.children
              ?.slice(0, storeCustomizationSetting?.home?.feature_product_limit)
              ?.map((category, index) => (
                <li
                  className="shrink-0 p-2 bg-white rounded-md"
                  key={index + 1}
                >
                  <div
                    onClick={() =>
                      handleCategoryClick(
                        category._id,
                        showingTranslateValue(category?.name)
                      )
                    }
                    className="group flex transition py-3 xl:py-3.5 2xl:py-2.5 3xl:py-3 justify-between items-center px-3.5 2xl:px-4 text-brand-light shadow-category"
                    role="button"
                  >
                    <div className="flex items-center">
                      <div className="2xl:w-12 3xl:w-auto 2xl:h-12 3xl:h-auto w-9 h-9 inline-flex shrink-0">
                        {category.icon ? (
                          <img
                            src={category?.icon}
                            alt={showingTranslateValue(category?.name)}
                            className="w-full h-full"
                          />
                        ) : (
                          <img
                            src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                            alt={showingTranslateValue(category?.name)}
                            className="w-full h-full"
                          />
                        )}
                      </div>

                      <h3 className="text-15px text-brand-dark capitalize pl-3">
                        {showingTranslateValue(category?.name)}
                      </h3>
                    </div>

                    <div className="flex items-center transition-all transform group-hover:translate-x-1">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        className="text-base text-brand-dark text-opacity-40"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  );
};

export default FeatureCategory;
