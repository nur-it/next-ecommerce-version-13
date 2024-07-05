import useTranslation from "next-translate/useTranslation";
import { FiLock, FiMail, FiUser } from "react-icons/fi";

//internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";

const Register = ({
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
          {t("common:signingUp")}
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
          {t("common:createAccount")}
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
              label={t("common:name")}
              name="name"
              type="text"
              placeholder="Full Name"
              Icon={FiUser}
            />

            <Error errorName={errors.name} />
          </div>

          <div className="form-group">
            <InputArea
              register={register}
              label={t("common:email")}
              name="email"
              type="email"
              placeholder="Email"
              Icon={FiMail}
            />
            <Error errorName={errors.email} />
          </div>

          <div className="form-group">
            <InputArea
              register={register}
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
              className={`bg-gray-800 text-white hover:bg-gray-900 w-full text-center py-3 rounded transition-all focus:outline-none my-1`}
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
              {t("common:register")}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Register;
