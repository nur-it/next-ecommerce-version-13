import Discount from "@component/common/Discount";
import Price from "@component/common/Price";
import Stock from "@component/common/Stock";
import TagInput from "@component/common/TagInput";
import Tags from "@component/common/Tags";
import MainModal from "@component/modal/MainModal";
import Loading from "@component/preloader/Loading";
import RelatedProductCard from "@component/product/RelatedProductCard";
import ExtrasList from "@component/variants/ExtrasList";
import VariantList from "@component/variants/VariantList";
import { SidebarContext } from "@context/SidebarContext";
import useAddToCart from "@hooks/useAddToCart";
import ProductServices from "@services/ProductServices";
import { notifyError } from "@utils/toast";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import {
  IoChevronBackOutline,
  IoChevronForward,
  IoClose,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import RelatedCategory from "@component/category/RelatedCategory";
import ImageWithFallback from "@component/common/ImageWithFallBack";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const ProductModal = ({
  product,
  attributes,
  category,
  setCategory,
  modalOpen,
  setModalOpen,
  setRelatedProduct,
  storeSetting,
  globalSetting,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const extraCart = useSelector((state) => state.extraCart.extraCartItem);
  const { setIsLoading, isLoading } = useContext(SidebarContext);
  const { t } = useTranslation("ns1"); // default namespace (optional)
  const { handleAddItem, setItem, item } = useAddToCart();

  const { lang, showingTranslateValue, getNumber } = useUtilsFunction();
  const {
    // globalSetting,
    // storeSetting,
    storeCustomizationSetting,
  } = useGetSetting();

  // react hook
  const [image, setImage] = useState("");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPriceWithTax, setOriginalPriceWithTax] = useState(0);
  const [originalPriceWithoutTax, setOriginalPriceWithoutTax] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [volume, setVolume] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [unit, setUnit] = useState("ml");
  const [discount, setDiscount] = useState("");
  const [selectVariant, setSelectVariant] = useState({});
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectExtra, setSelectExtra] = useState([]);
  const [selectEx, setSelectEx] = useState([]);
  const [extrasTitle, setExtrasTitle] = useState([]);
  const [extras, setExtras] = useState([]);
  const [notes, setNotes] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (p, event) => {
    if (p.variants.length === 1 && p.variants[0].quantity < 1)
      return notifyError("Insufficient stock");

    if (stock <= 0) return notifyError("Insufficient stock");

    if (
      product?.variants.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      // const selectVariantTitle = variantTitle?.map((att) =>
      //   att.variants?.find((v) => v._id === selectVariant[att._id])
      // );

      const {
        // variants,
        slug,
        categories,
        description,
        relatedCategories,
        relatedProducts,

        ...newObj
      } = product;

      const newItem = {
        ...newObj,
        id: `${
          product.variants.length <= 1 &&
          product?.extras?.length < 1 &&
          product?.productType?.includes("others")
            ? product._id
            : product._id +
              variantTitle?.map((att) => selectVariant[att?._id]).join("-") +
              selectEx +
              notes
        }`,
        title: `${
          product.variants.length <= 1 && product?.extras?.length < 1
            ? showingTranslateValue(product.title)
            : showingTranslateValue(product.title) +
              "-" +
              variantTitle
                ?.map((att) =>
                  att.variants?.find((v) => v?._id === selectVariant[att?._id])
                )
                .map((el) => showingTranslateValue(el?.name))
        }`,
        variant: product.variants.length === 0 ? product.prices : selectVariant,
        price:
          product?.variants.length <= 0 && product?.extras?.length <= 0
            ? getNumber(product.prices.originalPriceWithTax)
            : getNumber(price),
        originalPriceWithTax:
          product?.variants.length <= 0 && product?.extras?.length <= 0
            ? getNumber(product.prices.originalPriceWithTax)
            : getNumber(originalPriceWithTax),
        originalPriceWithoutTax:
          product?.variants.length <= 0 && product?.extras?.length <= 0
            ? getNumber(product.prices.originalPriceWithoutTax)
            : getNumber(originalPriceWithoutTax),
        costPrice: getNumber(costPrice),
        notes: notes,
        extras: extraCart,
      };

      // console.log("newItem", newItem);

      handleAddItem(newItem);
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  const handleMoreInfo = (product, option) => {
    if (option === "relatedProduct") {
      setModalOpen(false);
      router.push(
        `/product/${product.slug}?_id=${product._id}?relatedProduct=${option}`
      );
      setIsLoading(!isLoading);
    } else {
      setModalOpen(false);
      router.push(`/product/${product.slug}?_id=${product._id}`);
      setIsLoading(!isLoading);
    }
  };

  const removeNote = (indexToRemove) => {
    setNotes([...notes.filter((_, index) => index !== indexToRemove)]);
  };

  const addNote = (event) => {
    if (event.target.value !== "") {
      setNotes([...notes, event.target.value]);
      setNotes([...notes, event.target.value]);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      const res = result?.map(
        ({
          price,
          costPrice,
          salePrice,
          discount,
          quantity,
          barcode,
          totalVolume,
          sku,
          inUse,
          inUseOrder,
          volume,
          unit,
          id,
          productId,
          image,
          originalPrice,
          impactOnPriceWithTax,
          impactOnPriceWithoutTax,
          originalPriceWithTax,
          originalPriceWithoutTax,
          ...rest
        }) => ({ ...rest })
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      const result2 = result?.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      if (result.length <= 0 || result2 === undefined) return setStock(0);

      // console.log("result2", result2);

      setVariants(result);
      // setNotAvailable(false);
      setSelectVariant(result2);
      setSelectVa(result2);
      setPrice(extrasPrice + Number(result2?.price));
      setOriginalPriceWithTax(
        extrasPrice + Number(result2?.originalPriceWithTax)
      );
      setOriginalPriceWithoutTax(
        extrasPrice + Number(result2?.originalPriceWithoutTax)
      );
      setCostPrice(result2.costPrice);
      setStock(result2?.quantity);
      setVolume(result2?.volume);
      setTotalVolume(result2?.totalVolume);
      setUnit(result2?.unit);
      setDiscount(Number(result2?.discount));
      setImage(result2?.image);
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );
      setVariants(result);
      setExtras(product?.extras);
      setPrice(Number(product.variants[0]?.price) + extrasPrice);
      setOriginalPriceWithTax(
        Number(product.variants[0]?.originalPriceWithTax) + extrasPrice
      );
      setOriginalPriceWithoutTax(
        Number(product.variants[0]?.originalPriceWithoutTax) + extrasPrice
      );
      setCostPrice(Number(product.variants[0]?.costPrice));
      setStock(product.variants[0]?.quantity);
      setVolume(product?.variants[0]?.volume);
      setTotalVolume(product?.variants[0]?.totalVolume);
      setUnit(product?.variants[0]?.unit);
      setDiscount(Number(product.variants[0]?.discount));
      setSelectVariant(product.variants[0]);
      setSelectVa(product.variants[0]);
      setImage(product.image[0]);
    } else {
      setExtras(product?.extras);
      setPrice(Number(product?.prices?.price) + extrasPrice);
      setOriginalPriceWithTax(
        Number(product?.prices?.originalPriceWithTax) + extrasPrice
      );
      setOriginalPriceWithoutTax(
        Number(product?.prices?.originalPriceWithoutTax) + extrasPrice
      );
      setCostPrice(product?.prices?.costPrice);
      setStock(product?.stock);
      setVolume(product?.measurement?.volume);
      setTotalVolume(product?.measurement?.totalVolume);
      setUnit(product?.measurement?.unit);
      setDiscount(Number(product?.prices?.discount));
      setImage(product.image[0]);
    }
  }, [
    extrasPrice,
    product?.extras,
    product?.measurement?.totalVolume,
    product?.measurement?.volume,
    product?.prices?.discount,
    product?.prices?.originalPriceWithTax,
    product?.prices?.originalPriceWithoutTax,
    product?.prices?.price,
    product?.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  useEffect(() => {
    const res = Object?.keys(Object?.assign({}, ...product?.variants));
    const res2 = Object?.keys(Object?.assign({}, ...(extras ? extras : [])));

    const varTitle = attributes?.filter((att) => res.includes(att?._id));
    const extraTitle = attributes?.filter((att) => res2?.includes(att?._id));

    setVariantTitle(varTitle?.sort());
    setExtrasTitle(extraTitle);
  }, [variants, attributes, extras]);

  useEffect(() => {
    if (!modalOpen) {
      setRelatedProducts([]);
      setRelatedProduct({});
      setCategory({});
    }

    if (product?.relatedProducts?.length > 0) {
      ProductServices.getRelatedProducts({
        ids: product?.relatedProducts,
        option: "product",
      })
        .then((res) => {
          setLoading(false);
          setRelatedProducts(res?.products);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err.message);
        });
    } else {
      setLoading(false);
    }
  }, [modalOpen, product?.relatedProducts]);

  const categoryName = product?.category?.name || category?.name;
  const categoryName1 =
    product?.category?.length !== 0 && product?.category[0]?.name;

  const category_name = showingTranslateValue(categoryName || categoryName1)
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-");

  return (
    <>
      <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div
          className={`inline-block overflow-y-auto h-full align-middle transition-all transform bg-white shadow-xl rounded-2xl xl:w-4/6 lg:w-11/12 w-full sm:p-2 md:p-6 lg:p-8`}
        >
          <div
            className={`flex flex-col lg:flex-row md:flex-row overflow-hidden`}
          >
            <Link href={`/product/${product.slug}?_id=${product._id}`} passHref>
              <Discount product={product} discount={discount} modal />
            </Link>
            <div
              className="flex justify-start mt-20"
              onClick={() => setModalOpen(false)}
            >
              <div className="relative w-44 h-32 py-2">
                {product.image[0] ? (
                  <ImageWithFallback src={product.image[0]} alt="product" />
                ) : (
                  <Image
                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    width={420}
                    height={420}
                    alt="product Image"
                  />
                )}
              </div>
            </div>

            <div className="w-full flex flex-col p-5 md:p-8 text-left">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <div className="flex justify-between">
                  <Link
                    href={`/product/${product.slug}?_id=${product._id}`}
                    passHref
                  >
                    <h1
                      onClick={() => setModalOpen(false)}
                      className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif hover:text-black cursor-pointer"
                    >
                      {showingTranslateValue(product?.title)}
                    </h1>
                  </Link>

                  <div className="absolute top-0 right-0">
                    <button
                      onClick={() => setModalOpen(false)}
                      type="button"
                      className="inline-flex justify-center px-2 py-2 text-3xl font-medium text-red-500 bg-white focus:outline-none"
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>
                <div
                  className={`${
                    stock <= 0 ? "relative py-1 mb-2" : "relative"
                  }`}
                >
                  <Stock
                    unit={unit}
                    stock={stock}
                    volume={volume}
                    totalVolume={totalVolume}
                  />
                </div>
              </div>

              <p className="text-sm leading-6 text-gray-500 md:leading-6">
                {showingTranslateValue(product?.description)}
              </p>

              <div className="flex items-center my-4">
                <Price
                  product={product}
                  price={price}
                  currency={globalSetting?.default_currency}
                />
              </div>

              <div className="mb-1">
                {extrasTitle?.map((a, i) => (
                  <span key={i + 1}>
                    <h4 className="text-base font-serif text-gray-700 py-1 font-semibold">
                      {showingTranslateValue(a?.name)} :
                    </h4>
                    <div className="flex flex-row mb-3">
                      <ExtrasList
                        att={a?._id}
                        lang={lang}
                        selectEx={selectEx}
                        dispatch={dispatch}
                        product={product}
                        extraTitle={extrasTitle}
                        extra={product?.extras}
                        setSelectEx={setSelectEx}
                        extrasPrice={extrasPrice}
                        setExtrasPrice={setExtrasPrice}
                        selectExtra={selectExtra}
                        setSelectExtra={setSelectExtra}
                        storeSetting={storeSetting}
                        currency={globalSetting?.default_currency}
                      />
                    </div>
                  </span>
                ))}
              </div>

              <div className="mb-1">
                {variantTitle?.map((a, i) => (
                  <span key={a?._id}>
                    <h4 className="text-base font-serif text-gray-700 py-1 font-semibold">
                      {showingTranslateValue(a?.name)} :
                    </h4>
                    <div className="mb-3">
                      <VariantList
                        att={a?._id}
                        lang={lang}
                        option={a.option}
                        setValue={setValue}
                        setImage={setImage}
                        setSelectVa={setSelectVa}
                        varTitle={variantTitle}
                        variants={product?.variants}
                        selectVariant={selectVariant}
                        setSelectVariant={setSelectVariant}
                      />
                    </div>
                  </span>
                ))}
              </div>

              {product?.allowNotesOnCheckout?.includes("store") && (
                <div className={`my-2 sm:w-full`}>
                  <TagInput
                    notes={notes}
                    addNote={addNote}
                    removeNote={removeNote}
                    tags={["Drink"]}
                  />
                </div>
              )}

              {storeSetting?.store_view === "hospitality" &&
                storeSetting?.menu_type === "eCommerce" && (
                  <div className="my-2 grid sm:grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="group col-span-1 flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-12 border-gray-300">
                      <button
                        onClick={() => setItem(item - 1)}
                        disabled={item === 1}
                        className="flex items-center justify-center cursor-pointer flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-8 text-heading border-gray-300 hover:text-gray-500"
                      >
                        <span className="text-dark text-xl">
                          <FiMinus />
                        </span>
                      </button>
                      <p className="font-semibold flex items-center justify-center h-full  transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-heading w-8 xl:w-24">
                        {item}
                      </p>
                      <button
                        onClick={() => setItem(item + 1)}
                        disabled={
                          product.quantity < item || product.quantity === item
                        }
                        className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-gray-300 hover:text-gray-500"
                      >
                        <span className="text-dark text-xl">
                          <FiPlus />
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.quantity < 1}
                      style={{
                        backgroundColor:
                          storeCustomizationSetting?.color?.bg_button?.hex,
                      }}
                      className={`bg-gray-800 hover:bg-gray-900 text-white  hover:text-white text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none h-12`}
                    >
                      {t("common:addToCart")}
                    </button>
                  </div>
                )}

              <div className="flex items-center mt-4">
                <div className="flex lg:flex-row flex-col lg:items-center md:items-start justify-between space-s-3 sm:space-s-4 w-full">
                  <div>
                    <span className="font-serif font-semibold py-1 text-sm d-block">
                      <span className="text-gray-700">
                        {" "}
                        {t("common:category")}:
                      </span>{" "}
                      <Link
                        href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                      >
                        <button
                          type="button"
                          className="text-gray-600 font-serif font-medium underline ml-2 hover:text-teal-600"
                          onClick={() => setIsLoading(!isLoading)}
                        >
                          {category_name}
                        </button>
                      </Link>
                    </span>
                    {JSON.parse(product?.tag)?.length > 0 && (
                      <div className="flex items-center mt-2">
                        <p className="font-serif font-semibold text-sm text-gray-700 capitalize">
                          {t("common:tags")} :
                        </p>
                        <Tags tags={JSON.parse(product?.tag)} />
                      </div>
                    )}
                  </div>

                  <div className="lg:mt-0 mt-3 lg:self-end md:self-start self-end">
                    <button
                      onClick={() => handleMoreInfo(product, "")}
                      className="font-sans font-medium text-sm text-orange-500"
                    >
                      {t("common:moreInfo")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product?.allowRelatedProductsAndCategories?.includes("store") && (
            <>
              {/* related product */}
              {relatedProducts?.length === 0 && !loading ? null : (
                <div className="p-4 mt-2">
                  <h3 className="text-left font-bold mb-3 text-lg">
                    {t("common:relatedProducts")}
                  </h3>

                  {/* <div className="flex"> */}
                  <div className="w-auto">
                    {loading ? (
                      <Loading loading={loading} />
                    ) : (
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
                            slidesPerView: 2,
                            spaceBetween: 10,
                          },
                          // when window width is >= 768px
                          660: {
                            width: 660,
                            slidesPerView: 3,
                            spaceBetween: 10,
                          },

                          // when window width is >= 768px
                          768: {
                            width: 768,
                            slidesPerView: 5,
                            spaceBetween: 10,
                          },

                          // when window width is >= 768px
                          991: {
                            width: 991,
                            slidesPerView: 6,
                            spaceBetween: 10,
                          },

                          // when window width is >= 768px
                          1140: {
                            width: 1140,
                            slidesPerView: 6,
                            spaceBetween: 10,
                          },
                          1680: {
                            width: 1680,
                            slidesPerView: 8,
                            spaceBetween: 10,
                          },
                          1920: {
                            width: 1920,
                            slidesPerView: 8,
                            spaceBetween: 10,
                          },
                        }}
                        modules={[Navigation]}
                        className="mySwiper related-product-slider"
                      >
                        {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-2 md:gap-3 lg:gap-3"></div> */}
                        {relatedProducts?.map((pro, index) => (
                          <SwiperSlide key={index + 1}>
                            <RelatedProductCard
                              key={index + 1}
                              rProduct
                              lang={lang}
                              product={pro}
                              setValue={setValue}
                              setCategory={setCategory}
                              storeSetting={storeSetting}
                              globalSetting={globalSetting}
                              setRelatedProduct={setRelatedProduct}
                            />
                          </SwiperSlide>
                        ))}
                        <button ref={prevRef} className="prev">
                          <IoChevronBackOutline />
                        </button>
                        <button ref={nextRef} className="next">
                          <IoChevronForward />
                        </button>
                      </Swiper>
                    )}
                  </div>
                  {/* </div> */}
                </div>
              )}

              {/* related categories */}
              {product?.relatedCategories?.length > 0 && !loading && (
                <div className="p-4 mt-1">
                  <h3 className="text-left font-bold mb-3 text-lg">
                    Related Categories
                  </h3>

                  <RelatedCategory
                    lang={lang}
                    categories={product?.relatedCategories}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </MainModal>
    </>
  );
};

export default ProductModal;
