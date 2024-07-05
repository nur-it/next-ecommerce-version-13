import Link from "next/link";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Banner = ({}) => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  return (
    <>
      <div className="flex justify-between items-center mob-banner">
        <div>
          <h3 className="font-serif text-xl">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.promotion_title
            )}
          </h3>

          <p className="text-gray-500">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.promotion_description
            )}
          </p>
        </div>
        <div className="shop-btn">
          <Link
            href={`${storeCustomizationSetting?.home?.promotion_button_link}`}
            style={{
              backgroundColor: storeCustomizationSetting?.color?.bg_button?.hex,
            }}
            className="bg-gray-800 text-white text-sm font-serif font-medium px-6 py-2 text-center rounded-full  hover:bg-emerald-700"
          >
            {showingTranslateValue(
              storeCustomizationSetting?.home?.promotion_button_name
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Banner;
