import { CardElement } from "@stripe/react-stripe-js";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { ImCreditCard } from "react-icons/im";
import {
  IoArrowForward,
  IoBagHandle,
  IoReturnUpBackOutline,
  IoWalletSharp,
} from "react-icons/io5";

//internal import
import CartItem from "@component/cart/CartItem";
import PaypalButton from "@component/common/PaypalButton";
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import InputPayment from "@component/form/InputPayment";
import InputShippingCarriers from "@component/form/InputShippingCarriers";
import Label from "@component/form/Label";
import SelectCountry from "@component/form/SelectCountry";
import SwitchToggleShippingAdd from "@component/form/SwitchToggleShippingAdd";
import CheckoutModal from "@component/modal/CheckoutModal";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import useAsync from "@hooks/useAsync";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Layout from "@layout/Layout";
import SettingServices from "@services/SettingServices";

const Checkout = () => {
  const { t } = useTranslation();

  const {
    data: shippingData,
    loading: shippingLoading,
    error: shippingError,
  } = useAsync(SettingServices.getShowingShipping);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, storeSetting, lang } = useGetSetting();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const {
    handleSubmit,
    submitHandler,
    register,
    errors,
    showCard,
    setShowCard,
    error,
    watch,
    errorShow,
    stripe,
    couponInfo,
    couponRef,
    // storeSetting,
    isCouponApplied,
    handleCouponCode,
    discountAmount,
    shippingCost,
    total,
    isEmpty,
    items,
    vatTotal,
    currency,
    originalPriceWithoutTax,
    cartTotal,
    isCheckoutSubmit,
    setIsCheckoutSubmit,
    handleShippingCarrier,
    shippingCarrier,
    handlePaymentWithPaypal,
    paypalPayment,
    existingShippingAddress,
    setExistingShippingAddress,
    newShippingAddressId,
    setNewShippingAddressId,
    findUser,
    modalShow,
    setModalShow,
    orderSubmitAfterModal,
  } = useCheckoutSubmit(shippingData.length);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const product = {
    cart: items,
    total: total,
    shippingCost: shippingCost,
  };

  // console.log("store setting", storeSetting);

  return (
    <>
      {/* modal */}
      <CheckoutModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        orderSubmitAfterModal={orderSubmitAfterModal}
        setIsCheckoutSubmit={setIsCheckoutSubmit}
      />

      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout title="Checkout" description="this is checkout page">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
              <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="form-group">
                      <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                        01.{" "}
                        {showingTranslateValue(
                          storeCustomizationSetting?.checkout?.personal_details
                        )}
                      </h2>
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.first_name
                            )}
                            name="firstName"
                            type="text"
                            placeholder="John"
                          />
                          <Error errorName={errors.firstName} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.last_name
                            )}
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                          />
                          <Error errorName={errors.lastName} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.email_address
                            )}
                            name="email"
                            type="email"
                            placeholder="youremail@gmail.com"
                          />
                          <Error errorName={errors.email} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout
                                ?.checkout_phone
                            )}
                            name="contact"
                            type="tel"
                            placeholder="+062-6532956"
                          />

                          <Error errorName={errors.contact} />
                        </div>
                      </div>
                    </div>

                    <div className="form-group mt-12">
                      <div className="grid grid-cols-6 gap-6 mb-5">
                        <div className="col-span-6 sm:col-span-3 lg:col-span-4">
                          <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                            02.{" "}
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout
                                ?.shipping_details
                            )}
                          </h2>
                        </div>
                        {/*=================================== Second time checkout shipping address  ===================================*/}

                        {/* ======== Temporary hide - RMK =======   */}
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2 justify-end">
                          <div className="col-span-6 sm:col-span-6 lg:col-span-2 items-start justify-start">
                            {!existingShippingAddress ? (
                              findUser?.shippingAddress?.length === 0 ? (
                                <div></div>
                              ) : (
                                <div>
                                  <SwitchToggleShippingAdd
                                    title={"Save Shipping Address"}
                                    setExistingShipping={
                                      setExistingShippingAddress
                                    }
                                    existingShipping={existingShippingAddress}
                                    className={"justify-start"}
                                  />
                                </div>
                              )
                            ) : (
                              <div>
                                <SwitchToggleShippingAdd
                                  title={"Save Shipping Address"}
                                  setExistingShipping={
                                    setExistingShippingAddress
                                  }
                                  existingShipping={existingShippingAddress}
                                  className={"justify-start"}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/*=================================== Second time  shipping address END ===================================*/}
                      {!existingShippingAddress ? (
                        findUser?.shippingAddress?.length === 0 ? (
                          <div className="grid grid-cols-6 gap-6 mb-8">
                            <div className="col-span-6">
                              <InputArea
                                register={register}
                                label={showingTranslateValue(
                                  storeCustomizationSetting?.checkout
                                    ?.street_address
                                )}
                                name="address"
                                type="text"
                                placeholder="123 Boulevard Rd, Beverley Hills"
                              />
                              <Error errorName={errors.address} />
                            </div>

                            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                              <InputArea
                                register={register}
                                label={showingTranslateValue(
                                  storeCustomizationSetting?.checkout?.city
                                )}
                                name="city"
                                type="text"
                                placeholder="Los Angeles"
                              />
                              <Error errorName={errors.city} />
                            </div>

                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              {/* <InputArea
                                    register={register}
                                    label={t('common:country')}
                                    name="country"
                                    type="text"
                                    placeholder="United States"
                                  /> */}
                              <Label
                                label={showingTranslateValue(
                                  storeCustomizationSetting?.checkout?.country
                                )}
                              />
                              <SelectCountry
                                register={register}
                                label={showingTranslateValue(
                                  storeCustomizationSetting?.checkout?.country
                                )}
                                name="country"
                                shippingCarrier={shippingCarrier}
                                handleShippingCarrier={handleShippingCarrier}
                              />
                              <Error errorName={errors.country} />
                            </div>

                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <InputArea
                                register={register}
                                label={showingTranslateValue(
                                  storeCustomizationSetting?.checkout?.zip_code
                                )}
                                name="zipCode"
                                type="text"
                                placeholder="2345"
                              />
                              <Error errorName={errors.zipCode} />
                            </div>

                            {/* ======== Save button is temporary hide - RMK =======   */}
                            {/* <div className="col-span-6 sm:col-span-6 lg:col-span-6 items-start justify-start">
                              <div className="pb-1 text-sm font-medium text-gray-500">
                                Save shipping address
                              </div>
                              <SwitchToggle
                                title={"Save shipping address"}
                                handleProcess={setShippingAddressSave}
                                processOption={shippingAddressSave}
                                className={"justify-start"}
                              />
                            </div> */}
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-3 grid-cols-2 gap-5 mb-5">
                            {findUser?.shippingAddress?.map((value) => (
                              <div
                                key={value._id}
                                className={`flex flex-col justify-center p-5 ${
                                  newShippingAddressId === value._id
                                    ? "bg-white"
                                    : ""
                                } hover:bg-white rounded-md ${
                                  newShippingAddressId === value._id
                                    ? "border-2 border-green-500"
                                    : "border border-gray-200"
                                } hover:border-green-500 cursor-pointer`}
                                onClick={() =>
                                  setNewShippingAddressId(value._id)
                                }
                              >
                                <h4 className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                                  Address: {value.address}
                                </h4>
                                <div className="block text-gray-500 text-sm font-medium capitalize">
                                  {" "}
                                  City: {value.city}
                                </div>
                                <div className="block text-gray-500 text-sm font-medium capitalize">
                                  Country: {value.country}
                                </div>
                                <div className="block text-gray-500 text-sm font-medium capitalize">
                                  ZipCode: {value.zipCode}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="grid grid-cols-6 gap-6 mb-8">
                          <div className="col-span-6">
                            <InputArea
                              register={register}
                              label={showingTranslateValue(
                                storeCustomizationSetting?.checkout
                                  ?.street_address
                              )}
                              name="address"
                              type="text"
                              placeholder="123 Boulevard Rd, Beverley Hills"
                            />
                            <Error errorName={errors.address} />
                          </div>

                          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                            <InputArea
                              register={register}
                              label={showingTranslateValue(
                                storeCustomizationSetting?.checkout?.city
                              )}
                              name="city"
                              type="text"
                              placeholder="Los Angeles"
                            />
                            <Error errorName={errors.city} />
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            {/* <InputArea
                                register={register}
                                label={t('common:country')}
                                name="country"
                                type="text"
                                placeholder="United States"
                              /> */}
                            <Label
                              label={showingTranslateValue(
                                storeCustomizationSetting?.checkout?.country
                              )}
                            />
                            <SelectCountry
                              lang={lang}
                              register={register}
                              label={showingTranslateValue(
                                storeCustomizationSetting?.checkout?.country
                              )}
                              name="country"
                              shippingCarrier={shippingCarrier}
                              handleShippingCarrier={handleShippingCarrier}
                            />
                            <Error errorName={errors.country} />
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <InputArea
                              register={register}
                              label={showingTranslateValue(
                                storeCustomizationSetting?.checkout?.zip_code
                              )}
                              name="zipCode"
                              type="text"
                              placeholder="2345"
                            />
                            <Error errorName={errors.zipCode} />
                          </div>
                        </div>
                      )}

                      <>
                        <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                          03.
                          {showingTranslateValue(
                            storeCustomizationSetting?.checkout?.shipping_method
                          )}
                        </h2>

                        <InputShippingCarriers
                          handleShippingCarrier={handleShippingCarrier}
                          register={register}
                          value=""
                          time=""
                          cost={60}
                          watch={watch}
                          className="col-span-6 sm:col-span-3"
                          lang={lang}
                          shippingData={shippingData}
                          loading={shippingLoading}
                          error={shippingError}
                        />
                        <Error errorName={errors.shippingCarriers} />

                        {errorShow && (
                          <span className="text-red-400 text-sm mt-2">
                            {error}
                          </span>
                        )}
                      </>
                    </div>

                    <div className="form-group mt-12">
                      <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                        04.{" "}
                        {showingTranslateValue(
                          storeCustomizationSetting?.checkout?.payment_method
                        )}
                      </h2>
                      {showCard && (
                        <div className="mb-3">
                          <CardElement />{" "}
                          <p className="text-red-400 text-sm mt-1">{error}</p>
                        </div>
                      )}
                      <div className="grid lg:grid-cols-3 gap-6 ">
                        <div>
                          <InputPayment
                            paypalPayment={paypalPayment}
                            setShowCard={setShowCard}
                            register={register}
                            name={t("common:cashOnDelivery")}
                            value="COD"
                            Icon={IoWalletSharp}
                          />
                          <Error errorName={errors.paymentMethod} />
                        </div>

                        <div
                          className={`${
                            storeSetting?.allowStripe ? "inline" : "hidden"
                          }`}
                        >
                          <InputPayment
                            paypalPayment={paypalPayment}
                            setShowCard={setShowCard}
                            register={register}
                            name={"Stripe"}
                            value="Card"
                            Icon={ImCreditCard}
                          />
                          {/* <Error errorName={errors.paymentMethod} /> */}
                        </div>

                        <div
                          className={`${
                            storeSetting?.allowPaypal ? "inline" : "hidden"
                          } z-0`}
                        >
                          {!paypalPayment ? (
                            <PaypalButton
                              disabled={isEmpty || isCheckoutSubmit}
                              product={product}
                              total={total}
                              currency={currency}
                              handlePaymentWithPaypal={handlePaymentWithPaypal}
                            />
                          ) : (
                            <InputPayment
                              setShowCard={setShowCard}
                              register={register}
                              name={t("common:payPal")}
                              value="Paypal"
                              Icon={ImCreditCard}
                            />
                          )}
                          {/* <Error errorName={errors.paymentMethod} /> */}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                      <div className="col-span-6 sm:col-span-3">
                        <Link
                          href="/"
                          className="bg-indigo-50 border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center font-serif w-full"
                        >
                          <span className="text-xl mr-2">
                            <IoReturnUpBackOutline />
                          </span>

                          {showingTranslateValue(
                            storeCustomizationSetting?.checkout?.continue_button
                          )}
                        </Link>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <button
                          type="submit"
                          disabled={isEmpty || !stripe || isCheckoutSubmit}
                          className="bg-gray-800 hover:bg-gray-900 border border-emerald-500 transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full"
                        >
                          {isCheckoutSubmit ? (
                            <span className="flex justify-center text-center">
                              {" "}
                              <img
                                src="/spinner.gif"
                                alt="Loading"
                                width={20}
                                height={10}
                              />{" "}
                              <span className="ml-2">
                                {t("common:processing")}
                              </span>
                            </span>
                          ) : (
                            <span className="flex justify-center text-center">
                              {" "}
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout
                                  ?.confirm_button
                              )}
                              <span className="text-xl ml-2">
                                {" "}
                                <IoArrowForward />
                              </span>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-28 md:order-2 lg:order-2">
                <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
                  <h2 className="font-semibold font-serif text-lg pb-4">
                    {showingTranslateValue(
                      storeCustomizationSetting?.checkout?.order_summary
                    )}
                  </h2>

                  <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 block">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        currency={currency}
                        shippingCarrier={shippingCarrier}
                        handleShippingCarrier={handleShippingCarrier}
                      />
                    ))}

                    {isEmpty && (
                      <div className="text-center py-10">
                        <span className="flex justify-center my-auto text-gray-500 font-semibold text-4xl">
                          <IoBagHandle />
                        </span>
                        <h2 className="font-medium font-serif text-sm pt-2 text-gray-600">
                          No Item Added Yet!
                        </h2>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-heading last:border-b-0 last:text-base last:pb-0">
                    <form className="w-full">
                      {couponInfo.couponCode || isCouponApplied ? (
                        <span className="bg-emerald-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                          {" "}
                          <p className="text-emerald-600">
                            Coupon Applied{" "}
                          </p>{" "}
                          <span className="text-red-500 text-right">
                            {couponInfo.couponCode}
                          </span>
                        </span>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start justify-end">
                          <input
                            ref={couponRef}
                            type="text"
                            placeholder={t("common:couponCode")}
                            className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-white border-gray-200 focus:ring-0 focus:outline-none focus:border-emerald-500 placeholder-gray-500 placeholder-opacity-75"
                          />
                          <button
                            onClick={handleCouponCode}
                            className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-gray-800 h-12 text-sm lg:text-base w-full sm:w-auto"
                          >
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.apply_button
                            )}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                  <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                    {showingTranslateValue(
                      storeCustomizationSetting?.checkout?.sub_total
                    )}
                    <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                      {currency}
                      {originalPriceWithoutTax?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                    VAT
                    <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                      {currency}

                      {vatTotal?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                    {showingTranslateValue(
                      storeCustomizationSetting?.checkout?.shipping_cost
                    )}
                    <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                      {currency}

                      {parseFloat(shippingCost).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                    {showingTranslateValue(
                      storeCustomizationSetting?.checkout?.discount
                    )}
                    <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                      {currency}
                      {discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t mt-4">
                    <div className="flex items-center font-bold font-serif justify-between pt-5 text-sm uppercase">
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.total_cost
                      )}
                      <span className="font-serif font-extrabold text-lg">
                        {currency}
                        {parseFloat(total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
