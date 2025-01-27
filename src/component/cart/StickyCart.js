import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "react-use-cart";
import useTranslation from "next-translate/useTranslation";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import { SidebarContext } from "@context/SidebarContext";

const StickyCart = () => {
  const { t } = useTranslation();
  const { totalItems, cartTotal } = useCart();
  const { toggleCartDrawer } = useContext(SidebarContext);

  const { error, loading, globalSetting, storeCustomizationSetting } =
    useGetSetting();

  const currency = globalSetting?.default_currency || "$";

  return (
    <button aria-label="Cart" onClick={toggleCartDrawer} className="absolute">
      <div className="right-0 w-35 float-right fixed top-2/4 bottom-2/4 align-middle shadow-lg cursor-pointer z-30 hidden lg:block xl:block">
        <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-tl-lg p-2 text-gray-700">
          <span className="text-2xl mb-1 text-emerald-600">
            <IoBagHandleOutline />
          </span>
          <span className="px-2 text-sm font-serif font-medium">
            {totalItems} {t("common:items")}
          </span>
        </div>
        <div
          style={{
            backgroundColor: storeCustomizationSetting?.color?.bg_button?.hex,
          }}
          className={`bg-gray-900 text-white flex flex-col items-center justify-center p-2 text-base font-serif font-medium rounded-bl-lg mx-auto`}
        >
          {!loading && !error && currency}
          {cartTotal.toFixed(2)}
        </div>
      </div>
    </button>
  );
};

export default dynamic(() => Promise.resolve(StickyCart), { ssr: false });
