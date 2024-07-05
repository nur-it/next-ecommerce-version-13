import { useRef } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
// internal imports
import CMSkeleton from "@component/preloader/CMSkeleton";
import ProductCard from "./ProductCard";

const FutureProducts = ({
  error,
  loading,
  fProducts,
  attributes,
  storeSetting,
  globalSetting,
  storeCustomizationSetting,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <Swiper
      onInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }}
      loop={true}
      spaceBetween={8}
      //   slidesPerView={6}
      navigation={true}
      allowTouchMove={false}
      modules={[Navigation]}
      breakpoints={{
        320: {
          spaceBetween: 10,
          slidesPerView: 1,
        },
        375: {
          spaceBetween: 10,
          slidesPerView: 2,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 15,
        },
        1200: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
      }}
      //   className="mySwiper my-10"
    >
      {/* <div className="flex"> */}
      {/* <div className="w-full"> */}
      {loading ? (
        <CMSkeleton count={20} height={20} error={error} loading={loading} />
      ) : (
        <div>
          {fProducts
            ?.slice(0, storeCustomizationSetting?.home?.popular_product_limit)
            .map((product) => (
              <SwiperSlide key={product._id} className="group">
                <ProductCard
                  product={product}
                  attributes={attributes}
                  storeSetting={storeSetting}
                  globalSetting={globalSetting}
                />
              </SwiperSlide>
            ))}
        </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </Swiper>
  );
};

export default FutureProducts;
