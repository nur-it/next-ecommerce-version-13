import Head from "next/head";
import { ToastContainer } from "react-toastify";
//internal import
import FeatureCard from "@component/feature-card/FeatureCard";
import useGetSetting from "@hooks/useGetSetting";
import Footer from "@layout/footer/Footer";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import Navbar from "@layout/navbar/Navbar";
import NavBarTop from "./navbar/NavBarTop";

const Layout = ({ title, description, children }) => {
  const { storeCustomizationSetting } = useGetSetting();

  return (
    <>
      <ToastContainer />
      <div className="font-sans">
        <Head>
          <title>
            {title
              ? `${title} | CloudClever : Point of Sale and E-Commerce Website all in one`
              : "CloudClever : Point of Sale and E-Commerce Website all in one"}
          </title>
          {description && <meta name="description" content={description} />}
        </Head>
        <NavBarTop />
        <Navbar />
        <div className="bg-gray-50">{children}</div>
        <MobileFooter />
        <div className="w-full">
          {storeCustomizationSetting?.home?.daily_needs_status && <FooterTop />}

          {storeCustomizationSetting?.home?.feature_promo_status && (
            <div className="hidden relative lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
              <FeatureCard />
            </div>
          )}

          <hr className="hr-line"></hr>
          <div className="border-t border-gray-100 w-full">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
