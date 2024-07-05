import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
//internal import
import { UserContext } from "@context/UserContext";
import CustomerServices from "@services/UserServices";
import { notifyError, notifySuccess } from "@utils/toast";

const useLoginSubmit = (setModalOpen) => {
  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    name,
    email,
    registerEmail,
    verifyEmail,
    password,
  }) => {
    try {
      setLoading(true);

      if (registerEmail && password) {
        const res = await CustomerServices.loginCustomer({
          registerEmail,
          password,
        });

        setLoading(false);
        setModalOpen(false);
        router.push(redirect || "/");
        notifySuccess("Login Success!");
        dispatch({ type: "USER_LOGIN", payload: res });
        Cookies.set("_userInfo", JSON.stringify(res), {
          sameSite: "None",
          secure: true,
        });
      }

      if (name && email && password) {
        const res = await CustomerServices.verifyEmailAddress({
          name,
          email,
          password,
        });

        setLoading(false);
        setModalOpen(false);
        notifySuccess(res.message);
      }

      if (verifyEmail) {
        const res = await CustomerServices.forgetPassword({ verifyEmail });
        setLoading(false);
        notifySuccess(res.message);
        setValue("verifyEmail");
      }
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (user) => {
    try {
      if (user?.profileObj?.name) {
        const res = await CustomerServices.signUpWithProvider({
          name: user.profileObj.name,
          email: user.profileObj.email,
          image: user.profileObj.imageUrl,
        });

        setModalOpen(false);
        notifySuccess("Login success!");
        router.push(redirect || "/");
        dispatch({ type: "USER_LOGIN", payload: res });
        Cookies.set("_userInfo", JSON.stringify(res), {
          sameSite: "None",
          secure: true,
        });
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      setModalOpen(false);
    }
    // console.log('user', user);
  };

  return {
    handleSubmit,
    submitHandler,
    handleGoogleSignIn,
    register,
    errors,
    GoogleLogin,
    loading,
  };
};

export default useLoginSubmit;
