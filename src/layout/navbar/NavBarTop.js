import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FiPhoneCall, FiUser } from "react-icons/fi";
import { IoLockOpenOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";

//internal import
import LoginModal from "@component/modal/LoginModal";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const NavBarTop = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(UserContext);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  const handleModal = () => {
    if (userInfo?.email) {
      router.push("/user/dashboard");
    } else {
      setModalOpen(!modalOpen);
    }
  };

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("_userInfo");
    Cookies.remove("_couponInfo");
    router.push("/");
  };

  return (
    <>
      {modalOpen && (
        <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}

      <div className="hidden lg:block max-w-screen-4xl mx-auto  px-4 sm:px-10 bg-gray-100">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
          <div className="text-gray-700 py-2 font-sans text-xs font-medium border-b flex justify-between items-center">
            <span className="flex items-center">
              <FiPhoneCall className="mr-2" />
              {showingTranslateValue(
                storeCustomizationSetting?.navbar?.help_text
              )}
              Call Us :
              <a
                href={`tel:${
                  storeCustomizationSetting?.navbar?.phone_number ||
                  "+099949343"
                }`}
                className="font-bold text-emerald-700 ml-1"
              >
                {storeCustomizationSetting?.navbar?.phone_number ||
                  "+099949343"}
              </a>
            </span>

            <div className="lg:text-right flex items-center navBar">
              {storeCustomizationSetting?.navbar?.about_menu_status && (
                <div>
                  <Link
                    href="/about-us"
                    className="font-medium hover:text-emerald-600"
                  >
                    {showingTranslateValue(
                      storeCustomizationSetting?.navbar?.about_us
                    )}
                  </Link>
                  <span className="mx-2">|</span>
                </div>
              )}
              {storeCustomizationSetting?.navbar?.contact_menu_status && (
                <div>
                  <Link
                    href="/contact-us"
                    className="font-medium hover:text-emerald-600"
                  >
                    {showingTranslateValue(
                      storeCustomizationSetting?.navbar?.contact_us
                    )}
                  </Link>
                  <span className="mx-2">|</span>
                </div>
              )}
              <button
                onClick={handleModal}
                className="font-medium hover:text-emerald-600"
              >
                {showingTranslateValue(
                  storeCustomizationSetting?.navbar?.my_account
                )}
              </button>
              <span className="mx-2">|</span>
              {userInfo?.email ? (
                <button
                  onClick={handleLogOut}
                  className="flex items-center font-medium hover:text-emerald-600"
                >
                  <span className="mr-1">
                    <IoLockOpenOutline />
                  </span>
                  {showingTranslateValue(
                    storeCustomizationSetting?.navbar?.logout
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setModalOpen(!modalOpen)}
                  className="flex items-center font-medium hover:text-emerald-600"
                >
                  <span className="mr-1">
                    <FiUser />
                  </span>
                  {showingTranslateValue(
                    storeCustomizationSetting?.navbar?.login
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBarTop;
