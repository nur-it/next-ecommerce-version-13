import requests from "./httpServices";

const CouponServices = {
  getShowingCoupons: async () => {
    return requests.get("/coupon/show");
  },
};

export default CouponServices;
