import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

//internal import
import useAddToCart from "./useAddToCart";
import { notifyError } from "@utils/toast";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const useProductModal = ({
  product,
  modalOpen,
  attributes,
  setModalOpen,
  setRelatedProduct,
}) => {
  const router = useRouter();
  const { handleAddItem, setItem, item } = useAddToCart();
  const { lang, showingTranslateValue, getNumber } = useUtilsFunction();

  const extraCart = useSelector((state) => state.extraCart.extraCartItem);

  const [image, setImage] = useState("");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPriceWithTax, setOriginalPriceWithTax] = useState(0);
  const [originalPriceWithoutTax, setOriginalPriceWithoutTax] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [volume, setVolume] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [unit, setUnit] = useState("ml");
  const [discount, setDiscount] = useState("");
  const [selectVariant, setSelectVariant] = useState({});
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectExtra, setSelectExtra] = useState([]);
  const [selectEx, setSelectEx] = useState([]);
  const [extrasTitle, setExtrasTitle] = useState([]);
  const [extras, setExtras] = useState([]);
  const [notes, setNotes] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (p, event) => {
    if (p.variants.length === 1 && p.variants[0].quantity < 1)
      return notifyError("Insufficient stock");

    if (stock <= 0) return notifyError("Insufficient stock");

    if (
      product?.variants.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      // const selectVariantTitle = variantTitle?.map((att) =>
      //   att.variants?.find((v) => v._id === selectVariant[att._id])
      // );

      const {
        // variants,
        slug,
        categories,
        description,
        relatedCategories,
        relatedProducts,

        ...newObj
      } = product;

      const newItem = {
        ...newObj,
        id: `${
          product?.variants.length <= 1 &&
          product?.extras?.length < 1 &&
          product?.productType?.includes("others")
            ? product?._id
            : product?._id +
              variantTitle?.map((att) => selectVariant[att?._id]).join("-") +
              selectEx +
              notes
        }`,
        title: `${
          product?.variants.length <= 1 && product?.extras?.length < 1
            ? showingTranslateValue(product?.title)
            : showingTranslateValue(product?.title) +
              "-" +
              variantTitle
                ?.map((att) =>
                  att.variants?.find((v) => v?._id === selectVariant[att?._id])
                )
                .map((el) => showingTranslateValue(el?.name))
        }`,
        variant:
          product?.variants.length === 0 ? product?.prices : selectVariant,
        price:
          product?.variants.length <= 0 && product?.extras?.length <= 0
            ? getNumber(product?.prices.originalPriceWithTax)
            : getNumber(price),
        originalPriceWithTax:
          product?.variants.length <= 0 && product?.extras?.length <= 0
            ? getNumber(product?.prices.originalPriceWithTax)
            : getNumber(originalPriceWithTax),
        originalPriceWithoutTax:
          product?.variants.length <= 0 && product?.extras?.length <= 0
            ? getNumber(product?.prices.originalPriceWithoutTax)
            : getNumber(originalPriceWithoutTax),
        costPrice: getNumber(costPrice),
        notes: notes,
        extras: extraCart,
      };

      console.log("newItem", newItem);

      handleAddItem(newItem);
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  const handleMoreInfo = (slug, option) => {
    if (option === "relatedProduct") {
      setModalOpen(false);
      router.push(`/product/${slug}?relatedProduct=${option}`);
      setIsLoading(!isLoading);
    } else {
      setModalOpen(false);
      router.push(`/product/${slug}`);
      setIsLoading(!isLoading);
    }
  };

  const removeNote = (indexToRemove) => {
    setNotes([...notes.filter((_, index) => index !== indexToRemove)]);
  };

  const addNote = (event) => {
    if (event.target.value !== "") {
      setNotes([...notes, event.target.value]);
      setNotes([...notes, event.target.value]);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      const res = result?.map(
        ({
          price,
          costPrice,
          salePrice,
          discount,
          quantity,
          barcode,
          totalVolume,
          sku,
          inUse,
          inUseOrder,
          volume,
          unit,
          id,
          productId,
          image,
          originalPrice,
          impactOnPriceWithTax,
          impactOnPriceWithoutTax,
          originalPriceWithTax,
          originalPriceWithoutTax,
          ...rest
        }) => ({ ...rest })
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      const result2 = result?.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      if (result.length <= 0 || result2 === undefined) return setStock(0);

      // console.log("result2", result2);

      setVariants(result);
      // setNotAvailable(false);
      setSelectVariant(result2);
      setSelectVa(result2);
      setPrice(extrasPrice + Number(result2?.price));
      setOriginalPriceWithTax(
        extrasPrice + Number(result2?.originalPriceWithTax)
      );
      setOriginalPriceWithoutTax(
        extrasPrice + Number(result2?.originalPriceWithoutTax)
      );
      setCostPrice(result2.costPrice);
      setStock(result2?.quantity);
      setVolume(result2?.volume);
      setTotalVolume(result2?.totalVolume);
      setUnit(result2?.unit);
      setDiscount(Number(result2?.discount));
      setImage(result2?.image);
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );
      setVariants(result);
      setExtras(product?.extras);
      setPrice(Number(product?.variants[0]?.price) + extrasPrice);
      setOriginalPriceWithTax(
        Number(product?.variants[0]?.originalPriceWithTax) + extrasPrice
      );
      setOriginalPriceWithoutTax(
        Number(product?.variants[0]?.originalPriceWithoutTax) + extrasPrice
      );
      setCostPrice(Number(product?.variants[0]?.costPrice));
      setStock(product?.variants[0]?.quantity);
      setVolume(product?.variants[0]?.volume);
      setTotalVolume(product?.variants[0]?.totalVolume);
      setUnit(product?.variants[0]?.unit);
      setDiscount(Number(product?.variants[0]?.discount));
      setSelectVariant(product?.variants[0]);
      setSelectVa(product?.variants[0]);
      setImage(product?.image[0]);
    } else {
      setExtras(product?.extras);
      setPrice(Number(product?.prices?.price) + extrasPrice);
      setOriginalPriceWithTax(
        Number(product?.prices?.originalPriceWithTax) + extrasPrice
      );
      setOriginalPriceWithoutTax(
        Number(product?.prices?.originalPriceWithoutTax) + extrasPrice
      );
      setCostPrice(product?.prices?.costPrice);
      setStock(product?.stock);
      setVolume(product?.measurement?.volume);
      setTotalVolume(product?.measurement?.totalVolume);
      setUnit(product?.measurement?.unit);
      setDiscount(Number(product?.prices?.discount));
      setImage(product?.image[0]);
    }
  }, [
    extrasPrice,
    product?.extras,
    product?.measurement?.totalVolume,
    product?.measurement?.volume,
    product?.prices?.discount,
    product?.prices?.originalPriceWithTax,
    product?.prices?.originalPriceWithoutTax,
    product?.prices?.price,
    product?.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  useEffect(() => {
    const res = Object?.keys(Object?.assign({}, ...product?.variants));
    const res2 = Object?.keys(Object?.assign({}, ...(extras ? extras : [])));

    const varTitle = attributes?.filter((att) => res.includes(att?._id));
    const extraTitle = attributes?.filter((att) => res2?.includes(att?._id));

    setVariantTitle(varTitle?.sort());
    setExtrasTitle(extraTitle);
  }, [variants, attributes, extras]);

  useEffect(() => {
    if (!modalOpen) {
      setRelatedProducts([]);
      setRelatedProduct({});
      setCategory({});
    }

    if (product?.relatedProducts?.length > 0) {
      ProductServices.getRelatedProducts({
        ids: product?.relatedProducts,
        option: "product",
      })
        .then((res) => {
          setLoading(false);
          setRelatedProducts(res?.products);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err.message);
        });
    } else {
      setLoading(false);
    }
  }, [modalOpen, product?.relatedProducts]);

  // console.log("product", product, "categories", categories, "value", value);

  const category_name = showingTranslateValue(product?.category?.name)
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-");
  return {
    lang,
    setItem,
    item,
    unit,
    stock,
    notes,
    price,
    volume,
    loading,
    addNote,
    discount,
    setValue,
    extrasPrice,
    extrasTitle,
    removeNote,
    selectEx,
    setSelectEx,
    selectExtra,
    setSelectVa,
    setExtrasPrice,
    selectVariant,
    setSelectVariant,
    setSelectExtra,
    totalVolume,
    variantTitle,
    category_name,
    handleAddToCart,
    relatedProducts,
    showingTranslateValue,
  };
};

export default useProductModal;
