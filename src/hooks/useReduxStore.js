import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//internal import

import SettingServices from "@services/SettingServices";
import { addSetting } from "@redux/slice/setting";
import { storeCustomization } from "@utils/storeCustomizationSetting";

const useReduxStore = () => {
  const lang = Cookies.get("lang");
  const dispatch = useDispatch();

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

  useEffect(() => {
    // Function to fetch and add the setting
    const fetchAndAddSetting = async () => {
      try {
        setLoading(true);
        // console.log("storeCustomizationSetting setting not available");
        const res = await SettingServices.getStoreCustomizationSetting();
        // console.log("res", res);
        const storeCustomizationSettingData = {
          ...res,
          name: "storeCustomizationSetting",
        };
        // console.log("Object.keys(res).length", Object.keys(res).length);
        if (Object.keys(res).length > 0) {
          dispatch(addSetting(storeCustomizationSettingData));
        } else {
          // console.log(
          //   "store customization setting not available in db! use local one"
          // );
          const storeCustomizationData = {
            ...storeCustomization?.setting,
            name: "storeCustomizationSetting",
          };
          dispatch(addSetting(storeCustomizationData));
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log("Error on getting storeCustomizationSetting setting", err);
      }
    };

    const fetchGlobalSetting = async () => {
      try {
        // setLoading(true);
        // console.log("globalSetting setting not available");
        const res = await SettingServices.getGlobalSetting();
        const globalSettingData = {
          ...res,
          name: "globalSetting",
        };

        dispatch(addSetting(globalSettingData));

        // setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log("Error on getting globalSetting setting", err);
      }
    };

    const fetchStoreSetting = async () => {
      try {
        // setLoading(true);
        // console.log("onlineStoreSetting setting not available");
        const res = await SettingServices.getOnlineStoreSettingSelectedValues();
        const storeSettingData = {
          ...res,
          name: "storeSetting",
        };

        dispatch(addSetting(storeSettingData));

        // setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log("Error on getting onlineStoreSetting setting", err);
      }
    };

    // Check if the setting is not in the store and fetch it
    if (!storeCustomizationSetting) {
      fetchAndAddSetting();
    }

    if (!globalSetting) {
      fetchGlobalSetting();
    }

    if (!storeSetting) {
      fetchStoreSetting();
    }

    // Check if the "lang" value is not set and set a default value
    if (!lang) {
      Cookies.set("lang", "en", {
        sameSite: "None",
        secure: true,
      });
    }
  }, [storeCustomizationSetting, lang]);

  return {
    error,
    loading,
  };
};

export default useReduxStore;
