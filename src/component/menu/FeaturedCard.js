import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

// internal imports
import ProductModal from "@component/modal/ProductModal";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { clearExtraCart } from "@redux/slice/extraCart";
import ImageWithFallback from "@component/common/ImageWithFallBack";

const FeaturedCard = ({ product, attributes, storeSetting, globalSetting }) => {
  const dispatch = useDispatch();

  // react hook
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState({});
  const [category, setCategory] = useState({});

  // custom hook
  const { showingTranslateValue, currency, getNumberTwo } = useUtilsFunction();

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

      <div
        onClick={() => handleModalOpen(!modalOpen, product)}
        className="w-36"
        role="button"
      >
        <div className="border border-gray-300 p-2 rounded bg-white">
          <div className="mb-2" role="button">
            <div className="relative w-36 h-28 py-2">
              {product?.image[0] && (
                <ImageWithFallback src={product.image[0]} alt="product" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <h5 className="text-sm font-semibold tracking-wide text-gray-800 hover:text-gray-900 capitalize">
            {showingTranslateValue(product?.title).length > 12
              ? `${showingTranslateValue(product?.title).substring(0, 12)}...`
              : showingTranslateValue(product?.title)}
          </h5>
          <span className="text-sm font-medium text-gray-600 hover:text-gray-900 tracking-wide">
            {currency}
            {getNumberTwo(product?.prices?.originalPriceWithoutTax)}
          </span>
        </div>
      </div>
    </>
  );
};

export default FeaturedCard;
