import requests from "./httpServices";

const OrderServices = {
  addOrder: async (body, headers) => {
    return requests.post("/order/add", body, headers);
  },

  createPaymentIntent: async (body) => {
    return requests.post("/order/create-payment-intent", body);
  },

  getOrderByCustomer: async ({
    page = 1,
    limit = 8,
    user = null,
    sellFrom = null,
  }) => {
    return requests.get(
      `/order?limit=${limit}&page=${page}&sellFrom=${sellFrom}&user=${user}`
    );
  },
  getOrderById: async (id, body) => {
    return requests.get(`/order/user/${id}`, body);
  },
  sendEmailInvoiceToAdminsAndCustomer: async (body, headers) => {
    return requests.post("/orders/admin/customer/invoice", body, headers);
  },
};

export default OrderServices;
