import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// internal imports
import ImageWithFallback from "@component/common/ImageWithFallBack";
import ProductModal from "@component/modal/ProductModal";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { clearExtraCart } from "@redux/slice/extraCart";
import CategoryServices from "@services/CategoryServices";

const ProductCard2 = ({
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
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState({});

  const handleModalOpen = async (event, product) => {
    if (categoryName?.en === "Popular Items") {
      const res = await CategoryServices.getCategoryById(product.category);
      setCategory(res);
    } else {
      setCategory({ name: categoryName });
    }

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
        role="button"
        className="flex justify-between border border-gray-200 hover:border-gray-300 rounded-md bg-white relative w-full"
      >
        <div className="flex flex-col gap-2 px-3 py-1 w-full">
          <div className="w-full flex justify-center">
            <div className="relative w-36 h-28 py-2">
              {product?.image[0] && (
                <ImageWithFallback src={product.image[0]} alt="product" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <h5 className="text-gray-700 font-semibold text-sm tracking-wide capitalize">
                {showingTranslateValue(product?.title).length > 30
                  ? showingTranslateValue(product?.title) + "..."
                  : showingTranslateValue(product?.title).substring(0, 30)}
              </h5>
            </div>

            <div>
              <span className="text-gray-800 text-sm font-semibold tracking-wide">
                {currency}
                {getNumberTwo(product?.prices?.originalPriceWithoutTax)}
              </span>
            </div>
            {/* 
            <div className="text-right">
              {storeSetting?.store_view === "hospitality" &&
                storeSetting?.menu_type === "eCommerce" && (
                  <button
                    type="button"
                    className="bg-white text-sm font-bold tracking-wide px-3.5 py-2 rounded-full shadow-xl hover:bg-gray-100 transition ease-linear delay-75"
                  >
                    Add
                  </button>
                )}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard2;
