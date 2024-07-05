import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
//internal import
import Banner from "@component/banner/Banner";
import MainCarousel from "@component/carousel/MainCarousel";
import StickyCart from "@component/cart/StickyCart";
import FeatureCategory from "@component/category/FeatureCategory";
import CardTwo from "@component/cta-card/CardTwo";
import OfferCard from "@component/offer/OfferCard";
import CMSkeleton from "@component/preloader/CMSkeleton";
import Loading from "@component/preloader/Loading";
import FutureProducts from "@component/product/FutureProducts";
import ProductCard from "@component/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import useAsync from "@hooks/useAsync";
import useGetSetting from "@hooks/useGetSetting";
import Layout from "@layout/Layout";
import AttributeServices from "@services/AttributeServices";
import CouponServices from "@services/CouponServices";
import ProductServices from "@services/ProductServices";

const Home = ({
  cookies,
  attributes,
  featureProducts,
  popularProducts,
  discountProducts,
}) => {
  const router = useRouter();

  const { isLoading, setIsLoading } = useContext(SidebarContext);

  const {
    loading,
    error,
    globalSetting,
    storeSetting,
    storeCustomizationSetting,
  } = useGetSetting();

  // console.log("storeCustomizationSetting", storeCustomizationSetting);
  // console.log(
  //   "class",
  //   `bg-${
  //     storeCustomizationSetting?.color?.bg_quick_delivery?.class || "gray-800"
  //   } lg:p-16 p-6 shadow-sm border rounded-lg`
  // );

  // react hook
  const [pProducts, setPProducts] = useState([]);
  const [fProducts, setFProducts] = useState([]);
  const [dProducts, setDProducts] = useState([]);
  const [showCouponBox, setShowCouponBox] = useState(false);

  const { data: couponCodes } = useAsync(CouponServices.getShowingCoupons);

  useEffect(() => {
    const masterProduct = popularProducts?.filter(
      (product) =>
        (product.masterProduct.length !== 0 &&
          product.isMasterProduct === false) ||
        product.isMasterProduct === true
    );
    setPProducts(masterProduct);

    const masterProduct2 = discountProducts?.filter(
      (product) =>
        (product.masterProduct.length !== 0 &&
          product.isMasterProduct === false) ||
        product.isMasterProduct === true
    );
    setDProducts(masterProduct2);

    const masterProduct3 = featureProducts?.filter(
      (product) =>
        (product.masterProduct.length !== 0 &&
          product.isMasterProduct === false) ||
        product.isMasterProduct === true
    );
    setFProducts(masterProduct3);
  }, [popularProducts, discountProducts]);

  useEffect(() => {
    if (Object.entries(cookies).length === 0 || !cookies._cname) {
      window.location.reload();
    }

    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    for (let c of couponCodes) {
      if (!dayjs().isAfter(dayjs(c.endTime))) {
        setShowCouponBox(true);
        break;
      }
    }
  }, [couponCodes]);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            <StickyCart />
            <div
              style={{
                backgroundColor:
                  storeCustomizationSetting?.color?.bg_slider?.hex,
              }}
              className="bg-white"
            >
              <div className="mx-auto py-5 max-w-screen-2xl px-3 sm:px-10">
                <div className="flex w-full">
                  <div
                    className={`${
                      storeCustomizationSetting?.home?.slider_width_status ||
                      !showCouponBox
                        ? "w-full flex"
                        : "w-3/5 xl:pr-6 md:pr-6 mob-w-full"
                    } `}
                  >
                    <MainCarousel
                      storeCustomizationSetting={storeCustomizationSetting}
                    />
                  </div>

                  {!storeCustomizationSetting?.home?.slider_width_status &&
                    showCouponBox && (
                      <div className="w-full hidden lg:flex">
                        {storeCustomizationSetting?.home?.coupon_status ? (
                          <OfferCard />
                        ) : (
                          <div className="w-full max-h-full">
                            <Image
                              width={580}
                              height={358}
                              className="w-full h-fit"
                              src={
                                storeCustomizationSetting?.home
                                  ?.place_holder_img ||
                                "/place-holder/place-holder.png"
                              }
                              alt="place-holder"
                            />
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {storeCustomizationSetting?.home?.promotion_banner_status && (
                  <div className="bg-orange-100 px-10 py-6 rounded-lg mt-6">
                    <Banner />
                  </div>
                )}
              </div>
            </div>

            {/* feature category's */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div
                style={{
                  backgroundColor:
                    storeCustomizationSetting?.color?.bg_feature_category?.hex,
                }}
                className={`bg-gray-100 lg:py-16 py-10`}
              >
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          // error={error}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.feature_title}
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={4}
                          height={10}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home?.feature_description
                          }
                        />
                      </p>
                    </div>
                  </div>

                  <FeatureCategory />
                </div>
              </div>
            )}

            {/* future products */}
            {fProducts.length !== 0 && (
              <div
                style={{
                  background:
                    storeCustomizationSetting?.color?.bg_popular_product?.hex,
                }}
                className={`bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10`}
              >
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      Future Products for Daily Shopping
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      See all our Future products in this week. You can choose
                      your daily needs products from this list and get some
                      special offer with free shipping.
                    </p>
                  </div>
                </div>

                <FutureProducts
                  error={error}
                  loading={loading}
                  fProducts={fProducts}
                  attributes={attributes}
                  storeSetting={storeSetting}
                  globalSetting={globalSetting}
                  storeCustomizationSetting={storeCustomizationSetting}
                />

                {/* <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {fProducts
                          ?.slice(
                            0,
                            storeCustomizationSetting?.home
                              ?.popular_product_limit
                          )
                          .map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              attributes={attributes}
                              storeSetting={storeSetting}
                              globalSetting={globalSetting}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            )}

            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div
                style={{
                  background:
                    storeCustomizationSetting?.color?.bg_popular_product?.hex,
                }}
                className={`bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10`}
              >
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        // error={error}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.popular_title}
                      />
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={10}
                        error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.popular_description
                        }
                      />
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {pProducts
                          ?.slice(
                            0,
                            storeCustomizationSetting?.home
                              ?.popular_product_limit
                          )
                          .map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              attributes={attributes}
                              storeSetting={storeSetting}
                              globalSetting={globalSetting}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* promotional banner card */}
            {storeCustomizationSetting?.home?.delivery_status && (
              <div className="block mx-auto max-w-screen-2xl">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
                  <div
                    style={{
                      backgroundColor:
                        storeCustomizationSetting?.color?.bg_quick_delivery
                          ?.hex,
                    }}
                    className="bg-gray-800 lg:p-16 p-6 shadow-sm border rounded-lg"
                  >
                    <CardTwo />
                  </div>
                </div>
              </div>
            )}

            {/* discounted products */}
            {storeCustomizationSetting?.home?.discount_product_status && (
              <div
                id="discount"
                style={{
                  backgroundColor:
                    storeCustomizationSetting?.color?.bg_discount_product?.hex,
                }}
                className={`gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10`}
              >
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.latest_discount_title
                        }
                      />
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={20}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home
                            ?.latest_discount_description
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {loading ? (
                    <CMSkeleton
                      count={20}
                      height={20}
                      error={error}
                      loading={loading}
                    />
                  ) : (
                    <div className="w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {dProducts
                          ?.slice(
                            0,
                            storeCustomizationSetting?.home
                              ?.latest_discount_product_limit
                          )
                          .map((product, i) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              attributes={attributes}
                              storeSetting={storeSetting}
                              globalSetting={globalSetting}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  // console.log("cookies", cookies);

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      cname: cookies._cname,
      category: _id ? _id : "",
      title: query ? query : "",
      limit: 18,
      sort: "",
    }),
    AttributeServices.getShowingAttributes({
      cname: cookies._cname,
    }),
  ]);

  return {
    props: {
      cookies: cookies,
      attributes: attributes,
      featureProducts: data?.featureProducts,
      popularProducts: data?.products || [],
      discountProducts: data?.discountedProducts || [],
    },
  };
};

export default Home;
