import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "react-use-cart";

//internal import
import { SidebarContext } from "@context/SidebarContext";
import useAddToCart from "@hooks/useAddToCart";

const CartItem = ({
  item,
  currency,
  shippingCarrier,
  handleShippingCarrier,
}) => {
  const { updateItemQuantity, removeItem } = useCart();
  const { closeCartDrawer } = useContext(SidebarContext);
  const { handleIncreaseQuantity } = useAddToCart();

  const handleDecreaseQuantityItem = (item) => {
    if (shippingCarrier) {
      handleShippingCarrier(shippingCarrier);
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantityItem = (item) => {
    if (shippingCarrier) {
      handleShippingCarrier(shippingCarrier);
      handleIncreaseQuantity(item);
    } else {
      handleIncreaseQuantity(item);
    }
  };

  return (
    <div className="group w-full h-auto flex justify-start items-center bg-white py-3 px-4 border-b hover:bg-gray-50 transition-all border-gray-100 relative last:border-b-0">
      <div className="relative flex rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer mr-4">
        {item.image[0] ? (
          <Image
            key={item.id}
            src={item?.image[0]}
            width={40}
            height={40}
            alt="product"
          />
        ) : (
          <Image
            src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
            width={40}
            height={40}
            alt="product Image"
          />
        )}
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <Link
          href={`/product/${item.slug}?_id=${item._id}`}
          onClick={closeCartDrawer}
          className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1"
        >
          {item.title}
        </Link>
        <span className="text-xs text-gray-400 mb-1">
          Item Price : {currency}
          {parseFloat(item.price).toFixed(2)}
        </span>
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm md:text-base text-heading leading-5">
            <span>
              {currency}
              {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
          <div className="h-8 w-22 md:w-24 lg:w-24 flex flex-wrap items-center justify-evenly p-1 border border-gray-100 bg-white text-gray-600 rounded-md">
            <button onClick={() => handleDecreaseQuantityItem(item)}>
              <span className="text-dark text-base">
                <FiMinus />
              </span>
            </button>
            <p className="text-sm font-semibold text-dark px-1">
              {item.quantity}
            </p>
            <button onClick={() => handleIncreaseQuantityItem(item)}>
              <span className="text-dark text-base">
                <FiPlus />
              </span>
            </button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="hover:text-red-600 text-red-400 text-lg cursor-pointer"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
