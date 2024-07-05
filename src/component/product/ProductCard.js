import Image from "next/image";
import { useEffect, useState } from "react";
import { IoAdd, IoBagAddSharp, IoRemove } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useCart } from "react-use-cart";

//internal import
import Discount from "@component/common/Discount";
import Price from "@component/common/Price";
import Stock from "@component/common/Stock";
import ProductModal from "@component/modal/ProductModal";
import useAddToCart from "@hooks/useAddToCart";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { clearExtraCart } from "@redux/slice/extraCart";
import { notifyError } from "@utils/toast";
import ImageWithFallback from "@component/common/ImageWithFallBack";

const ProductCard = ({ product, attributes, storeSetting, globalSetting }) => {
  const dispatch = useDispatch();
  // custom hook
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { lang, showingTranslateValue } = useUtilsFunction();

  // react hook
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState({});
  const [category, setCategory] = useState({});

  const roundedRating =
    product?.review && Math.round(product?.review?.avg * 10) / 10;
  const starRating = roundedRating?.toString().split(".")[0];
  const halfStarRating = roundedRating - starRating;
  const emptyStarArrLength = halfStarRating === 0 ? 5 : 4;

  let fillStarArr = Array.from(
    { length: starRating || 0 },
    (_, index) => index
  );
  let emptyStarArr = Array.from(
    { length: emptyStarArrLength - starRating },
    (_, index) => index
  );

  // handle add to cart
  const handleAddItem = (p, event) => {
    dispatch(clearExtraCart());

    if (p.stock < 1) return notifyError("Insufficient stock");

    if (p?.variants?.length > 0 || p?.extras?.length > 0) {
      setModalOpen(!modalOpen);
      setCategory(product?.category);
      console.log("p.variants.length", p.variants.length);
      return;
    }

    const newItem = {
      ...p,
      title: Object.keys(p.title).includes(lang) ? p.title[lang] : p.title.en,
      id: p._id,
      variant: Number(p.prices),
      price: Number(p.prices.originalPriceWithoutTax),
      originalPriceWithTax: Number(product.prices?.originalPriceWithTax),
      originalPriceWithoutTax: Number(product.prices?.originalPriceWithoutTax),
    };

    addItem(newItem);
  };

  // handle modal open
  const handleModalOpen = (event, product) => {
    setCategory(product.category);
    setModalOpen(event);
    dispatch(clearExtraCart());
  };

  useEffect(() => {
    if (!modalOpen) {
      setRelatedProduct({});
      setCategory({});
    }
  }, [modalOpen]);

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={
            Object?.keys(relatedProduct)?.length > 1 ? relatedProduct : product
          }
          mainProduct={product}
          attributes={attributes}
          relatedProduct={relatedProduct}
          category={category}
          setCategory={setCategory}
          setRelatedProduct={setRelatedProduct}
          storeSetting={storeSetting}
          globalSetting={globalSetting}
        />
      )}

      <div className="group box-border overflow-hidden flex rounded-md shadow-sm pe-0 flex-col items-center bg-white relative">
        <div className="w-full flex justify-between">
          <Stock
            card
            product={product}
            stock={product.stock}
            storeSetting={storeSetting}
          />
          <Discount product={product} />
        </div>

        <div
          onClick={() => handleModalOpen(!modalOpen, product)}
          className="relative flex justify-center cursor-pointer pt-2 w-full h-32"
        >
          <div className="relative w-full h-full p-2">
            {product.image[0] ? (
              <ImageWithFallback src={product.image[0]} alt="product" />
            ) : (
              <Image
                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                fill
                style={{
                  objectFit: "contain",
                }}
                sizes="100%"
                alt="product"
                priority
                className="object-contain transition duration-150 ease-linear transform group-hover:scale-105"
              />
            )}
          </div>
        </div>

        <div className="w-full px-3 pb-2 overflow-hidden">
          <div className="relative mb-1">
            <span className="text-gray-400 font-medium text-xs d-block mb-1">
              {product.unit}
            </span>
            <h2 className="text-heading truncate mb-0 block text-sm font-medium text-gray-600">
              <span className="line-clamp-2">
                {showingTranslateValue(product?.title)}
              </span>
            </h2>
          </div>

          <div className="flex justify-between items-center text-heading text-sm sm:text-base space-s-2 md:text-base lg:text-xl">
            <Price
              card
              product={product}
              currency={globalSetting?.default_currency}
              price={product?.prices?.originalPriceWithoutTax}
            />

            {inCart(product._id) ? (
              <div>
                {items.map(
                  (item) =>
                    item.id === product._id && (
                      <div
                        key={item.id}
                        className="h-9 w-auto flex flex-wrap items-center justify-evenly py-1 px-2 bg-gray-800 text-white rounded"
                      >
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <span className="text-dark text-base">
                            <IoRemove />
                          </span>
                        </button>
                        <p className="text-sm text-dark px-1 font-serif font-semibold">
                          {item.quantity}
                        </p>
                        <button onClick={() => handleIncreaseQuantity(item)}>
                          <span className="text-dark text-base">
                            <IoAdd />
                          </span>
                        </button>
                      </div>
                    )
                )}{" "}
              </div>
            ) : (
              <button
                onClick={(e) => handleAddItem(product, e)}
                aria-label="cart"
                className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded text-emerald-500 hover:border-emerald-500 hover:bg-gray-800 hover:text-white transition-all"
              >
                <span className="text-xl">
                  <IoBagAddSharp />
                </span>{" "}
              </button>
            )}
          </div>

          {product?.review?.count !== 0 && (
            <div className="flex items-center gap-1">
              {fillStarArr?.map((item) => (
                <Image
                  key={item + 1}
                  src="/product-details/star.png"
                  alt="star"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              ))}

              {halfStarRating !== 0 && (
                <Image
                  src="/product-details/half-star.png"
                  alt="half-star"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              )}

              {emptyStarArr?.map((item) => (
                <Image
                  key={item + 1}
                  src="/product-details/empty-star.png"
                  alt="emptyStar"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              ))}
              <span className="text-sm text-gray-500">
                ({product?.review?.count})
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
