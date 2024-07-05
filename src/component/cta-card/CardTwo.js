import Image from "next/image";
import Link from "next/link";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CardTwo = ({}) => {
  const { storeCustomizationSetting, error, loading } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <>
      <div className="w-full bg-white shadow-sm lg:px-10 lg:py-5 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div
            className={`${
              !storeCustomizationSetting?.home?.quick_delivery_img
                ? "w-full"
                : "lg:w-3/5 xl:pr-6 mob-w-full"
            } `}
          >
            <span className="text-base lg:text-lg">
              <CMSkeleton
                count={1}
                height={20}
                error={error}
                loading={loading}
                data={storeCustomizationSetting?.home?.quick_delivery_subtitle}
              />
            </span>
            <h2 className="font-serif text-lg lg:text-2xl font-bold mb-1">
              <CMSkeleton
                count={1}
                height={30}
                error={error}
                loading={loading}
                data={storeCustomizationSetting?.home?.quick_delivery_title}
              />
            </h2>
            <p className="text-sm font-sans leading-6">
              <CMSkeleton
                count={4}
                height={20}
                error={error}
                loading={loading}
                data={
                  storeCustomizationSetting?.home?.quick_delivery_description
                }
              />
            </p>
            <Link
              href={`${storeCustomizationSetting?.home?.quick_delivery_link}`}
              style={{
                backgroundColor:
                  storeCustomizationSetting?.color?.bg_button?.hex,
              }}
              className={`bg-gray-800 hover:bg-gray-900 text-white hover:text-white lg:w-1/3 text-xs font-serif font-medium inline-block mt-5 px-8 py-3 text-center rounded-full`}
              target="_blank"
            >
              {showingTranslateValue(
                storeCustomizationSetting?.home?.quick_delivery_button
              )}
            </Link>
          </div>

          <div className="w-1/5 flex-grow hidden lg:flex md:flex md:justify-items-center lg:justify-end">
            <Image
              width={373}
              height={250}
              priority
              alt="Quick Delivery to Your Home"
              className="block w-auto object-contain"
              src={
                storeCustomizationSetting?.home?.quick_delivery_img ||
                "/cta/delivery-boy.png"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardTwo;
