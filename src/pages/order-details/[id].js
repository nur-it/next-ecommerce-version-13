import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
// internal imports
import ReviewModal from "@component/modal/ReviewModal";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import Dashboard from "@pages/user/dashboard";
import OrderServices from "@services/OrderServices";

const OrderDetails = ({ params }) => {
  // params id
  const orderId = params.id;
  // route
  const router = useRouter();
  // react hook
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [productReviewId, setProductReviewId] = useState([]);

  // custom hook
  const { storeCustomizationSetting } = useGetSetting();

  // context
  const {
    state: { userInfo },
  } = useContext(UserContext);

  // handle modal open
  const handleModalOpen = (id) => {
    setProductId(id);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderServices.getOrderById(orderId);

        setData(res?.order);
        setProductReviewId(res?.productReview);
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
    <>
      {modalOpen && (
        <ReviewModal
          userInfo={userInfo}
          productId={productId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          storeCustomizationSetting={storeCustomizationSetting}
        />
      )}

      {loading && !data ? (
        <Loading loading={loading} />
      ) : (
        <Dashboard
          title={"Order Details"}
          description="This is user order history page"
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-serif font-semibold mb-5">
              Order Details
            </h2>
          </div>

          <div className="mt-10 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center items-center gap-4">
            {data?.cart?.map((product, index) => (
              <div
                className="flex flex-col items-center justify-center gap-3 w-full h-[250px] p-5 drop-shadow-xl shadow-lg"
                key={index + 1}
              >
                <div className="w-[100px] h-20">
                  <Image
                    width={100}
                    height={60}
                    alt="product image"
                    src={product?.image[0]}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h2>{product?.title}</h2>

                {!productReviewId.includes(product._id) && (
                  <button
                    type="button"
                    onClick={() => handleModalOpen(product._id)}
                    className="px-4 py-2 bg-red-100 text-sm text-red-600  hover:text-red-400 transition-all font-semibold rounded-full"
                  >
                    Review
                  </button>
                )}
              </div>
            ))}
          </div>
        </Dashboard>
      )}
    </>
  );
};

export const getServerSideProps = ({ params }) => {
  return {
    props: { params },
  };
};

export default dynamic(() => Promise.resolve(OrderDetails), { ssr: false });
