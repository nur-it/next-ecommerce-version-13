import { PDFDownloadLink } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { IoCloudDownloadOutline, IoPrintOutline } from "react-icons/io5";
import ReactToPrint from "react-to-print";
//internal import
import Invoice from "@component/invoice/Invoice";
import InvoiceForDownload from "@component/invoice/InvoiceForDownload";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Layout from "@layout/Layout";
import OrderServices from "@services/OrderServices";

const Order = ({ params }) => {
  const printRef = useRef();
  const orderId = params.id;
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const { showingTranslateValue, currency, getNumberTwo } = useUtilsFunction();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderServices.getOrderById(orderId);

        setData(res?.order);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("err", err.message);
      }
    })();

    if (!userInfo) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="Invoice" description="order confirmation page">
      {loading && !data ? (
        <Loading loading={loading} />
      ) : (
        <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
          <div className="bg-emerald-100 rounded-md mb-5 px-4 py-3">
            <label>
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_first
              )}{" "}
              <span className="font-bold text-emerald-600">
                {data?.user_info?.name},
              </span>{" "}
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_last
              )}
            </label>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <Invoice data={data} printRef={printRef} />

            <div className="bg-white p-8 rounded-b-xl">
              <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between invoice-btn">
                <PDFDownloadLink
                  document={
                    <InvoiceForDownload
                      data={data}
                      currency={currency}
                      globalSetting={globalSetting}
                      getNumberTwo={getNumberTwo}
                      showingTranslateValue={showingTranslateValue}
                    />
                  }
                  fileName="Invoice"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      "Loading..."
                    ) : (
                      <button
                        style={{
                          backgroundColor:
                            storeCustomizationSetting?.color?.bg_button?.hex,
                        }}
                        className={`bg-gray-800 text-white mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md`}
                      >
                        {showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.download_button
                        )}{" "}
                        <span className="ml-2 text-base">
                          <IoCloudDownloadOutline />
                        </span>
                      </button>
                    )
                  }
                </PDFDownloadLink>

                <ReactToPrint
                  trigger={() => (
                    <button
                      style={{
                        backgroundColor:
                          storeCustomizationSetting?.color?.bg_button?.hex,
                      }}
                      className={`bg-gray-800 text-white mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md`}
                    >
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.print_button
                      )}
                      <span className="ml-2">
                        <IoPrintOutline />
                      </span>
                    </button>
                  )}
                  content={() => printRef.current}
                  documentTitle="Invoice"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = ({ params }) => {
  return {
    props: { params },
  };
};

export default dynamic(() => Promise.resolve(Order), { ssr: false });
