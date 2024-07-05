import { FiLock, FiMail } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";

//internal  import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";

const Login = ({
  setModalOpen,
  setShowResetPassword,
  storeCustomizationSetting,
}) => {
  const { t } = useTranslation();

  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit(setModalOpen);

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold font-serif">
          {t("common:loginTitle")}
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
          {t("common:loginBoxText")}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 gap-5">
          <div className="form-group">
            <InputArea
              register={register}
              defaultValue="justin@gmail.com"
              label={t("common:email")}
              name="registerEmail"
              type="email"
              placeholder={t("common:email")}
              Icon={FiMail}
            />
            <Error errorName={errors.registerEmail} />
          </div>
          <div className="form-group">
            <InputArea
              register={register}
              defaultValue="12345678"
              label={t("common:password")}
              name="password"
              type="password"
              placeholder={t("common:password")}
              Icon={FiLock}
            />

            <Error errorName={errors.password} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex ms-auto">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-end text-sm text-heading ps-3 underline focus:outline-none hover:bg-white"
              >
                {t("common:forgotPassword")}
              </button>
            </div>
          </div>

          {loading ? (
            <button
              disabled={loading}
              type="submit"
              style={{
                backgroundColor:
                  storeCustomizationSetting?.color?.bg_button?.hex,
              }}
              className={`flex justify-center bg-gray-800 text-white hover:bg-gray-900 w-full text-center py-3 rounded transition-all focus:outline-none my-1`}
            >
              <img
                src="/loader/spinner.gif"
                alt="Loading"
                width={20}
                height={10}
                className="my-auto"
              />
              <span className="font-serif ml-1 font-light">Processing</span>
            </button>
          ) : (
            <button
              type="submit"
              style={{
                backgroundColor:
                  storeCustomizationSetting?.color?.bg_button?.hex,
              }}
              className={`bg-gray-800 text-white hover:bg-gray-900 w-full text-center py-3 rounded transition-all focus:outline-none my-1`}
            >
              {t("common:loginBtn")}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Login;
