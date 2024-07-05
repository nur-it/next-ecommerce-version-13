import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

//internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Dashboard from "@pages/user/dashboard";
import CustomerServices from "@services/UserServices";
import { notifyError, notifySuccess } from "@utils/toast";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  const onSubmit = ({ email, currentPassword, newPassword }) => {
    CustomerServices.changePassword({ email, currentPassword, newPassword })
      .then((res) => {
        notifySuccess(res.message);
      })
      .catch((err) => {
        notifyError(err ? err.response.data.message : err.message);
      });
  };

  useEffect(() => {
    if (Cookies.get("_userInfo")) {
      const user = JSON.parse(Cookies.get("_userInfo"));
      setValue("email", user.email);
    }
  });

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      )}
      description="This is change-password page"
    >
      <h2 className="text-xl font-serif font-semibold mb-5">
        {showingTranslateValue(
          storeCustomizationSetting?.dashboard?.change_password
        )}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:grid-cols-6 md:gap-6">
          <div className="md:mt-0 md:col-span-2">
            <div className="lg:mt-6 bg-white">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-6">
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
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.current_password
                    )}
                    name="currentPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.current_password
                    )}
                  />
                  <Error errorName={errors.currentPassword} />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.new_password
                    )}
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.new_password
                    )}
                  />
                  <Error errorName={errors.newPassword} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 text-right">
          <button
            type="submit"
            style={{
              backgroundColor: storeCustomizationSetting?.color?.bg_button?.hex,
            }}
            className={`bg-gray-800 hover:text-white hover:bg-gray-900 text-white md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto`}
          >
            {showingTranslateValue(
              storeCustomizationSetting?.dashboard?.change_password
            )}
          </button>
        </div>
      </form>
    </Dashboard>
  );
};

export default ChangePassword;
