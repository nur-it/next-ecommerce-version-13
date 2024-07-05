import { useState } from "react";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

//internal import
import { notifyError } from "@utils/toast";
import SwitchToggleTwo from "@component/form/SwitchToggleTwo";
import {
  decrementExtraCartItem,
  incrementExtraCartItem,
  removeExtraFromCart,
} from "@redux/slice/extraCart";
import useUtilsFunction from "@hooks/useUtilsFunction";

const ExtrasList = ({
  att,
  slug,
  extra,
  selectEx,
  product,
  dispatch,
  setSelectEx,
  selectExtra,
  extraTitle,
  setExtrasPrice,
  setSelectExtra,
  storeSetting,
}) => {
  // redux store

  const extraCart = useSelector((state) => state.extraCart.extraCartItem);

  // react hook
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [element, setElement] = useState({});
  const [result, setResult] = useState({});

  const { currency, showingTranslateValue, getNumberTwo } = useUtilsFunction();

  const handleAddRemoveExtra = (el, value, checked) => {
    // extra add to cart qty
    if (checked) {
      if (selectExtra.includes(value)) return;
      setExtrasPrice(
        (pre) =>
          pre +
          Number(
            el.impactOnPriceWithTax == undefined ? 0 : el.impactOnPriceWithTax
          )
      );
      setSelectExtra((pre) => [...pre, el]);
      setSelectEx((pre) => [...pre, value]);
    } else {
      const newArr = selectExtra.filter((v) => v !== el);
      const newEl = selectEx.filter((v) => v !== value);
      setSelectEx(newEl);
      setSelectExtra(newArr);
      dispatch(removeExtraFromCart(el.productId + value));

      const result = extraCart.filter(
        (elem) => elem.id !== el.productId + value
      );

      const price = result?.reduce((pre, acc) => pre + acc.itemTotal, 0);
      setExtrasPrice(price);
    }
  };

  const handleProductQuantity = (type, el, value) => {
    // let result;
    if (el && type === "incdec") {
      setElement(el);
      const result = extraCart.find((elem) => elem.id === el.productId + value);
      setQuantity(result?.addedQuantity);
      setResult(result);
    }
    setOpenModal(true);

    if (type === "inc") {
      if (
        element.quantity <= quantity &&
        (!storeSetting?.allow_out_of_stock ||
          !product?.allowOutOfStockOrder?.includes("pos"))
      ) {
        return notifyError("Insufficient stock!");
      }
      setQuantity((pre) => pre + 1);
      dispatch(
        incrementExtraCartItem({
          id: result.id,
          qty: 1,
        })
      );
    }

    if (type === "dec") {
      if (quantity === 1) return;
      setQuantity((pre) => pre - 1);
      dispatch(
        decrementExtraCartItem({
          id: result.id,
          qty: 1,
        })
      );
    }
  };

  const handleCloseModal = (v) => {
    if (v) {
      setOpenModal(false);
      const price = extraCart.reduce(
        (pre, acc) => pre + Number(acc.itemTotal),
        0
      );

      // console.log("price extra", price, "extraCart", extraCart);
      setExtrasPrice(price);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center enter-done"
        style={{ display: `${openModal ? "flex" : "none"}` }}
      >
        <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg sm:rounded-lg sm:m-4 sm:max-w-xl custom-modal">
          <div className="text-xs flex flex-row justify-between text-gray-500 mb-4 mt-6">
            <div>
              {" "}
              Item Price{" "}
              <span className="text-gray-600 font-semibold">
                {currency}
                {getNumberTwo(element?.impactOnPriceWithTax)}
              </span>
            </div>
            <div>
              {" "}
              Total Price{" "}
              <span className="text-gray-600 font-semibold">
                {currency}
                {getNumberTwo((element?.impactOnPriceWithTax || 0) * quantity)}
              </span>
            </div>
          </div>

          <div className="h-full flex flex-wrap items-center justify-evenly p-1 border border-gray-100 bg-white text-gray-600 rounded-md">
            <button
              onClick={() => handleProductQuantity("dec")}
              className="focus:outline-none"
            >
              <span className="text-orange-500 text-3xl">
                <FiMinus />
              </span>
            </button>

            <p className="text-base font-semibold text-dark px-1">{quantity}</p>

            <button
              onClick={() => handleProductQuantity("inc")}
              className="focus:outline-none"
            >
              <span className="text-green-500 text-3xl">
                <FiPlus />
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row bg-gray-50 ">
            <button
              onClick={() => handleCloseModal(true)}
              className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-1 mt-2 rounded-md text-white bg-red-500 border border-transparent active:bg-red-600 hover:bg-red-600 focus:ring focus:ring-purple-300 w-auto cursor-pointer"
            >
              <span className="text-2xl text-white">
                <FiX />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 */}

      {/* <div className="grid lg:grid-cols-3 grid-cols-2"> */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-4 ${
          slug ? "xl:grid-cols-5" : "xl:grid-cols-8"
        } gap-4`}
      >
        {[...new Map(extra?.map((v) => [v[att], v].filter(Boolean))).values()]
          .filter(Boolean)
          .map((vl, i) => {
            return extraTitle.map((vr) =>
              vr?.variants?.map(
                (el) =>
                  el?._id === vl[att] && (
                    <div key={i + 1} className="text-center mx-1">
                      {selectExtra.includes(vl) &&
                      storeSetting?.extra_quantity_popup ? (
                        <div
                          onClick={() =>
                            handleProductQuantity(
                              "incdec",
                              vl,
                              showingTranslateValue(el?.name)
                              // Object.keys(el?.name).includes()
                              //   ? el?.name[]
                              //   : el?.name.en
                            )
                          }
                          className="inline-flex text-sm dark:text-gray-600 cursor-pointer"
                        >
                          {showingTranslateValue(el?.name)?.length > 12
                            ? showingTranslateValue(el?.name)?.substring(
                                0,
                                12
                              ) + "..."
                            : showingTranslateValue(el?.name)}
                          {/* {Object.keys(el?.name).includes()
                            ? el?.name[]
                            : el?.name.en} */}
                          ({currency}
                          {getNumberTwo(vl?.impactOnPriceWithTax)})
                        </div>
                      ) : (
                        <div className="inline-flex text-sm dark:text-gray-600 cursor-pointer">
                          {showingTranslateValue(el?.name)?.length > 12
                            ? showingTranslateValue(el?.name)?.substring(
                                0,
                                12
                              ) + "..."
                            : showingTranslateValue(el?.name)}
                          {/* {Object.keys(el?.name).includes()
                            ? el?.name[]
                            : el?.name.en} */}
                          ({currency}
                          {getNumberTwo(vl?.impactOnPriceWithTax)})
                        </div>
                      )}

                      <SwitchToggleTwo
                        value={vl}
                        att={showingTranslateValue(el?.name)}
                        // att={
                        //   Object.keys(el?.name).includes()
                        //     ? el?.name[]
                        //     : el?.name.en
                        // }
                        product={product}
                        storeSetting={storeSetting}
                        handleAddRemoveExtra={handleAddRemoveExtra}
                      />
                    </div>

                    // console.log('el', el._id === v[att] && el.name)
                  )
              )
            );
          })}
      </div>
    </>
  );
};

export default ExtrasList;
