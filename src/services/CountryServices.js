import requests from "./httpServices";

const CountryServices = {
  getShowingCountry: async () => {
    return requests.get("/country/show");
  },
};

export default CountryServices;
