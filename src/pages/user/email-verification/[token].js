import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

//internal import
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import CustomerServices from "@services/UserServices";
import { notifySuccess } from "@utils/toast";

const EmailVerification = ({ params }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    CustomerServices.registerCustomer(params?.token)
      .then((res) => {
        router.push("/");
        setLoading(false);
        setSuccess(res.message);
        notifySuccess("Register Success!");
        dispatch({ type: "USER_LOGIN", payload: res });
        Cookies.set("_userInfo", JSON.stringify(res), {
          sameSite: "None",
          secure: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        setError(err?.response?.data?.message || err?.message);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {loading ? (
        <Loading loading={loading} />
      ) : success ? (
        <div className="text-emerald-500">
          <IoCheckmarkCircle className="mx-auto mb-2 text-center text-4xl" />
          <h2 className="text-xl font-medium"> {success} </h2>
        </div>
      ) : (
        <div className="text-red-500">
          <IoCloseCircle className="mx-auto mb-2 text-center text-4xl" />
          <h2 className="text-xl font-medium"> {error} </h2>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: { params },
  };
};

export default EmailVerification;
