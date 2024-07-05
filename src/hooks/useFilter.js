import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import useUtilsFunction from "./useUtilsFunction";

const useFilter = (data) => {
  // next router
  const router = useRouter();
  // custom hook
  const { showingTranslateValue } = useUtilsFunction();

  // react hook
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("");
  const [value, setValue] = useState("");

  const productData = useMemo(() => {
    let services = data;
    //filter user order
    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
    }

    //service sorting with low and high price
    if (sortedField === "low") {
      services = services.sort((a, b) => a.prices.price - b.prices.price);
    }
    if (sortedField === "high") {
      services = services.sort((a, b) => b.prices.price - a.prices.price);
    }

    if (sortedField === "alphabetically") {
      services = services.sort((a, b) =>
        showingTranslateValue(a.title).localeCompare(
          showingTranslateValue(b.title)
        )
      );
    }
    // if (sortedField === "best-selling") {
    //   services = services.sort((a,b) => );
    // }

    if (value) {
      services = services.filter((variant) =>
        variant.colors.toLowerCase().includes(value.toLowerCase())
      );
    }

    //product filtering
    // if (Category) {
    //   services = services.filter(
    //     (product) =>
    //       product.parent.toLowerCase().replace('&', '').split(' ').join('-') ===
    //       Category
    //   );
    // }
    // if (category) {
    //   services = services.filter(
    //     (product) =>
    //       product.children
    //         .toLowerCase()
    //         .replace('&', '')
    //         .split(' ')
    //         .join('-') === category
    //   );
    // }
    // if (query) {
    //   services = services.filter((product) =>
    //     product.title.toLowerCase().includes(query.toLowerCase())
    //   );
    // }

    return services;
  }, [sortedField, data, value]);

  return {
    productData,
    pending,
    processing,
    delivered,
    setSortedField,
    value,
    setValue,
  };
};

export default useFilter;
