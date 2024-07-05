import requests from './httpServices';

const SiteServices = {
  getStoreDetails: async (cname) => {
    return requests.get(`/site/details/store?cname=${cname}`);
  },
};

export default SiteServices;
