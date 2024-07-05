import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// internal imports
import ImageWithFallback from "@component/common/ImageWithFallBack";
import ProductModal from "@component/modal/ProductModal";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { clearExtraCart } from "@redux/slice/extraCart";
import CategoryServices from "@services/CategoryServices";

const ProductCard = ({
  product,
  attributes,
  storeSetting,
  globalSetting,
  categoryName,
}) => {
  const dispatch = useDispatch();

  // custom hook
  const { showingTranslateValue, currency, getNumberTwo } = useUtilsFunction();

  // react hook
  const [category, setCategory] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState({});

  const handleModalOpen = async (event, product) => {
    if (categoryName?.en === "Popular Items") {
      const res = await CategoryServices.getCategoryById(product.category);

      setCategory(res);
      setModalOpen(event);
    } else {
      setCategory({ name: categoryName });
      setModalOpen(event);
    }

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
          category={category}
          mainProduct={product}
          setCategory={setCategory}
          modalOpen={modalOpen}
          attributes={attributes}
          setModalOpen={setModalOpen}
          storeSetting={storeSetting}
          globalSetting={globalSetting}
          relatedProduct={relatedProduct}
          setRelatedProduct={setRelatedProduct}
          product={
            Object?.keys(relatedProduct)?.length > 1 ? relatedProduct : product
          }
        />
      )}

      <div
        onClick={() => handleModalOpen(!modalOpen, product)}
        role="button"
        className="flex justify-between items-center gap-1 border border-gray-200 hover:border-gray-300 rounded-md bg-white"
      >
        <div className="flex flex-col px-3 py-1">
          <h5 className="text-gray-800 font-semibold text-base tracking-wide capitalize">
            {showingTranslateValue(product?.title)}
          </h5>
          <span className="text-gray-500 text-sm font-medium tracking-wide my-1">
            {showingTranslateValue(product?.description).length > 160
              ? showingTranslateValue(product?.description).substring(0, 160) +
                "..."
              : showingTranslateValue(product?.description)}
          </span>
          <span className="text-gray-700 text-sm font-semibold tracking-wide">
            {currency}
            {getNumberTwo(product?.prices?.originalPriceWithoutTax)}
          </span>
        </div>

        <div className="rounded py-2">
          <div className="relative">
            <div className="relative w-36 h-28 py-2">
              {product?.image[0] && (
                <ImageWithFallback src={product.image[0]} alt="product" />
              )}
            </div>

            {storeSetting?.store_view === "hospitality" &&
              storeSetting?.menu_type === "eCommerce" && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-white text-sm font-bold tracking-wide px-3.5 py-2 rounded-full shadow-xl hover:bg-gray-100 transition ease-linear delay-75"
                >
                  Add
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
