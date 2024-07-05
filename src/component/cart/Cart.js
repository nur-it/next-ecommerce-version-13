import useAsync from "@hooks/useAsync";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { IoBagCheckOutline, IoBagHandle, IoClose } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import
import CartItem from "@component/cart/CartItem";
import LoginModal from "@component/modal/LoginModal";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";

import SettingServices from "@services/SettingServices";
import useTranslation from "next-translate/useTranslation";

const Cart = () => {
  const {
    data: globalSetting,
    loading,
    error,
  } = useAsync(SettingServices.getGlobalSetting);

  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { isEmpty, items, cartTotal } = useCart();
  const { toggleCartDrawer, closeCartDrawer, setIsLoading } =
    useContext(SidebarContext);

  const {
    state: { userInfo },
  } = useContext(UserContext);

  const handleOpenLogin = () => {
    if (router.push("/?redirect=/checkout")) {
      toggleCartDrawer();
      setModalOpen(!modalOpen);
    }
  };

  //============== Language Select RMK (Translate) =================//

  const { t } = useTranslation();

  const currency =
    (!loading && !error && globalSetting?.default_currency) || "$";

  const checkoutClass = (
    <button
      onClick={closeCartDrawer}
      className="w-full py-3 px-3 rounded-lg bg-gray-800 hover:bg-gray-900 flex items-center justify-between bg-heading text-sm sm:text-base text-white focus:outline-none transition duration-300"
    >
      <span className="align-middle font-medium font-serif">
        {t("common:proceedToCheckoutBtn")}
      </span>
      <span className="rounded-lg font-bold font-serif py-2 px-3 bg-white text-emerald-600">
        {currency}
        {cartTotal.toFixed(2)}
      </span>
    </button>
  );

  return (
    <>
      {modalOpen && (
        <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
      <div className="flex flex-col w-full h-full justify-between items-middle bg-white rounded cursor-pointer">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-indigo-50 border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex items-center">
            <span className="text-xl mr-2 mb-1">
              <IoBagCheckOutline />
            </span>

            {t("common:shoppingCartDrawerTitle")}
          </h2>
          <button
            onClick={closeCartDrawer}
            className="inline-flex text-base items-center justify-center text-gray-500 p-2 focus:outline-none transition-opacity hover:text-red-400"
          >
            <IoClose />
            <span className="font-sens text-sm text-gray-500 hover:text-red-400 ml-1">
              {t("common:closeBtn")}
            </span>
          </button>
        </div>
        <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-emerald-100">
                  <span className="text-emerald-600 text-4xl block">
                    <IoBagHandle />
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-gray-700 text-lg pt-5">
                  {t("common:cartEmptyTitle")}
                </h3>
                <p className="px-12 text-center text-sm text-gray-500 pt-2">
                  {t("common:cartEmptyText")}
                </p>
              </div>
            </div>
          )}

          {items.map((item, i) => (
            <CartItem key={i + 1} item={item} currency={currency} />
          ))}
        </div>
        <div className="mx-5 my-3">
          {items.length <= 0 ? (
            checkoutClass
          ) : (
            <span>
              {!userInfo ? (
                <div onClick={handleOpenLogin}>{checkoutClass}</div>
              ) : (
                <Link href="/checkout" onClick={() => setIsLoading(true)}>
                  {/* <a onClick={() => setIsLoading(true)}>{checkoutClass}</a> */}
                  {checkoutClass}
                </Link>
              )}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
