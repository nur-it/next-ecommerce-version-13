import { notifyError, notifySuccess } from "@utils/toast";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "react-use-cart";

const useAddToCart = () => {
  const { lang } = useTranslation();
  // const { data: onlineStoreSetting } = useAsync(() =>
  //   SettingServices.getOnlineStoreSetting()
  // );

  // redux store call
  const setting = useSelector((state) => state.setting);
  const { settingItem } = setting;
  const storeSetting = settingItem.find(
    (value) => value.name === "onlineStoreSetting"
  );

  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity } = useCart();

  const handleAddItem = (product) => {
    const result = items.find((i) => i.id === product.id);

    if (result !== undefined) {
      if (result?.quantity + item < product?.stock) {
        addItem(product, item);
        notifySuccess(`${item} X ${product.title} added to cart!`);
      } else if (
        storeSetting?.allow_out_of_stock &&
        product.allowOutOfStockOrder.includes("store")
      ) {
        addItem(product, item);
        notifySuccess(`${item} X ${product.title} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    } else {
      if (
        item > product.stock &&
        !storeSetting?.allow_out_of_stock &&
        product.allowOutOfStockOrder.includes("store")
      ) {
        return notifyError("Insufficient stock!");
      }
      addItem(product, item);
      notifySuccess(`${item} X ${product.title} added to cart!`);
    }
  };

  const handleIncreaseQuantity = (item) => {
    if (item?.quantity < item?.stock) {
      updateItemQuantity(item.id, item.quantity + 1);
    } else if (
      storeSetting?.allow_out_of_stock &&
      item.allowOutOfStockOrder.includes("store")
    ) {
      updateItemQuantity(item.id, item.quantity + 1);
    } else {
      notifyError("Insufficient stock!");
    }
  };

  return {
    handleAddItem,
    setItem,
    item,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
