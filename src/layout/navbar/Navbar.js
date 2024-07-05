import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FiBell, FiShoppingCart, FiUser } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import
import CartDrawer from "@component/drawer/CartDrawer";
import LoginModal from "@component/modal/LoginModal";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import NavbarPromo from "@layout/navbar/NavbarPromo";
import ProductServices from "@services/ProductServices";

const Navbar = ({}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const { isLoading, setIsLoading, toggleCartDrawer } =
    useContext(SidebarContext);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  // react hook
  const [imageUrl, setImageUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchDataShow, setSearchDataShow] = useState(true);

  const {
    state: { userInfo },
  } = useContext(UserContext);

  // handle Search product title
  const handleSearchProduct = async (search) => {
    try {
      if (search.length > 0) {
        setSearchText(search);
        setSearchDataShow(true);

        const res = await ProductServices.getShowingStoreProducts({
          category: "",
          title: search,
          cname: Cookies.get("_cname"),
        });
        const masterProduct = res?.products?.filter(
          (product) =>
            (product.masterProduct.length !== 0 &&
              product.isMasterProduct === false) ||
            product.isMasterProduct === true
        );
        // console.log('res', res);
        setProducts(masterProduct);
      } else {
        setProducts([]);
        setSearchText("");
        setSearchDataShow(false);
      }
    } catch (err) {
      console.log("error when search product", err);
    }
  };

  // handle search set to empty
  const handleSearchClick = (text) => {
    setSearchText(text);
    setSearchDataShow(false);
    setIsLoading(true);

    if (text) {
      router.push(`/search?title=${text.toLowerCase().replace(/\s/g, "+")}`);
    } else {
      router.push(`/ `, null, { scroll: false });
    }
  };

  // handle search submit
  const handleSubmit = (e) => {
    setSearchDataShow(false);
    e.preventDefault();
    if (searchText) {
      router.push(
        `/search?title=${searchText.toLowerCase().replace(/\s/g, "+")}`
      );
    } else {
      router.push(`/ `, null, { scroll: false });
    }
  };

  useEffect(() => {
    if (Cookies.get("_userInfo")) {
      const user = JSON.parse(Cookies.get("_userInfo"));
      setImageUrl(user.image);
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      <CartDrawer />

      {modalOpen && (
        <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}

      <div
        style={{
          backgroundColor:
            storeCustomizationSetting?.color?.bg_header_middle?.hex,
        }}
        className="bg-gray-800 sticky top-0 z-50"
      >
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
          <div className="top-bar h-16 lg:h-auto flex items-center justify-between py-4 mx-auto">
            <Link href="/">
              <button
                onClick={() => setIsLoading(!isLoading)}
                type="button"
                className="mr-3 lg:mr-12 xl:mr-12 hidden md:hidden lg:block"
              >
                <Image
                  width={150}
                  height={43}
                  src={
                    storeCustomizationSetting?.navbar?.logo ||
                    "/logo/cc-logo.png"
                  }
                  alt="logo"
                  className="object-contain"
                />
              </button>
            </Link>
            <div className="w-full transition-all duration-200 ease-in-out lg:flex lg:max-w-[520px] xl:max-w-[750px] 2xl:max-w-[900px] md:mx-12 lg:mx-4 xl:mx-0">
              <div className="w-full flex flex-col justify-center flex-shrink-0 relative z-30">
                <div className="flex flex-col mx-auto w-full">
                  <form
                    onSubmit={handleSubmit}
                    className="relative pr-12 md:pr-14 bg-white overflow-hidden shadow-sm rounded-md w-full"
                  >
                    <label className="flex items-center py-0.5">
                      <input
                        onChange={(e) => handleSearchProduct(e.target.value)}
                        value={searchText}
                        className="form-input w-full pl-5 appearance-none transition ease-in-out border text-input text-sm font-sans rounded-md min-h-10 h-10 duration-200 bg-white focus:ring-0 outline-none border-none focus:outline-none placeholder-gray-500 placeholder-opacity-75"
                        placeholder={t("common:Top-Search")}
                      />
                    </label>
                    <button
                      aria-label="Search"
                      type="submit"
                      className="outline-none text-xl text-gray-400 absolute top-0 right-0 end-0 w-12 md:w-14 h-full flex items-center justify-center transition duration-200 ease-in-out hover:text-heading focus:outline-none"
                    >
                      <IoSearchOutline />
                    </button>
                  </form>
                  {/* auto complete search data show */}
                  {products.length !== 0 && searchDataShow && (
                    <div
                      className=" absolute bg-white max-h-56 w-full border border-gray-200 rounded-br overflow-y-scroll rounded-bl py-1"
                      style={{ top: 38 }}
                    >
                      {products.slice(0, 10).map((product, index) => (
                        <div
                          onClick={(e) => handleSearchClick(e.target.innerText)}
                          className="px-3 py-1 cursor-pointer hover:bg-green-300 text-base font-medium"
                          key={index + 1}
                        >
                          {showingTranslateValue(product?.title)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:hidden md:items-center text-center my-auto justify-center lg:flex xl:block absolute inset-y-0 right-0 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                className="pr-5 text-white text-2xl font-bold"
                aria-label="Alert"
              >
                <FiBell className="w-6 h-6 drop-shadow-xl" />
              </button>{" "}
              {/* <button
                className="text-white text-2xl font-bold"
                aria-label="Alert"
              >
                <FiBell className="w-6 h-6 drop-shadow-xl" />
              </button> */}
              <button
                aria-label="Total"
                onClick={toggleCartDrawer}
                className="relative px-5 text-white text-2xl font-bold"
              >
                <span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-medium leading-none text-red-100 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {totalItems}
                </span>
                <FiShoppingCart className="w-6 h-6 drop-shadow-xl" />
              </button>
              {/* Profile dropdown */}
              <button
                className="pl-5 text-white text-2xl font-bold login text-center my-auto justify-center"
                aria-label="Login"
              >
                {(imageUrl || userInfo?.image) && !error ? (
                  <span
                    onClick={() => {
                      // setIsLoading(!isLoading);
                      router.push("/user/dashboard");
                    }}
                    className="w-6"
                  >
                    <Image
                      width={29}
                      height={29}
                      onError={setError}
                      src={imageUrl || userInfo?.image}
                      alt="user"
                      className="bg-white rounded-full"
                    />
                  </span>
                ) : userInfo?.name ? (
                  <span
                    onClick={() => {
                      // setIsLoading(!isLoading);
                      router.push("/user/dashboard");
                    }}
                    className="leading-none font-bold font-serif block"
                  >
                    {userInfo?.name[0]}
                  </span>
                ) : (
                  <span onClick={() => setModalOpen(!modalOpen)}>
                    <FiUser className="w-6 h-6 drop-shadow-xl" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* second header */}
        <NavbarPromo />
      </div>
    </>
  );
};
export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
