import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({ product, price, card }) => {
  const { currency, getNumberTwo } = useUtilsFunction();

  return (
    <div className="flex flex-col justify-start items-start font-serif product-price font-bold">
      {product?.prices?.discount > 0 ? (
        <h5
          className={
            card
              ? "inline-block text-lg font-semibold text-gray-800"
              : "inline-block text-2xl"
          }
        >
          {currency}
          {getNumberTwo(product?.prices?.price)}
        </h5>
      ) : (
        <h5
          className={
            card
              ? "inline-block text-lg font-semibold text-gray-800"
              : "inline-block text-2xl"
          }
        >
          {currency}
          {product?.variants?.length > 0
            ? getNumberTwo(product?.variants[0]?.originalPriceWithTax)
            : getNumberTwo(price)}
        </h5>
      )}

      {price < product?.prices?.originalPriceWithTax ? (
        <del
          className={
            card
              ? "sm:text-sm font-normal text-base text-gray-400 ml-1"
              : "text-lg font-normal text-gray-400 ml-1"
          }
        >
          {currency}
          {getNumberTwo(price)}
        </del>
      ) : (
        <del className="sm:text-sm font-normal text-base text-gray-400 ml-1 invisible">
          null
        </del>
      )}
    </div>
  );
};

export default Price;
