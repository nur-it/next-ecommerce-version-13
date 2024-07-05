import { SidebarContext } from "@context/SidebarContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useRef } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

//internal import
import useUtilsFunction from "@hooks/useUtilsFunction";

const RelatedCategory = ({ categories }) => {
  const router = useRouter();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { isLoading, setIsLoading } = useContext(SidebarContext);

  const { lang, showingTranslateValue } = useUtilsFunction();

  const handleCategoryClick = (id, category) => {
    const categoryName = Object?.keys(category).includes(lang)
      ? category[lang]
      : category.en;

    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");

    router.push(`/search?category=${category_name}&_id=${id}`);
    setIsLoading(!isLoading);
  };

  return (
    <>
      <Swiper
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        spaceBetween={8}
        navigation={true}
        allowTouchMove={false}
        breakpoints={{
          // when window width is >= 640px
          375: {
            width: 375,
            slidesPerView: 2,
            spaceBetween: 10,
          },
          // when window width is >= 768px
          414: {
            width: 414,
            slidesPerView: 3,
            spaceBetween: 10,
          },
          // when window width is >= 768px
          660: {
            width: 660,
            slidesPerView: 4,
            spaceBetween: 10,
          },

          // when window width is >= 768px
          768: {
            width: 768,
            slidesPerView: 6,
            spaceBetween: 10,
          },

          // when window width is >= 768px
          991: {
            width: 991,
            slidesPerView: 8,
            spaceBetween: 10,
          },

          // when window width is >= 768px
          1140: {
            width: 1140,
            slidesPerView: 9,
            spaceBetween: 10,
          },
          1680: {
            width: 1680,
            slidesPerView: 10,
            spaceBetween: 10,
          },
          1920: {
            width: 1920,
            slidesPerView: 10,
            spaceBetween: 10,
          },
        }}
        modules={[Navigation]}
        className="mySwiper category-slider"
      >
        {
          <div>
            {categories?.map((category, i) => (
              <SwiperSlide key={i + 1} className="group">
                <div
                  onClick={() =>
                    handleCategoryClick(category?._id, category.name)
                  }
                  className="text-center cursor-pointer p-3 bg-white rounded-lg border"
                >
                  <div className="bg-white p-2 mx-auto w-10 h-10 rounded-full shadow-md">
                    {category?.icon ? (
                      <Image
                        src={category?.icon}
                        alt="category"
                        width="35"
                        height="35"
                      />
                    ) : (
                      <Image
                        src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                        alt="category"
                        width="35"
                        height="35"
                      />
                    )}
                  </div>

                  <h3 className="text-xs text-gray-600 mt-2 font-serif group-hover:text-emerald-500">
                    {showingTranslateValue(category?.name)}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </div>
        }
        <button ref={prevRef} className="prev">
          <IoChevronBackOutline />
        </button>
        <button ref={nextRef} className="next">
          <IoChevronForward />
        </button>
      </Swiper>
    </>
  );
};

export default RelatedCategory;
