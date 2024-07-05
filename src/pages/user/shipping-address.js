import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";

//internal import
import Dashboard from "./dashboard";
import useGetSetting from "@hooks/useGetSetting";
import { UserContext } from "@context/UserContext";
import CustomerServices from "@services/UserServices";
import DeleteModal from "@component/modal/DeleteModal";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import ShippingCard from "@component/shipping/ShippingCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ShippingCreateModal from "@component/modal/ShippingCreateModal";

const shippingAddress = () => {
  const router = useRouter();
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const { setIsLoading, isUpdate, setIsUpdate } = useContext(SidebarContext);
  // react hook
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  // delete handler
  const handleDeleteShippingAddress = (id) => {
    setDeleteId(id);
    setModalShow(!modalShow);
  };

  // api user find by id
  useEffect(() => {
    (async () => {
      try {
        const res = await CustomerServices.getCustomerById(userInfo._id);
        setData(res);
        setLoading(false);
        setIsUpdate(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    })();
  }, [isUpdate]);

  // url loading data
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {/* delete modal */}
      <DeleteModal
        shippingId={deleteId}
        userId={userInfo._id}
        modalShow={modalShow}
        setModalShow={setModalShow}
      />
      {/* create modal */}
      <ShippingCreateModal
        modalShow={modalShow1}
        setModalShow={setModalShow1}
        userId={userInfo._id}
      />

      <Dashboard
        title={showingTranslateValue(
          storeCustomizationSetting?.dashboard?.shipping_address
        )}
        description="This is user Shipping Addresses page"
      >
        <div className="overflow-hidden rounded-md font-serif">
          {loading ? (
            <Loading loading={loading} />
          ) : error ? (
            <h2 className="text-2xl text-center my-10 mx-auto w-11/12">
              {error}
            </h2>
          ) : data?.shippingAddress.length === 0 ? (
            <div className="text-center">
              <button
                onClick={() => setModalShow1(!modalShow1)}
                type="button"
                className={`flex flex-col items-center border border-gray-200 hover:border-green-500 transition-all duration-400 justify-center p-5 bg-white hover:bg-white rounded-md`}
              >
                <h4 className="flex flex-col items-center text-gray-500 text-sm font-semibold mb-2 capitalize">
                  <p className="mb-5">Add New Shipping Address</p>
                  <span className="text-4xl text-green-500">
                    <IoAddSharp />
                  </span>
                </h4>
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <h2 className="text-xl font-serif font-semibold mb-5">
                {showingTranslateValue(
                  storeCustomizationSetting?.dashboard?.shipping_address
                )}
              </h2>

              <div className="grid md:grid-cols-3 grid-cols-2 gap-5 my-5">
                {data?.shippingAddress?.map((shipping) => (
                  <ShippingCard
                    key={shipping._id}
                    shipping={shipping}
                    handleDeleteShippingAddress={handleDeleteShippingAddress}
                  />
                ))}

                <button
                  onClick={() => setModalShow1(!modalShow1)}
                  type="button"
                  className={`flex flex-col items-center border border-gray-200 hover:border-green-500 transition-all duration-400 justify-center p-5 bg-white hover:bg-white rounded-md`}
                >
                  <h4 className="flex flex-col items-center text-gray-500 text-sm font-semibold mb-2 capitalize">
                    <p className="mb-5">Add New Shipping Address</p>
                    <span className="text-3xl text-green-500">
                      <IoAddSharp />
                    </span>
                  </h4>
                </button>
              </div>
            </div>
          )}
        </div>
      </Dashboard>
    </>
  );
};

export default shippingAddress;
