import requests from "./httpServices";

const CustomerServices = {
  loginCustomer: async (body) => {
    return requests.post("/customer/login", body);
  },

  verifyEmailAddress: async (body) => {
    return requests.post("/customer/verify-email", body);
  },

  registerCustomer: async (token, body) => {
    return requests.post(`/customer/register/${token}`, body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/customer/signup", body);
  },

  forgetPassword: async (body) => {
    return requests.put("/customer/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/customer/reset-password", body);
  },

  changePassword: async (body) => {
    return requests.post("/customer/change-password", body);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  shippingAddressCreate: async (id, body) => {
    return requests.post(`/customer/shipping/address/${id}`, body);
  },

  shippingAddressDelete: async (userId, shippingId) => {
    return requests.put(`/customer/shipping/address/${userId}/${shippingId}`);
  },

  getCustomerById: async (id) => {
    return requests.get(`/customer/${id}`);
  },
};

export default CustomerServices;
