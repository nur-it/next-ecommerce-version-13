import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IoBagHandle } from "react-icons/io5";

// internal imports
import ImageWithFallback from "@component/common/ImageWithFallBack";
import ReviewModal from "@component/modal/ReviewModal";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import Dashboard from "@pages/user/dashboard";
import ReviewServices from "@services/ReviewServices";

const Reviews = () => {
  const { t } = useTranslation();
  // next js router
  const router = useRouter();

  // custom hook
  const { storeCustomizationSetting } = useGetSetting();

  // react context
  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { isLoading, currentPage, setIsLoading } = useContext(SidebarContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [productId, setProductId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [tabActive, setTabActive] = useState("my-reviews");

  // handle modal open
  const handleModalOpen = (id, title) => {
    setProductId(id);
    setModalTitle(title);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await ReviewServices.showUserOrderProductReview({
          limit: 8,
          page: currentPage,
          sellFrom: "SHOP",
          user: userInfo?._id,
        });

        let mergeData = res?.orders.map((obj1) => {
          let obj2 = res?.reviews.find((obj2) => obj1._id === obj2.product);
          return { ...obj1, reviews: { ...obj2, review: obj2 ? true : false } };
        });

        const orders = mergeData?.filter((item) => item.reviews.review);
        const reviews = mergeData?.filter((item) => !item.reviews.review);

        setReviewData(reviews);
        setOrderData(orders);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    })();
  }, [currentPage]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {modalOpen && (
        <ReviewModal
          title={modalTitle}
          userInfo={userInfo}
          productId={productId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          storeCustomizationSetting={storeCustomizationSetting}
        />
      )}

      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard title={"My reviews"} description="This is user reviews page">
          <div className="overflow-hidden font-serif">
            {loading ? (
              <Loading loading={loading} />
            ) : error ? (
              <h2 className="text-2xl text-center my-10 mx-auto w-11/12">
                {error}
              </h2>
            ) : (
              <div className="flex flex-col">
                <ul className="flex flex-wrap mb-5 border border-gray-100 bg-gray-50 rounded-sm p-2">
                  <li className="me-2">
                    <button
                      type="button"
                      onClick={() => setTabActive("my-reviews")}
                      className={`inline-block text-sm font-serif rounded-md font-medium p-2 hover:text-green-700 ${
                        tabActive === "my-reviews"
                          ? "border border-green-600"
                          : ""
                      }`}
                    >
                      To Reviews
                    </button>
                  </li>

                  <li className="me-2">
                    <button
                      type="button"
                      onClick={() => setTabActive("history")}
                      className={`inline-block text-sm font-serif font-medium rounded-md p-2 hover:text-green-700 ${
                        tabActive === "history" ? "border border-green-600" : ""
                      }`}
                    >
                      History
                    </button>
                  </li>
                </ul>

                {tabActive === "my-reviews" ? (
                  <>
                    {reviewData.length === 0 ? (
                      <div className="text-center">
                        <span className="flex justify-center my-30 pt-16 text-emerald-500 font-semibold text-6xl">
                          <IoBagHandle />
                        </span>
                        <h2 className="font-medium text-md my-4 text-gray-600">
                          {t("common:noOrder")}
                        </h2>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                        {reviewData?.map((item, i) => (
                          <div
                            className="group transition duration-150 ease-linear transform border rounded-sm bg-white border-gray-100 hover:border-teal-700 group overflow-hidden flex lg:flex-row md:flex-row lg:justify-start shadow-sm pe-0 items-center relative pt-2 list-view"
                            key={i + 1}
                          >
                            <div className="relative w-36 h-20 py-2">
                              <ImageWithFallback
                                src={
                                  item?.image[0] ||
                                  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                                }
                                alt="product"
                              />
                            </div>

                            <div className="py-4 px-2">
                              <h5 className="text-sm font-medium tracking-tight text-gray-900 dark:text-white">
                                {item?.title}
                              </h5>
                            </div>
                            <div className="flex items-center justify-end pr-2">
                              <button
                                type="button"
                                onClick={() => handleModalOpen(item._id)}
                                className="px-3 py-1 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 transition-all rounded-md"
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {orderData.length === 0 ? (
                      <div className="text-center">
                        <span className="flex justify-center my-30 pt-16 text-emerald-500 font-semibold text-6xl">
                          <IoBagHandle />
                        </span>
                        <h2 className="font-medium text-md my-4 text-gray-600">
                          {t("common:noOrder")}
                        </h2>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                        {orderData?.map((item, i) => {
                          const filledStars = item?.reviews?.star;
                          const emptyStars = 5 - filledStars;

                          let fillStarArr = Array.from(
                            { length: filledStars },
                            (_, index) => index
                          );
                          let emptyStarArr = Array.from(
                            { length: emptyStars },
                            (_, index) => index
                          );

                          return (
                            <div
                              className="group transition duration-150 ease-linear transform border rounded-sm bg-white border-gray-100 hover:border-teal-700 group overflow-hidden flex lg:flex-row md:flex-row lg:justify-start shadow-sm pe-0 items-center relative pt-2 list-view"
                              key={i + 1}
                            >
                              <div className="relative w-36 h-20 py-2">
                                <ImageWithFallback
                                  src={
                                    item?.image[0] ||
                                    "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                                  }
                                  alt="product"
                                />
                              </div>

                              <div className="py-4 px-2">
                                <h5 className="text-sm font-medium tracking-tight text-gray-900 dark:text-white">
                                  {item?.title}
                                </h5>
                                <div className="flex items-center space-x-1 rtl:space-x-reverse mt-4">
                                  {fillStarArr.map((item, i) => (
                                    <div key={i + 1}>
                                      <Image
                                        src="/product-details/star.png"
                                        alt="star"
                                        width={23}
                                        height={23}
                                      />
                                    </div>
                                  ))}

                                  {emptyStarArr?.map((item, i) => (
                                    <div key={i + 1}>
                                      <Image
                                        src="/product-details/empty-star.png"
                                        alt=""
                                        width={23}
                                        height={23}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="px-5 pb-5">
                                <div className="flex items-center justify-end pr-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleModalOpen(item._id, "Edit")
                                    }
                                    className="px-4 py-2 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 transition-all rounded-full"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Dashboard>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Reviews), { ssr: false });
