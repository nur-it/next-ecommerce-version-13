import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import {
  FiCheck,
  FiFileText,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSettings,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiUnlock,
} from "react-icons/fi";

//internal import
import Card from "@component/order-card/Card";
import RecentOrder from "@component/order/RecentOrder";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import useAsync from "@hooks/useAsync";
import useFilter from "@hooks/useFilter";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Layout from "@layout/Layout";
import OrderServices from "@services/OrderServices";

const Dashboard = ({ title, description, children }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, setIsLoading } = useContext(SidebarContext);

  const {
    dispatch,
    state: { userInfo },
  } = useContext(UserContext);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  const { data } = useAsync(() =>
    OrderServices.getOrderByCustomer({
      limit: 8,
      sellFrom: "SHOP",
      user: userInfo?._id,
    })
  );
  const { pending, processing, delivered } = useFilter(data?.orders);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("_userInfo");
    Cookies.remove("_couponInfo");
    router.push("/");
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const userSidebar = [
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.dashboard_title
      ),
      href: "/user/dashboard",
      icon: FiGrid,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.my_order
      ),
      href: "/user/my-orders",
      icon: FiList,
    },
    {
      title: "My Reviews",
      href: "/user/reviews",
      icon: FiStar,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      ),
      href: "/user/update-profile",
      icon: FiSettings,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.shipping_address
      ),
      href: "/user/shipping-address",
      icon: FiTruck,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      ),
      href: "/user/change-password",
      icon: FiFileText,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={title ? title : t("common:dashboard")}
          description={description ? description : t("common:dashboardText")}
        >
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="py-10 lg:py-12 flex flex-col lg:flex-row w-full">
              <div className="flex-shrink-0 w-full lg:w-80 mr-7 lg:mr-10 xl:mr-10">
                <div className="bg-white p-4 sm:p-5 lg:p-8 rounded-md sticky top-32 navBar">
                  {userSidebar?.map((item) => (
                    <span
                      key={item.title}
                      className="p-2 my-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-emerald-600"
                    >
                      <item.icon
                        className="flex-shrink-0 h-4 w-4"
                        aria-hidden="true"
                      />
                      <Link
                        href={item.href}
                        className="inline-flex items-center justify-between ml-2 text-sm font-medium w-full hover:text-emerald-600"
                      >
                        {item.title}
                      </Link>
                    </span>
                  ))}

                  <span className="p-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-emerald-600">
                    <span className="mr-2">
                      <FiUnlock />
                    </span>{" "}
                    <button
                      onClick={handleLogOut}
                      className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-emerald-600"
                    >
                      {showingTranslateValue(
                        storeCustomizationSetting?.navbar?.logout
                      )}
                    </button>
                  </span>
                </div>
              </div>

              <div className="w-full bg-white mt-4 lg:mt-0 p-4 sm:p-5 lg:p-8 rounded-md overflow-hidden">
                {!children && (
                  <div className="overflow-hidden">
                    <h2 className="text-xl font-serif font-semibold mb-5">
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.dashboard_title
                      )}
                    </h2>

                    <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.total_order
                        )}
                        Icon={FiShoppingCart}
                        quantity={data?.orders?.length}
                        className="text-red-600  bg-red-200"
                      />
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.pending_order
                        )}
                        Icon={FiRefreshCw}
                        quantity={pending?.length}
                        className="text-orange-600 bg-orange-200"
                      />
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.processing_order
                        )}
                        Icon={FiTruck}
                        quantity={processing?.length}
                        className="text-indigo-600 bg-indigo-200"
                      />
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.complete_order
                        )}
                        Icon={FiCheck}
                        quantity={delivered?.length}
                        className="text-emerald-600 bg-emerald-200"
                      />
                    </div>

                    <RecentOrder userInfo={userInfo} />
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
