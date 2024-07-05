import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import * as dayjs from "dayjs";
import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";

//internal import
import { UserContext } from "@context/UserContext";
import useAsync from "@hooks/useAsync";
import CountryServices from "@services/CountryServices";
import CouponServices from "@services/CouponServices";
import NotificationServices from "@services/NotificationServices";
import OrderServices from "@services/OrderServices";
import SettingServices from "@services/SettingServices";
import CustomerServices from "@services/UserServices";
import { notifyError, notifySuccess } from "@utils/toast";
import useUtilsFunction from "./useUtilsFunction";

const useCheckoutSubmit = (shippingLength) => {
  const {
    state: { userInfo, shippingAddress },
    dispatch,
  } = useContext(UserContext);

  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [address, setAddress] = useState([]);
  const [contact, setContact] = useState([]);
  const [formData, setFormData] = useState({});
  const [findUser, setFindUser] = useState([]);
  const [userError, setUserError] = useState([]);
  const [errorShow, setErrorShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [couponInfo, setCouponInfo] = useState({});
  const [shippingCost, setShippingCost] = useState(0);
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [paypalPayment, setPaypalPayment] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [shippingCarrier, setShippingCarrier] = useState(null);
  const [shippingAddressSave, setShippingAddressSave] = useState(false);
  const [existingShippingAddress, setExistingShippingAddress] = useState(false);
  const [newShippingAddressId, setNewShippingAddressId] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const couponRef = useRef("");
  const { lang } = useTranslation();
  const { isEmpty, emptyCart, items, cartTotal } = useCart();

  const { data: coupons } = useAsync(CouponServices.getShowingCoupons);
  const { data: posSetting } = useAsync(SettingServices.getPosSetting);
  // const { data: storeSetting } = useAsync(
  //   SettingServices.getOnlineStoreSetting
  // );
  const { data: countries } = useAsync(CountryServices.getShowingCountry);
  const { showDateFormat, showingTranslateValue, globalSetting, storeSetting } =
    useUtilsFunction();

  // console.log("allCountries", countries);

  // currency
  const currency = globalSetting?.default_currency;

  const costTotal = items.reduce(
    (pre, cur) => pre + Number(cur.costPrice || 0) * cur.quantity,
    0
  );
  const originalPriceWithTax = items.reduce(
    (pre, cur) => pre + Number(cur.originalPriceWithTax || 0) * cur.quantity,
    0
  );
  const originalPriceWithoutTax = items.reduce(
    (pre, cur) => pre + Number(cur.originalPriceWithoutTax || 0) * cur.quantity,
    0
  );

  const vatTotal = originalPriceWithTax - originalPriceWithoutTax;

  // get user from cookies
  const user = Cookies.get("_userInfo")
    ? JSON.parse(Cookies.get("_userInfo"))
    : {};

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // console.log("costTotal", costTotal, "items", items);

  // invoice number generate get global setting
  let invoiceNumber = "";
  for (let i = 0; i < globalSetting?.invoice_number_leading_zeros; i++) {
    invoiceNumber += "0";
  }
  const submitHandler = async (data) => {
    if (!existingShippingAddress && newShippingAddressId === null) {
      return notifyError("Please Select your Shipping Address");
    }

    if (shippingCarrier || shippingLength === 0) {
      dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: data });
      Cookies.set("_shippingAddress", JSON.stringify(data), {
        sameSite: "None",
        secure: true,
      });
      setError("");
      setErrorShow(false);

      if (!existingShippingAddress && newShippingAddressId) {
        setIsCheckoutSubmit(true);

        let userInfo = {};

        const dataUser = findUser?.shippingAddress?.find(
          (value) => value._id === newShippingAddressId
        );

        userInfo = {
          name: `${data.firstName} ${data.lastName}`,
          contact: data.contact,
          email: data.email,
          address: dataUser.address,
          country: dataUser.country,
          city: dataUser.city,
          zipCode: dataUser.zipCode,
        };

        let orderInfo = {
          user_info: userInfo,
          shippingOption: showingTranslateValue(shippingCarrier?.name),
          paymentMethod: data.paymentMethod,
          status: "Pending",
          cart: items,
          subTotal: originalPriceWithoutTax.toFixed(2),
          costTotal: costTotal.toFixed(2),
          vat: vatTotal.toFixed(2),
          shippingCost: shippingCost,
          discount: discountAmount,
          total: total,
          totalWithTax: total,
          totalWithoutTax: total - vatTotal,
          sellFrom: "SHOP",
          shippingCarrier: shippingCarrier,
          invoiceKey:
            globalSetting?.invoice_number_options === "random"
              ? `${globalSetting?.invoice_number_length}`
              : `${invoiceNumber}-${globalSetting?.invoice_number_start_value}`,
        };

        if (data.paymentMethod === "Card") {
          if (!stripe || !elements) {
            return;
          }

          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
          });

          if (error && !paymentMethod) {
            setError(error.message);
            setIsCheckoutSubmit(false);
          } else {
            setError("");
            const orderData = {
              ...orderInfo,
              cardInfo: paymentMethod,
            };
            handlePaymentWithStripe(orderData);
            return;
          }
        }

        if (data.paymentMethod === "Paypal") {
          const order = Cookies.get("_or");
          const orderData = {
            ...orderInfo,
            cardInfo: JSON.parse(order),
          };
          try {
            const res = await OrderServices.addOrder({
              orderInfo: orderData,
            });

            // notification info
            const notificationInfo = {
              orderId: res._id,
              message: `${res.user_info.name}, Placed ${currency}${parseFloat(
                res.total
              ).toFixed(2)} order!`,
              image:
                "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
            };
            // notification api call
            await NotificationServices.addNotification(notificationInfo);

            if (
              storeSetting?.email_to_customer ||
              storeSetting?.email_to_admins
            ) {
              const updatedData = {
                ...res,
                date: showDateFormat(res.createdAt),
                // logo: posSetting?.logo,
                company_info: {
                  logo: posSetting?.logo,
                  currency: currency,
                  vat_number: posSetting?.invoice_contact_details
                    ? posSetting?.vat_number
                    : globalSetting?.vat_number,
                  company: posSetting?.invoice_contact_details
                    ? showingTranslateValue(posSetting?.shop_name)
                    : showingTranslateValue(globalSetting?.shop_name),
                  address: address?.filter(Boolean),
                  phone: contact?.filter(Boolean),
                  email: posSetting?.invoice_contact_details
                    ? posSetting?.email
                    : globalSetting?.email,
                  website: posSetting?.invoice_contact_details
                    ? posSetting?.website
                    : globalSetting?.website,
                  email_to_customer: storeSetting?.email_to_customer,
                  email_to_admins: storeSetting?.email_to_admins,
                  admin_emails: storeSetting?.admin_emails,
                },
              };
              await OrderServices.sendEmailInvoiceToAdminsAndCustomer(
                updatedData
              );
            }
            router.push(`/order/${res._id}`);
            notifySuccess("Your Order Confirmed!");
            Cookies.remove("_couponInfo");
            Cookies.remove("or");
            emptyCart();
            sessionStorage.removeItem("products");
            setIsCheckoutSubmit(false);
          } catch (err) {
            notifyError(err?.response?.data?.message || err?.message);
            setIsCheckoutSubmit(false);
          }

          return;
        }
        if (data.paymentMethod === "COD") {
          try {
            const res = await OrderServices.addOrder({ orderInfo });
            // console.log("res 2nd COD", res);

            // notification info
            const notificationInfo = {
              orderId: res._id,
              message: `${res.user_info.name}, Placed ${currency}${parseFloat(
                res.total
              ).toFixed(2)} order!`,
              image:
                "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
            };
            // notification api call
            await NotificationServices.addNotification(notificationInfo);

            if (
              storeSetting?.email_to_customer ||
              storeSetting?.email_to_admins
            ) {
              const updatedData = {
                ...res,
                date: showDateFormat(res.createdAt),
                // logo: posSetting?.logo,
                company_info: {
                  logo: posSetting?.logo,
                  currency: currency,
                  vat_number: posSetting?.invoice_contact_details
                    ? posSetting?.vat_number
                    : globalSetting?.vat_number,
                  company: posSetting?.invoice_contact_details
                    ? showingTranslateValue(posSetting?.shop_name)
                    : showingTranslateValue(globalSetting?.shop_name),
                  address: address?.filter(Boolean),
                  phone: contact?.filter(Boolean),
                  email: posSetting?.invoice_contact_details
                    ? posSetting?.email
                    : globalSetting?.email,
                  website: posSetting?.invoice_contact_details
                    ? posSetting?.website
                    : globalSetting?.website,
                  email_to_customer: storeSetting?.email_to_customer,
                  email_to_admins: storeSetting?.email_to_admins,
                  admin_emails: storeSetting?.admin_emails,
                },
              };
              await OrderServices.sendEmailInvoiceToAdminsAndCustomer(
                updatedData
              );
            }

            router.push(`/order/${res._id}`);
            notifySuccess("Your Order Confirmed!");
            Cookies.remove("_couponInfo");
            Cookies.remove("_or");
            sessionStorage.removeItem("products");
            emptyCart();
            setIsCheckoutSubmit(false);
          } catch (err) {
            notifyError(err.message);
            setIsCheckoutSubmit(false);
          }
        }
      } else {
        setModalShow(true);
        setFormData(data);
      }
    } else {
      setErrorShow(true);
      setError("Shipping Carrier is required!");
    }
  };

  const orderSubmitAfterModal = async (message) => {
    const shippingAddress = {
      address: formData.address,
      country: formData.country,
      city: formData.city,
      zipCode: formData.zipCode,
    };

    const userShippingInfo = {
      name: `${formData.firstName} ${formData.lastName}`,
      contact: formData.contact,
      email: formData.email,
      country: formData.country,
      city: formData.city,
      address: formData.address,
      zipCode: formData.zipCode,
    };

    message === "yes" &&
      (await CustomerServices.shippingAddressCreate(user._id, shippingAddress));

    let orderInfo = {
      user_info: userShippingInfo,
      shippingOption: showingTranslateValue(shippingCarrier?.name),
      //  Object.keys(shippingCarrier?.name).includes(lang)
      //   ? shippingCarrier?.name[lang]
      //   : shippingCarrier?.name?.en,
      paymentMethod: formData.paymentMethod,
      status: "Pending",
      cart: items,
      sellFrom: "SHOP",
      subTotal: originalPriceWithoutTax,
      costTotal: costTotal,
      vat: vatTotal,
      shippingCost: shippingCost,
      discount: discountAmount,
      total: total,
      totalWithTax: total,
      totalWithoutTax: total - vatTotal,
      shippingCarrier: shippingCarrier,
      invoiceKey:
        globalSetting?.invoice_number_options === "random"
          ? `${globalSetting?.invoice_number_length}`
          : `${invoiceNumber}-${globalSetting?.invoice_number_start_value}`,
    };

    if (formData.paymentMethod === "Card") {
      if (!stripe || !elements) {
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error && !paymentMethod) {
        setError(error.message);
        setIsCheckoutSubmit(false);
      } else {
        setError("");
        const orderData = {
          ...orderInfo,
          cardInfo: paymentMethod,
        };
        await handlePaymentWithStripe(orderData);
        return;
      }
    }
    if (formData.paymentMethod === "Paypal") {
      console.log("paypal payment PAYPAL");
      const order = Cookies.get("_or");
      const orderData = {
        ...orderInfo,
        cardInfo: JSON.parse(order),
      };

      try {
        const res = await OrderServices.addOrder({
          orderInfo: orderData,
        });
        console.log("res 2nd paypal", res);
        if (storeSetting?.email_to_customer || storeSetting?.email_to_admins) {
          const updatedData = {
            ...res,
            date: showDateFormat(res.createdAt),
            company_info: {
              logo: posSetting?.logo,
              currency: currency,
              vat_number: posSetting?.invoice_contact_details
                ? posSetting?.vat_number
                : globalSetting?.vat_number,
              company: posSetting?.invoice_contact_details
                ? showingTranslateValue(posSetting?.shop_name)
                : showingTranslateValue(globalSetting?.shop_name),
              address: address?.filter(Boolean),
              phone: contact?.filter(Boolean),
              email: posSetting?.invoice_contact_details
                ? posSetting?.email
                : globalSetting?.email,
              website: posSetting?.invoice_contact_details
                ? posSetting?.website
                : globalSetting?.website,
              email_to_customer: storeSetting?.email_to_customer,
              email_to_admins: storeSetting?.email_to_admins,
              admin_emails: storeSetting?.admin_emails,
            },
          };
          await OrderServices.sendEmailInvoiceToAdminsAndCustomer(updatedData);
        }

        router.push(`/order/${res._id}`);
        notifySuccess("Your Order Confirmed!");
        Cookies.remove("_couponInfo");
        Cookies.remove("_or");
        emptyCart();
        sessionStorage.removeItem("products");
        setIsCheckoutSubmit(false);
      } catch (err) {
        notifyError(err?.response?.data?.message || err.message);
        setIsCheckoutSubmit(false);
      }

      return;
    }
    if (formData.paymentMethod === "COD") {
      try {
        const res = await OrderServices.addOrder({ orderInfo });
        // console.log("res 2nd Cod", res);
        if (storeSetting?.email_to_customer || storeSetting?.email_to_admins) {
          const updatedData = {
            ...res,
            date: showDateFormat(res.createdAt),
            // logo: posSetting?.logo,
            company_info: {
              logo: posSetting?.logo,
              currency: currency,
              vat_number: posSetting?.invoice_contact_details
                ? posSetting?.vat_number
                : globalSetting?.vat_number,
              company: posSetting?.invoice_contact_details
                ? showingTranslateValue(posSetting?.shop_name)
                : showingTranslateValue(globalSetting?.shop_name),
              address: address?.filter(Boolean),
              phone: contact?.filter(Boolean),
              email: posSetting?.invoice_contact_details
                ? posSetting?.email
                : globalSetting?.email,
              website: posSetting?.invoice_contact_details
                ? posSetting?.website
                : globalSetting?.website,
              email_to_customer: storeSetting?.email_to_customer,
              email_to_admins: storeSetting?.email_to_admins,
              admin_emails: storeSetting?.admin_emails,
            },
          };
          await OrderServices.sendEmailInvoiceToAdminsAndCustomer(updatedData);
        }

        router.push(`/order/${res._id}`);
        notifySuccess("Your Order Confirmed!");
        Cookies.remove("_couponInfo");
        Cookies.remove("_or");
        sessionStorage.removeItem("products");
        emptyCart();
        setIsCheckoutSubmit(false);
      } catch (err) {
        notifyError(err.message);
        setIsCheckoutSubmit(false);
      }
    }
  };

  const handlePaymentWithStripe = async (order) => {
    try {
      const res = await OrderServices.createPaymentIntent(order);
      stripe.confirmCardPayment(res.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      const orderData = {
        ...order,
        cardInfo: res,
      };

      const res1 = await OrderServices.addOrder({
        orderInfo: orderData,
      });
      // notification info
      const notificationInfo = {
        orderId: res1._id,
        message: `${res1.user_info.name}, Placed ${currency}${parseFloat(
          res1.total
        ).toFixed(2)} order!`,
        image:
          "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
      };
      // notification api call
      await NotificationServices.addNotification(notificationInfo);

      if (storeSetting?.email_to_customer || storeSetting?.email_to_admins) {
        const updatedData = {
          ...res1,
          date: showDateFormat(res.createdAt),
          // logo: posSetting?.logo,
          company_info: {
            logo: posSetting?.logo,
            currency: currency,
            vat_number: posSetting?.invoice_contact_details
              ? posSetting?.vat_number
              : globalSetting?.vat_number,
            company: posSetting?.invoice_contact_details
              ? showingTranslateValue(posSetting?.shop_name)
              : showingTranslateValue(globalSetting?.shop_name),
            address: address?.filter(Boolean),
            phone: contact?.filter(Boolean),
            email: posSetting?.invoice_contact_details
              ? posSetting?.email
              : globalSetting?.email,
            website: posSetting?.invoice_contact_details
              ? posSetting?.website
              : globalSetting?.website,
            email_to_customer: storeSetting?.email_to_customer,
            email_to_admins: storeSetting?.email_to_admins,
            admin_emails: storeSetting?.admin_emails,
          },
        };
        await OrderServices.sendEmailInvoiceToAdminsAndCustomer(updatedData);
      }

      router.push(`/order/${res1._id}`);
      notifySuccess("Your Order Confirmed!");
      Cookies.remove("_couponInfo");
      Cookies.remove("_or");
      emptyCart();
      sessionStorage.removeItem("products");
      setIsCheckoutSubmit(false);
    } catch (err) {
      console.log("err", err?.message);
      notifyError(err?.response?.data?.message || err?.message);
      setIsCheckoutSubmit(false);
    }
  };

  const handlePaymentWithPaypal = (order) => {
    Cookies.set("_or", JSON.stringify(order), {
      sameSite: "None",
      secure: true,
    });
    setValue("paymentMethod", "Paypal");
    setPaypalPayment(true);
    notifySuccess("Your Payment Confirmed, now confirm the order!");
  };

  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    const result = coupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`
      );
      return;
    } else {
      notifySuccess(
        `Your Coupon ${result[0].couponCode} is Applied on ${result[0].productType}!`
      );
      setIsCouponApplied(true);
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountPercentage(result[0].discountType);
      dispatch({ type: "SAVE_COUPON", payload: result[0] });
      Cookies.set("_couponInfo", JSON.stringify(result[0]), {
        sameSite: "None",
        secure: true,
      });
    }
  };

  const handleShippingCarrier = (data) => {
    setShippingCarrier(data);

    // weight data
    let weightData = items.map((item) => item.quantity * item?.weight || null);

    // total weight
    const totalWeight = weightData.reduce(
      (previout, currentValue) => previout + currentValue,
      0
    );

    // find country and zone name
    const countryName = watch("country");
    const findDataCountry = countries?.find(
      (country) => country.name[lang] === countryName
    );

    // find range name
    const findRangeData = data?.ranges?.find(
      (item) => item.name === findDataCountry?.zone
    );

    let shippingCost;
    if (data) {
      shippingCost = findRangeData?.range?.find((rag) => {
        if (
          Number(rag.start) >= totalWeight ||
          Number(rag.end) >= totalWeight
        ) {
          console.log("rag", rag);
          return rag;
        }
      });
    }

    let totalShippingCost = {};
    if (shippingCost) {
      totalShippingCost = shippingCost;
    } else if (
      data.out_of_range_behavior ===
      "apply-the-cost-of-the-highest-defined-range"
    ) {
      let totalShippingData =
        data.ranges[4].range[data.ranges[4].range.length - 1];
      totalShippingCost =
        totalShippingData.cost === "" ? { cost: 0 } : totalShippingData;
    } else {
      totalShippingCost = { cost: 0 };
    }

    setShippingCost(totalShippingCost.cost);
  };

  useEffect(() => {
    if (Cookies.get("_couponInfo")) {
      const coupon = JSON.parse(Cookies.get("_couponInfo"));

      setCouponInfo(coupon);
      setDiscountPercentage(coupon ? coupon.discountType : 0);
      setMinimumAmount(coupon ? coupon.minimumAmount : 0);
    }
    // find user data from id
    CustomerServices.getCustomerById(user._id)
      .then((res) => setFindUser(res))
      .catch((error) => setUserError(error.message));
  }, []);

  //remove coupon if total value less then minimum amount of coupon
  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(0);
      Cookies.remove("_couponInfo");
      Cookies.remove("_or");
    }
  }, [minimumAmount, total]);

  //calculate total and discount value
  useEffect(() => {
    const discountProductTotal = items?.reduce(
      (preValue, currentValue) => preValue + currentValue.itemTotal,
      0
    );

    let totalValue = 0;
    let subTotal = parseFloat(
      originalPriceWithTax + Number(shippingCost)
    ).toFixed(2);

    const discountAmount =
      discountPercentage?.type === "fixed"
        ? discountPercentage?.value
        : discountProductTotal * (discountPercentage?.value / 100);

    // user discount
    let userDiscount = 0;

    if (user?.discount_from === "individual") {
      const defaultDiscountItems =
        user?.discount?.default === "categories" &&
        (user?.discount?.location === "shop_only" ||
          user?.discount?.location === "pos_and_shop")
          ? cartItem.filter((value) =>
              user?.discount?.categories?.includes(value.category)
            )
          : user?.discount?.default === "all" &&
            (user?.discount?.location === "shop_only" ||
              user?.discount?.location === "pos_and_shop")
          ? cartItem
          : user?.discount?.location === "shop_only" ||
            user?.discount?.location === "pos_and_shop"
          ? cartItem.filter((value) =>
              value.productType.includes(user?.discount?.default)
            )
          : [];

      const defaultAllPrices = defaultDiscountItems?.reduce(
        (pre, cur) => pre + Number(cur.price) * cur.quantity,
        0
      );

      const getDiscount =
        defaultDiscountItems?.length === 0
          ? 0
          : user?.discount?.option === "percentage"
          ? (defaultAllPrices * Number(user?.discount?.value)) / 100
          : Number(user?.discount?.value);

      if (user?.minimumOrderAmount <= originalPriceWithoutTax) {
        userDiscount =
          getDiscount <= user?.maximumDiscountAmount
            ? getDiscount
            : Number(user?.maximumDiscountAmount) || 0;
      } else {
        userDiscount = 0;
      }
    } else {
      const discountFilter = user?.groups
        ?.map((value) => value.rules)
        ?.sort((a, b) => a.priority - b.priority)
        ?.filter((item) => {
          if (
            item?.discount?.default === "all" &&
            (item?.discount?.location === "shop_only" ||
              item?.discount?.location === "pos_and_shop")
          ) {
            return item;
          } else if (
            item?.discount?.default === "categories" &&
            (item?.discount?.location === "shop_only" ||
              item?.discount?.location === "pos_and_shop")
          ) {
            return item;
          }
          return item;
        });

      const findDataInGroupRules = user?.groups
        ?.map((value) => value.rules)
        ?.sort((a, b) => a.priority - b.priority)
        ?.find((item) => {
          if (
            item?.discount?.default === "all" &&
            (item?.discount?.location === "shop_only" ||
              item?.discount?.location === "pos_and_shop")
          ) {
            return item;
          } else if (
            item?.discount?.default === "categories" &&
            (item?.discount?.location === "shop_only" ||
              item?.discount?.location === "pos_and_shop")
          ) {
            return item;
          }
          return item;
        });

      const defaultDiscountItems =
        findDataInGroupRules?.discount?.default === "categories" &&
        (findDataInGroupRules?.discount?.location === "shop_only" ||
          findDataInGroupRules?.discount?.location === "pos_and_shop")
          ? cartItem.filter((value) =>
              findDataInGroupRules?.discount?.categories?.includes(
                value.category
              )
            )
          : findDataInGroupRules?.discount?.default === "all" &&
            (findDataInGroupRules?.discount?.location === "shop_only" ||
              findDataInGroupRules?.discount?.location === "pos_and_shop")
          ? cartItem
          : findDataInGroupRules?.discount?.location === "shop_only" ||
            findDataInGroupRules?.discount?.location === "pos_and_shop"
          ? cartItem.filter((value) =>
              value.productType.includes(
                findDataInGroupRules?.discount?.default
              )
            )
          : [];

      const defaultAllPrices = defaultDiscountItems?.reduce(
        (pre, cur) => pre + Number(cur.price) * cur.quantity,
        0
      );

      const discountAmount = discountFilter
        ?.filter((item) => item.minimumOrderAmount <= originalPriceWithoutTax)
        ?.reduce((pre, cur) => pre + Number(cur.maximumDiscountAmount), 0);

      const getDiscount =
        defaultDiscountItems?.length === 0
          ? 0
          : findDataInGroupRules?.discount?.option === "percentage"
          ? (defaultAllPrices * Number(findDataInGroupRules?.discount?.value)) /
            100
          : Number(findDataInGroupRules?.discount?.value);

      if (findDataInGroupRules?.minimumOrderAmount <= originalPriceWithoutTax) {
        userDiscount =
          getDiscount <= findDataInGroupRules?.maximumDiscountAmount
            ? getDiscount
            : discountAmount || 0;
      } else {
        userDiscount = 0;
      }
    }

    const discountAmountTotal = discountAmount
      ? discountAmount + userDiscount
      : 0;

    totalValue = Number(subTotal) - discountAmountTotal;

    setDiscountAmount(discountAmountTotal);

    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage]);

  //if not login then push user to home page
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
    if (Cookies.get("_or")) {
      setValue("paymentMethod", "Paypal");
      setPaypalPayment(true);
    }

    setValue("firstName", shippingAddress.firstName);
    setValue("lastName", shippingAddress.lastName);
    setValue("address", shippingAddress.address);
    setValue("contact", shippingAddress.contact);
    setValue("email", shippingAddress.email);
    setValue("city", shippingAddress.city);
    setValue("country", shippingAddress.country);
    setValue("zipCode", shippingAddress.zipCode);
  }, []);

  useEffect(() => {
    if (posSetting?.invoice_contact_details) {
      setAddress([
        showingTranslateValue(posSetting?.address_one),
        showingTranslateValue(posSetting?.address_two),
        showingTranslateValue(posSetting?.address_three),
      ]);

      setContact([posSetting?.contact_one, posSetting?.contact_two]);
    } else {
      setAddress([
        globalSetting?.address_one ? globalSetting?.address_one[lang] : "",
        globalSetting?.address_two ? globalSetting?.address_two[lang] : "",
        globalSetting?.address_three ? globalSetting?.address_three[lang] : "",
      ]);

      setContact([globalSetting?.contact_one, globalSetting?.contact_two]);
    }
  }, [posSetting, globalSetting, lang]);

  return {
    userInfo,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    register,
    errors,
    showCard,
    setShowCard,
    error,
    errorShow,
    stripe,
    couponInfo,
    couponRef,
    storeSetting,
    handleCouponCode,
    discountPercentage,
    discountAmount,
    shippingCost,
    total,
    isEmpty,
    items,
    vatTotal,
    currency,
    originalPriceWithoutTax,
    watch,
    cartTotal,
    isCheckoutSubmit,
    setIsCheckoutSubmit,
    handleShippingCarrier,
    handlePaymentWithPaypal,
    paypalPayment,
    setPaypalPayment,
    shippingCarrier,
    setShippingAddressSave,
    shippingAddressSave,
    existingShippingAddress,
    setExistingShippingAddress,
    newShippingAddressId,
    setNewShippingAddressId,
    findUser,
    userError,
    modalShow,
    setModalShow,
    isCouponApplied,
    orderSubmitAfterModal,
  };
};

export default useCheckoutSubmit;
