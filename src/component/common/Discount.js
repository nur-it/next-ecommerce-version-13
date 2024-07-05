const Discount = ({ discount, product, slug, modal, card }) => {
  return (
    <>
      {discount > 1 && (
        <span
          className={
            modal
              ? "absolute text-dark text-sm bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 left-4 top-4"
              : slug
              ? "text-dark text-sm bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 left-0 top-4"
              : " absolute text-dark text-xs bg-orange-500 text-white py-1 px-2 rounded font-medium z-10"
          }
        >
          {discount.toFixed(0)}% Off
        </span>
      )}
      {discount === undefined && Number(product.prices.discount) > 1 && (
        <span
          className={
            modal
              ? "absolute text-dark text-sm bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 left-4 top-4"
              : slug
              ? "text-dark text-sm bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 left-0 top-4"
              : " absolute text-dark text-xs bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 right-0 top-0"
          }
        >
          {Number(product.prices.discount).toFixed(0)}% Off
        </span>
      )}
    </>
  );
};

export default Discount;
