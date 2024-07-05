import Image from "next/image";
import { IoAdd, IoBagAddSharp, IoRemove } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useCart } from "react-use-cart";

//internal import

import Discount from "@component/common/Discount";
import Price from "@component/common/Price";
import Stock from "@component/common/Stock";
import useAddToCart from "@hooks/useAddToCart";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { clearExtraCart } from "@redux/slice/extraCart";
import { notifyError } from "@utils/toast";
import ImageWithFallback from "@component/common/ImageWithFallBack";

const RelatedProductCard = ({
  lang,
  product,
  rProduct,
  setValue,
  setCategory,
  storeSetting,
  globalSetting,
  setRelatedProduct,
}) => {
  const dispatch = useDispatch();
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { showingTranslateValue } = useUtilsFunction();

  const handleAddItem = (p, event) => {
    dispatch(clearExtraCart());

    if (p.stock < 1) return notifyError("Insufficient stock");

    if (p.variants.length > 1 || p.extras.length > 1) {
      setValue("");
      setCategory(p?.category);
      setRelatedProduct(p);
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

  return (
    <>
      {/* <div className="group box-border border overflow-hidden flex rounded-md shadow-sm pe-0 flex-col items-center bg-white relative">
        <div
          onClick={() => {
            setValue("");
            setCategory(product?.category);
            setRelatedProduct(product);
          }}
          className="relative flex justify-center w-full cursor-pointer pt-2"
        >
          <div className="left-3">
            <Stock
              card
              product={product}
              stock={product.stock}
              storeSetting={storeSetting}
            />
          </div>

          <Discount product={product} />

          {product.image[0] ? (
            <Image
              src={product.image[0]}
              width={210}
              height={210}
              alt="product"
              className="object-contain transition duration-150 ease-linear transform group-hover:scale-105 RMK"
            />
          ) : (
            <Image
              src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              width={210}
              height={210}
              alt="product"
              className="object-cover transition duration-150 ease-linear transform group-hover:scale-105"
            />
          )}
        </div>
        <div className="w-full px-3 lg:px-4 pb-4 overflow-hidden">
          <div className="relative mb-1">
            <span className="text-gray-400 font-medium text-xs d-block mb-1">
              {product.unit}
            </span>
            <h2 className="text-heading text-justify truncate mb-0 block text-sm font-medium text-gray-600">
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
                        className="h-9 w-auto flex flex-wrap items-center justify-evenly py-1 px-1 bg-gray-800 text-white rounded"
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
                        <button
                          className="text-white"
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          <span className="text-dark text-base">
                            <IoAdd className="text-white text-lg" />
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
                {" "}
                <span className="text-xl">
                  <IoBagAddSharp />
                </span>{" "}
              </button>
            )}
          </div>
        </div>
      </div> */}

      <div
        role="button"
        onClick={() => {
          setValue("");
          setCategory(product?.category);
          setRelatedProduct(product);
        }}
        className="group box-border overflow-hidden flex rounded-md shadow-sm pe-0 flex-col items-center bg-white relative border border-gray-300"
      >
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
          className={`relative flex justify-center items-center cursor-pointer w-full ${
            rProduct ? "h-32" : "h-44"
          }`}
        >
          <div
            className={`relative ${
              rProduct ? "w-40 h-32" : "w-full h-full"
            } p-2`}
          >
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

        <div className="w-full p-1 px-2 overflow-hidden">
          <div className="relative mb-1 text-left">
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
                {" "}
                <span className="text-xl">
                  <IoBagAddSharp />
                </span>{" "}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RelatedProductCard;
