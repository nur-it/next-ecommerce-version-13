import { useState } from "react";
import { useDispatch } from "react-redux";
import Switch from "react-switch";

//internal import
import { notifyError } from "@utils/toast";
import { addToExtraCart, removeExtraFromCart } from "@redux/slice/extraCart";

const SwitchToggleTwo = ({
  value,
  att,
  product,
  storeSetting,
  handleAddRemoveExtra,
}) => {
  const dispatch = useDispatch();
  const [enable, setEnabled] = useState(att ? false : true);

  const handleEnabled = (checked, value, el) => {
    // console.log(
    //   "SwitchToggleTwo",
    //   checked,
    //   el.quantity,
    //   value,
    //   "product",
    //   product,
    //   "storeSetting",
    //   storeSetting
    // );

    if (
      el.quantity <= 0 &&
      (!storeSetting?.allow_out_of_stock ||
        !product?.allowOutOfStockOrder?.includes("pos"))
    )
      return notifyError("Insufficient stock!");
    handleAddRemoveExtra(el, value, !enable);
    setEnabled(!enable);
    if (checked) {
      console.log("checked");
      dispatch(removeExtraFromCart(el.productId + value));
    } else {
      const newItem = {
        ...el,
        id: el.productId + value,
        // itemTotal: Number(el.price),
        itemTotal:
          el?.impactOnPriceWithTax == undefined
            ? 0
            : Number(el.impactOnPriceWithTax),
        impactOnPriceWithTax:
          el?.impactOnPriceWithTax == undefined
            ? "00.00"
            : el?.impactOnPriceWithTax,
        addedQuantity: 1,
        name: value,
      };
      // console.log("nee item", newItem);
      dispatch(addToExtraCart(newItem));
    }
  };

  return (
    <>
      <div className={`${"mb-3 items-center"}`}>
        <Switch
          onChange={() => handleEnabled(enable, att, value)}
          checked={enable}
          className="react-switch"
          uncheckedIcon={
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 13,
                color: "white",
                paddingRight: 5,
                // paddingTop: 1,
              }}
            >
              No
            </span>
          }
          width={65}
          height={25}
          handleDiameter={20}
          offColor="#E53E3E"
          onColor="#2F855A"
          checkedIcon={
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 13,
                color: "white",
                paddingRight: 10,
                // paddingTop: 1,
              }}
            >
              Yes
            </span>
          }
        />
      </div>
    </>
  );
};

export default SwitchToggleTwo;
