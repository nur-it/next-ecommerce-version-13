import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetSetting = () => {
  const lang = Cookies.get("lang");
  const seo = Cookies.get("_seo");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const settings = useSelector((state) => state.setting.settingItem);

  const globalSetting = settings.find(
    (value) => value.name === "globalSetting"
  );

  const storeSetting = settings.find((value) => value.name === "storeSetting");

  const storeCustomizationSetting = settings.find(
    (value) => value.name === "storeCustomizationSetting"
  );

  const getBgColor = (color, defaultBg) => {
    return color ? `bg-${color}` : defaultBg;
  };

  // console.log("storeSetting", storeSetting);

  useEffect(() => {
    if (storeCustomizationSetting?.seo && !seo) {
      // console.log("seo not available");
      const seo = {
        favicon: storeCustomizationSetting?.seo?.favicon,
        meta_description: storeCustomizationSetting?.seo?.meta_description,
        meta_img: storeCustomizationSetting?.seo?.meta_img,
        meta_keywords: storeCustomizationSetting?.seo?.meta_keywords,
        meta_title: storeCustomizationSetting?.seo?.meta_title,
        meta_url: storeCustomizationSetting?.seo?.meta_url,
      };
      Cookies.set("_seo", JSON.stringify(seo), {
        sameSite: "None",
        secure: true,
        expires: new Date(new Date().getTime() + 10 * 60 * 1000),
      });
    }
  }, []);

  // useEffect(() => {
  //   // Function to fetch and add the setting
  //   const fetchAndAddSetting = async () => {
  //     try {
  //       setLoading(true);
  //       // console.log("storeCustomizationSetting setting not available");
  //       const res = await SettingServices.getStoreCustomizationSetting();
  //       // console.log("res", res);
  //       const storeCustomizationSettingData = {
  //         ...res,
  //         name: "storeCustomizationSetting",
  //       };
  //       // console.log("Object.keys(res).length", Object.keys(res).length);
  //       if (Object.keys(res).length > 0) {
  //         dispatch(addSetting(storeCustomizationSettingData));
  //       } else {
  //         // console.log(
  //         //   "store customization setting not available in db! use local one"
  //         // );
  //         const storeCustomizationData = {
  //           ...storeCustomization?.setting,
  //           name: "storeCustomizationSetting",
  //         };
  //         dispatch(addSetting(storeCustomizationData));
  //       }

  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       console.log("Error on getting storeCustomizationSetting setting", err);
  //     }
  //   };

  //   const fetchGlobalSetting = async () => {
  //     try {
  //       // setLoading(true);
  //       // console.log("globalSetting setting not available");
  //       const res = await SettingServices.getGlobalSetting();
  //       const globalSettingData = {
  //         ...res,
  //         name: "globalSetting",
  //       };

  //       dispatch(addSetting(globalSettingData));

  //       // setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       console.log("Error on getting globalSetting setting", err);
  //     }
  //   };

  //   const fetchStoreSetting = async () => {
  //     try {
  //       // setLoading(true);
  //       console.log("onlineStoreSetting setting not available");
  //       const res = await SettingServices.getOnlineStoreSettingSelectedValues();
  //       const storeSettingData = {
  //         ...res,
  //         name: "storeSetting",
  //       };

  //       dispatch(addSetting(storeSettingData));

  //       // setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       console.log("Error on getting onlineStoreSetting setting", err);
  //     }
  //   };

  //   // Check if the setting is not in the store and fetch it
  //   if (!storeCustomizationSetting) {
  //     fetchAndAddSetting();
  //   }

  //   if (!globalSetting) {
  //     fetchGlobalSetting();
  //   }

  //   if (!storeSetting) {
  //     fetchStoreSetting();
  //   }

  //   // Check if the "lang" value is not set and set a default value
  //   if (!lang) {
  //     Cookies.set("lang", "en", {
  //       sameSite: "None",
  //       secure: true,
  //     });
  //   }

  //   // // Set an interval to remove the setting from the store every 5 minutes
  //   // const interval = setInterval(() => {
  //   //   dispatch(removeSetting("storeCustomizationSetting"));
  //   //   dispatch(removeSetting("globalSetting"));
  //   //   dispatch(removeSetting("onlineStoreSetting"));
  //   //   // Fetch and add the setting again after removing it
  //   //   fetchAndAddSetting();
  //   //   fetchGlobalSetting();
  //   //   fetchStoreSetting();
  //   // }, 10 * 60 * 1000); // 10 minutes in milliseconds

  //   // // Clean up the interval when the component unmounts
  //   // return () => {
  //   //   clearInterval(interval);
  //   // };
  // }, [storeCustomizationSetting, lang]);

  return {
    lang,
    error,
    loading,
    getBgColor,
    globalSetting,
    storeSetting,
    storeCustomizationSetting,
  };
};

export default useGetSetting;
