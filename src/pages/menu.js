import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiList,
} from "react-icons/fi";
import { Element, Link } from "react-scroll";
// internal imports
import FeaturedCard from "@component/menu/FeaturedCard";
import MenuCard from "@component/menu/MenuCard";
import ProductCard from "@component/menu/ProductCard";
import ProductCard2 from "@component/menu/ProductCard2";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Layout from "@layout/Layout";
import AttributeServices from "@services/AttributeServices";
import ProductServices from "@services/ProductServices";
import { arrayMoveImmutable } from "@utils/arrayMove";

const Menu = ({
  cookies,
  attributes,
  featureProducts,
  categoriesWithProducts,
}) => {
  // custom hook
  const { showingTranslateValue } = useUtilsFunction();
  const { lang, globalSetting, storeSetting, storeCustomizationSetting } =
    useGetSetting();

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const scrollRef = useRef(null);

  const mostLikeMenu = useRef(null);
  const featuredItemRef = useRef(null);

  // react hook
  const [show, setShow] = useState(false);
  const [toggle, setToggle] = useState("Pickup");
  const [categoryList, setCategoryList] = useState([]);
  const [hasScrollBar, setHasScrollBar] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [categoryWithProducts, setCategoryWithProducts] = useState([]);
  // date time
  const openDate = dayjs(`1970-01-01T${storeSetting?.open_hour}:00`);
  const closeDate = dayjs(`1970-01-01T${storeSetting?.close_hour}:00`);

  const handleSorting = (oldIndex, newIndex) => {
    setCategoryList((array) => arrayMoveImmutable(array, oldIndex, newIndex));

    setCategoryWithProducts((array) =>
      arrayMoveImmutable(array, oldIndex, newIndex)
    );
  };

  const scrollRight = (type) => {
    if (type === "featured") {
      featuredItemRef.current.scrollLeft += 400;
    } else if (type === "scrollMenu") {
      menuRef.current.scrollLeft += 100;
    } else {
      mostLikeMenu.current.scrollLeft += 400;
    }
  };

  const scrollLeft = (type) => {
    if (type === "featured") {
      featuredItemRef.current.scrollLeft -= 400;
    } else if (type === "scrollMenu") {
      menuRef.current.scrollLeft -= 100; // Corrected line
    } else {
      mostLikeMenu.current.scrollLeft -= 400;
    }
  };

  // handle nav scroll left to right and right to left
  const handleNav = (direction) => {
    if (direction === "left") {
      navRef ? (navRef.current.scrollLeft -= 200) : null;
    } else {
      navRef ? (navRef.current.scrollLeft += 200) : null;
    }
  };

  // handle dropdown menu show
  const handleNavDropdown = () => {
    setShowNavDropdown(!showNavDropdown);
  };

  useEffect(() => {
    function updateState() {
      const el = navRef.current;
      el && setHasScrollBar(el.scrollWidth > el.getBoundingClientRect().width);
    }

    updateState();

    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, []);

  useEffect(() => {
    if (Object.entries(cookies).length === 0 || !cookies._cname) {
      let cname;
      let host = window.location.host;
      cname = host.split(".")[0]; // get the subdomain from the domain

      Cookies.set("_cname", cname, {
        sameSite: "None",
        secure: true,
      });
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const menuDropdown = scrollRef.current.offsetTop < window.pageYOffset;

        if (menuDropdown) {
          setShowMenuDropdown(menuDropdown);
        } else {
          setShowMenuDropdown(menuDropdown);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, showMenuDropdown]);

  useEffect(() => {
    if (categoriesWithProducts?.length > 0) {
      const existCategoryProduct = categoriesWithProducts.map((item) => {
        const newObj = {
          _id: item?._id,
          name: item?.name,
        };
        return newObj;
      });

      setCategoryList(existCategoryProduct);
      setCategoryWithProducts(categoriesWithProducts);
    }
  }, [categoriesWithProducts]);

  return (
    <Layout title="Menu" description="This is menu us page">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        {/* banner image */}
        <div className="py-5">
          <img
            src="https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=2000,height=720,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/12741.jpg"
            alt=""
            className="w-full object-cover lg:h-96 h-auto rounded-lg"
          />
        </div>

        {/* title, address & time */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            {showingTranslateValue(globalSetting?.shop_name, lang)}
          </h1>
          <br />
          <div className="text-gray-500 flex flex-col mt-1">
            <span className="text-base font-medium">
              {showingTranslateValue(globalSetting?.address_one, lang)},{" "}
              {showingTranslateValue(globalSetting?.address_two, lang)},{" "}
              {showingTranslateValue(globalSetting?.address_three, lang)}
            </span>
            <span className="text-base font-medium">
              Open Hours: {openDate.format("h:mm A")} -
              {closeDate.format("h:mm A")}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-300 pb-2">
          {/* delivery address and time */}
          <div className="flex md:flex-row flex-col justify-between md:items-center items-start my-4">
            {toggle === "Pickup" ? (
              <div className="border border-gray-300 rounded-md md:w-80 w-72 max-w-xs py-2 text-center">
                <h5 className="text-base font-semibold text-gray-900">
                  Ready by 10:40 AM
                </h5>
                <p className="text-sm font-normal text-gray-400">
                  schedule at checkout
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-1 border border-gray-300 rounded-md md:w-80 w-72 max-w-xs p-2 text-center">
                <div className="flex-1 border-r border-gray-300">
                  <h5 className="text-base font-semibold text-gray-900">
                    $3.99
                  </h5>
                  <span className="text-sm font-normal text-gray-400">
                    delivery fee
                  </span>
                </div>

                <div className="flex-1 bg-red-700 text-white rounded-lg py-1">
                  <h5 className="text-base font-semibold">Unavailable</h5>
                  <div className="dropdown">
                    <p className="flex items-center justify-center gap-2">
                      <span className="text-sm font-normal">Too far away </span>
                      <span>
                        <FiAlertCircle />
                      </span>
                    </p>

                    <div className="border border-gray-200 rounded-md dropdown-content -left-7 mt-3 p-2 w-60 min-w-min">
                      <p className="text-sm font-medium text-gray-800">
                        Your address is not in this store's delivery area
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-200 rounded-full md:mt-2 mt-4">
              <button
                type="button"
                onClick={() => setToggle("Delivery")}
                className={`${
                  toggle === "Delivery"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-transparent text-gray-900"
                } px-4 py-2 text-sm font-bold rounded-full`}
              >
                Delivery
              </button>

              <button
                type="button"
                onClick={() => setToggle("Pickup")}
                className={`${
                  toggle === "Pickup"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-transparent text-gray-900"
                } px-4 py-2 text-sm font-bold  rounded-full`}
              >
                Pickup
              </button>
            </div>
          </div>

          {/* user delivery address show */}
          {toggle === "Delivery" && (
            <div
              className="p-5 flex flex-col items-center my-3"
              style={{ backgroundColor: "rgb(234, 243, 245)" }}
            >
              <h4 className="text-base font-semibold tracking-wide text-gray-900">
                You're out of range
              </h4>
              <span className="my-4 text-sm font-medium tracking-wide text-gray-900 md:text-left text-center">
                This restaurant can't be delivered to Panthapath Signal,
                Panthapath, Signal, গ্রীন রোড, ঢাকা 1205, Bangladesh.
              </span>
              <button
                type="button"
                className="bg-white text-sm font-bold tracking-wide px-5 py-2 rounded-full shadow-xl hover:bg-gray-100 transition ease-linear delay-75"
              >
                Change Address
              </button>
            </div>
          )}
        </div>

        {/* Featured Items */}
        {featureProducts?.length !== 0 && (
          <div className="my-3 py-3">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-wide">
                Featured Items
              </h3>

              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => scrollLeft("featured")}
                  className="text-base bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition ease-out duration-200"
                >
                  <FiChevronLeft className="text-gray-900 text-lg font-bold" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRight("featured")}
                  className="text-base bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition ease-out duration-200"
                >
                  <FiChevronRight className="text-gray-900 text-lg font-bold" />
                </button>
              </div>
            </div>

            <div
              ref={featuredItemRef}
              className="flex flex-row w-full overflow-scroll scrollbar-hide scroll-smooth whitespace-nowrap gap-3 my-3"
            >
              {featureProducts?.map((product) => (
                <FeaturedCard
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

        {/* filtering menu & filtering data */}
        <div>
          <div className="relative">
            <div>
              <button
                className="flex items-center gap-1"
                onClick={() => setShow(!show)}
              >
                <h5 className="text-gray-900 text-base font-semibold tracking-wide">
                  All day
                </h5>

                <span>
                  <FiChevronDown className="text-gray-900 text-lg" />
                </span>
              </button>
              <span className="text-gray-500 text-sm font-medium">
                10:00 am - 2:40 pm
              </span>
            </div>
          </div>

          {/* menu */}
          <div className="sticky z-10 w-full h-auto max-w-full bg-gray-50 flex flex-row items-center gap-4 my-4 pt-2 border-b border-gray-300 lg:top-[124px] top-12">
            <div className="flex items-center">
              <button onClick={() => handleNavDropdown()} type="button">
                <FiList className="text-gray-900 text-lg" />
              </button>
            </div>

            {!showNavDropdown && (
              <>
                {hasScrollBar && (
                  <button onClick={() => handleNav("left")} type="button">
                    <FiChevronLeft className="text-xl" />
                  </button>
                )}

                <MenuCard
                  navRef={navRef}
                  categoryList={categoryList}
                  handleSorting={handleSorting}
                />

                {hasScrollBar && (
                  <button onClick={() => handleNav("right")} type="button">
                    <FiChevronRight className="text-xl" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* menu dropdown show */}
          {showMenuDropdown && (
            <div className="sticky w-[200px] z-10 h-auto top-[163px] left-0">
              {showNavDropdown && (
                <div className="md:relative flex flex-col absolute left-0 -top-3 bg-white w-[200px] rounded">
                  {categoryList?.map((category, index) => (
                    <div className="p-4">
                      <Link
                        activeClass="border-b-4 border-gray-800"
                        key={index + 1}
                        spy={true}
                        smooth={true}
                        duration={250}
                        offset={-220}
                        to={`${category._id}-${index + 1}`}
                        className="hover:border-b-4 hover:border-gray-800 transition duration-100 ease-linear"
                      >
                        <button
                          type="button"
                          key={category._id}
                          className={`text-sm font-medium text-gray-700  text-left rounded-t`}
                        >
                          {showingTranslateValue(category?.name)}
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="">
            <div
              ref={scrollRef}
              className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-1"
            >
              {/* menu dropdown show */}
              <div>
                {!showMenuDropdown && (
                  <>
                    {showNavDropdown && (
                      <div className="md:relative flex flex-col absolute left-0 -top-3 bg-white w-[200px] rounded">
                        {categoryList?.map((category, index) => (
                          <div className="p-4">
                            <Link
                              activeClass="border-b-4 border-gray-800"
                              key={index + 1}
                              spy={true}
                              smooth={true}
                              duration={250}
                              offset={-220}
                              to={`${category._id}-${index + 1}`}
                              className="hover:border-b-4 hover:border-gray-800 transition duration-100 ease-linear"
                            >
                              <button
                                key={category._id}
                                type="button"
                                className={`text-sm font-medium text-gray-700 rounded-t text-left`}
                              >
                                {showingTranslateValue(category?.name)}
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                className={`${
                  showNavDropdown
                    ? "xl:col-span-4 lg:col-span-3 md:col-span-2"
                    : "xl:col-span-5 lg:col-span-4 md:col-span-3"
                }`}
              >
                {categoryWithProducts?.map((category, index) => (
                  <div
                    key={category?._id}
                    className="scrollMenu mb-5"
                    id={`${category?._id}-${index + 1}`}
                  >
                    <div className="py-5">
                      <h3 className="text-xl font-bold tracking-wide">
                        {showingTranslateValue(category?.name) ===
                        "Popular Items" ? (
                          <span>
                            Most Liked Food Items
                            <p className="text-sm font-medium text-gray-500 tracking-wide">
                              The most commonly ordered food items and dishes
                              from this store
                            </p>
                          </span>
                        ) : (
                          showingTranslateValue(category?.name)
                        )}
                      </h3>
                    </div>

                    {showNavDropdown ? (
                      <Element name={`${category?._id}-${index + 1}`}>
                        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                          {category?.products?.map((product) => (
                            <ProductCard2
                              key={product._id}
                              product={product}
                              attributes={attributes}
                              storeSetting={storeSetting}
                              categoryName={category.name}
                              globalSetting={globalSetting}
                              storeCustomizationSetting={
                                storeCustomizationSetting
                              }
                            />
                          ))}
                        </div>
                      </Element>
                    ) : (
                      <Element name={`${category?._id}-${index + 1}`}>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                          {category?.products?.map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              attributes={attributes}
                              storeSetting={storeSetting}
                              categoryName={category.name}
                              globalSetting={globalSetting}
                              storeCustomizationSetting={
                                storeCustomizationSetting
                              }
                            />
                          ))}
                        </div>
                      </Element>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;

  // console.log("cookies have");
  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProductsAndCategory({
      cname: cookies._cname,
    }),

    AttributeServices.getShowingAttributes({
      cname: cookies._cname,
    }),
    // CategoryServices.getShowingStoreCategory,
  ]);

  return {
    props: {
      cookies,
      attributes,
      featureProducts: data?.featureProducts,
      categoriesWithProducts: data?.categoriesWithProducts,
    },
  };
};

export default Menu;
