import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import Label from "@component/form/Label";
import Uploader from "@component/image-uploader/Uploader";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Dashboard from "@pages/user/dashboard";
import CustomerServices from "@services/UserServices";
import { notifyError, notifySuccess } from "@utils/toast";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        image: imageUrl,
      };
      const res = await CustomerServices.updateCustomer(userInfo._id, userData);

      setLoading(false);
      notifySuccess(res.message);
      Cookies.set("_userInfo", JSON.stringify(res.customer), {
        sameSite: "None",
        secure: true,
      });

      window.location.reload();
    } catch (err) {
      setLoading(false);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  useEffect(() => {
    if (Cookies.get("_userInfo")) {
      const user = JSON.parse(Cookies.get("_userInfo"));
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("address", user.address);
      setValue("phone", user.phone);
      setImageUrl(user.image);
    }
  }, []);

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      )}
      description="This is edit profile page"
    >
      <div className="max-w-screen-2xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-xl font-serif font-semibold mb-5">
                {showingTranslateValue(
                  storeCustomizationSetting?.dashboard?.update_profile
                )}
              </h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="bg-white space-y-6">
              <div>
                <Label label={t("common:photo")} />
                <div className="mt-1 flex items-center">
                  <Uploader
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4 bg-white">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.full_name
                          )}
                          name="name"
                          type="text"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.full_name
                          )}
                        />
                        <Error errorName={errors.name} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.address
                          )}
                          name="address"
                          type="text"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.address
                          )}
                        />
                        <Error errorName={errors.address} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_phone
                          )}
                          name="phone"
                          type="tel"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_phone
                          )}
                        />
                        <Error errorName={errors.phone} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_email
                          )}
                          name="email"
                          type="email"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_email
                          )}
                        />
                        <Error errorName={errors.email} />
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                      {loading ? (
                        <button
                          type="button"
                          style={{
                            backgroundColor:
                              storeCustomizationSetting?.color?.bg_button?.hex,
                          }}
                          className={`bg-gray-800 hover:text-white hover:bg-gray-900 text-white md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto`}
                        >
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                          />
                          <span className="font-serif ml-2 font-light">
                            Processing
                          </span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          style={{
                            backgroundColor:
                              storeCustomizationSetting?.color?.bg_button?.hex,
                          }}
                          className={`bg-gray-800 hover:text-white hover:bg-gray-900 text-white md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto`}
                        >
                          {showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.update_button
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default dynamic(() => Promise.resolve(UpdateProfile), { ssr: false });
