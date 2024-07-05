import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IoBagHandle } from "react-icons/io5";
import ReactPaginate from "react-paginate";

//internal import
import OrderHistory from "@component/order/OrderHistory";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Dashboard from "@pages/user/dashboard";
import OrderServices from "@services/OrderServices";

const MyOrders = () => {
  const router = useRouter();
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const { currentPage, handleChangePage, isLoading, setIsLoading } =
    useContext(SidebarContext);

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderServices.getOrderByCustomer({
          limit: 8,
          page: currentPage,
          sellFrom: "SHOP",
          user: userInfo?._id,
        });

        setData(res);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    })();
  }, [currentPage]);

  const pageCount = Math.ceil(data?.totalDoc / 8);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //============== Language Select RMK (Translate) =================//
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard
          title={showingTranslateValue(
            storeCustomizationSetting?.dashboard?.my_order
          )}
          description="This is user order history page"
        >
          <div className="overflow-hidden rounded-md font-serif">
            {loading ? (
              <Loading loading={loading} />
            ) : error ? (
              <h2 className="text-2xl text-center my-10 mx-auto w-11/12">
                {error}
              </h2>
            ) : data?.orders.length === 0 ? (
              <div className="text-center">
                <span className="flex justify-center my-30 pt-16 text-emerald-500 font-semibold text-6xl">
                  <IoBagHandle />
                </span>
                <h2 className="font-medium text-md my-4 text-gray-600">
                  {t("common:noOrder")}
                </h2>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-xl font-serif font-semibold mb-5">
                  {showingTranslateValue(
                    storeCustomizationSetting?.dashboard?.my_order
                  )}
                </h2>

                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                      <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr className="bg-gray-100">
                            <th
                              scope="col"
                              className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:id")}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:oderTime")}
                            </th>

                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:method")}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:status")}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:total")}
                            </th>
                            <th
                              scope="col"
                              className="text-right text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:action")}
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {data?.orders.map((order) => (
                            <tr key={order._id}>
                              <OrderHistory order={order} />

                              <td className="px-5 py-3 whitespace-nowrap text-center text-sm order-link">
                                <div className="flex justify-end items-center gap-3">
                                  <Link
                                    href={`/order/${order._id}`}
                                    className="px-3 py-1 bg-blue-100 text-xs text-blue-600  hover:text-blue-400 transition-all font-semibold rounded-full"
                                  >
                                    {t("common:invoice")}
                                  </Link>{" "}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {data?.orders?.length > 10 && (
                        <div className="paginationOrder">
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel={t("common:next")}
                            onPageChange={(e) =>
                              handleChangePage(e.selected + 1)
                            }
                            pageRangeDisplayed={3}
                            pageCount={pageCount}
                            previousLabel={t("common:previous")}
                            renderOnZeroPageCount={null}
                            pageClassName="page--item"
                            pageLinkClassName="page--link"
                            previousClassName="page-item"
                            previousLinkClassName="page-previous-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-next-link"
                            breakClassName="page--item"
                            breakLinkClassName="page--link"
                            containerClassName="pagination"
                            activeClassName="activePagination"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dashboard>
      )}
    </>
  );
};

export default MyOrders;
