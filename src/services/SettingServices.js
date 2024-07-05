import requests from "./httpServices";

const SettingServices = {
  //store setting all function
  getOnlineStoreSetting: async () => {
    return requests.get("/setting/store/all");
  },

  //store setting all function
  getOnlineStoreSecretKeys: async (headers) => {
    return requests.get("/setting/store/keys", headers);
  },

  //store setting all function
  getOnlineStoreSettingSelectedValues: async () => {
    return requests.get("/setting/store/selected-values");
  },
  //store customization setting all function
  getStoreCustomizationSetting: async () => {
    return requests.get("/setting/store/customization/all");
  },

  getStoreSeoSetting: async ({ cname }) => {
    return requests.get(
      `/setting/store/customization/seo-setting?cname=${cname}`
    );
  },

  getLocalizationSetting: async () => {
    return requests.get(`/setting/localization/all`);
  },

  getPosSetting: async () => {
    return requests.get("/setting/pos/all");
  },

  getGlobalSetting: async () => {
    return requests.get("/setting/global/all");
  },

  getAllLanguages: async () => {
    return requests.get(`/language/show`);
  },

  getShowingLanguage: async () => {
    return requests.get(`/language/show`);
  },

  getShowingShipping: async () => {
    return requests.get("/shipping/show");
  },
};

export default SettingServices;
