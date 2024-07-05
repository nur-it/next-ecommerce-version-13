import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import "@styles/custom.css";
import getStripe from "@utils/stripe";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { CartProvider } from "react-use-cart";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

//internal import
import store from "@redux/index";
import DefaultSeo from "@component/common/DefaultSeo";
import Loading from "@component/preloader/Loading";
import { UserProvider } from "@context/UserContext";
import SiteServices from "@services/SiteServices";
// import SettingServices from "@services/SettingServices";
import { SidebarProvider } from "@context/SidebarContext";
import IndexLoading from "@component/preloader/IndexLoading";
// import { GlobalStyles, lightTheme } from "@styles/theme.config";
import MaintenanceLoading from "@component/preloader/MaintenanceLoading";
import { ThemeProvider } from "@context/ThemeContext";

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { stripePromise, storeSetting } = getStripe();
  // const [storeSetting, setStoreSetting] = useState({});
  const [cdata, setCdata] = useState({});
  const [loading, setLoading] = useState(true);

  // const paypalPublicKey = !loading && `${storeSetting?.paypal_public_key}`;

  // CCDev
  // paypal stripe id
  const initialOptions = {
    "client-id": `${
      storeSetting?.paypal_public_key ||
      "AZlKmZhXurK5lIHj8kZvl1Z9xaUCkBv0zx4scws2xkZlh3bHfNovOyggvTQCp-Jx5HDwzSmaMcH5at4J"
    }`,
    // 'client-id': `${paypalPublicKey}`,
    currency: "USD",
    // intent: 'capture',
    // 'data-client-token': 'abc123xyz==',
  };
  // console.log("paypalPublicKey", storeSetting?.paypal_public_key);

  useEffect(() => {
    let company;
    let host = window.location.host;
    company = host.split(".")[0]; // get the subdomain from the domain

    Cookies.set("_cname", company, {
      sameSite: "None",
      secure: true,
    });
    // console.log("CNAME : " + company);

    const cname = Cookies.get("_cname");
    (async () => {
      try {
        const res = await SiteServices.getStoreDetails(cname);
        // const res2 = await SettingServices.getOnlineStoreSetting();
        // setStoreSetting(res2[0]);

        // console.log("res", res);

        if (res && res != null) {
          setLoading(false);
          setCdata(res);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log("error on getting store info", err.message);
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SidebarProvider>
        <Provider store={store}>
          <UserProvider>
            {router.asPath === "/" ? (
              <IndexLoading />
            ) : (
              <Loading loading={loading} />
            )}
          </UserProvider>
        </Provider>
      </SidebarProvider>
    );
  } else if (
    cdata?.userstatus === "Active" &&
    cdata?.shop_status === "Active"
  ) {
    return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <SidebarProvider>
          <PayPalScriptProvider options={initialOptions}>
            <ThemeProvider>
              {/* <GlobalStyles /> */}
              <Provider store={store}>
                <UserProvider>
                  <PersistGate loading={null} persistor={persistor}>
                    <Elements stripe={stripePromise}>
                      <CartProvider>
                        <DefaultSeo />
                        <Component {...pageProps} />
                      </CartProvider>
                    </Elements>
                  </PersistGate>
                </UserProvider>
              </Provider>
            </ThemeProvider>
          </PayPalScriptProvider>
        </SidebarProvider>
      </GoogleOAuthProvider>
    );
  } else if (cdata?.userstatus === "Inactive") {
    return (
      <SidebarProvider>
        <Provider store={store}>
          <UserProvider>
            <MaintenanceLoading />
          </UserProvider>
        </Provider>
      </SidebarProvider>
    );
  } else {
    return (
      <SidebarProvider>
        <Provider store={store}>
          <UserProvider>
            <h2 className="text-center text-2xl text-emerald-500">
              Please Check check your{" "}
              <span className="text-red-500">sub-domain</span> name!
            </h2>
          </UserProvider>
        </Provider>
      </SidebarProvider>
    );
  }
}

export default MyApp;
