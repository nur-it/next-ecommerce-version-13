import useTranslation from "next-translate/useTranslation";

const Stock = ({ stock, card, volume, totalVolume, unit }) => {
  const { t } = useTranslation();

  return (
    <>
      {stock <= 0 || totalVolume < volume ? (
        <span className="bg-red-100 absolute z-10 text-red-700 rounded-full inline-flex items-center justify-center px-2 py-0 text-xs font-medium font-serif">
          {/* Stock Out */}
          {t("common:stockOut")}
        </span>
      ) : (
        <>
          <span
            className={`${
              card
                ? "bg-gray-100 absolute z-10 text-green-500 rounded-full text-xs px-2 py-0 font-medium"
                : "bg-green-100 text-green-500 rounded-full inline-flex items-center justify-center px-2 py-0 text-xs font-semibold font-serif"
            }`}
          >
            {t("common:stock")} :
            <span className="text-orange-700 pl-1 font-bold">{stock} </span>
          </span>
          {totalVolume > 0 && !card && (
            <span className=" text-gray-500 rounded-full text-xs px-2 py-0 font-medium">
              ({totalVolume}
              <span className=" text-gray-500 rounded-full text-xs py-0 font-semibold">
                {" "}
                {unit})
              </span>
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Stock;
