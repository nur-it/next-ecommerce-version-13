import requests from "./httpServices";

const ReviewServices = {
  addReview: async (body) => {
    return requests.post("/review/add", body);
  },
  getReviewById: async (id) => {
    return requests.get(`/review/${id}`);
  },
  getReviewByProductId: async (productId) => {
    return requests.get(`/review?productId=${productId}`);
  },
  updateReview: async (id, body) => {
    return requests.put(`/review/${id}`, body);
  },
  getAllReviews: async ({ id, cname, limit = 5, page = 1, sort }) => {
    return requests.get(
      `/review/${id}?cname=${cname}&limit=${limit}&page=${page}&sort=${sort}`
    );
  },
  showUserOrderProductReview: async ({
    page = 1,
    limit = 8,
    user = null,
    sellFrom = null,
  }) => {
    return requests.get(
      `/review/show/user/order/product?user=${user}&sellFrom=${sellFrom}&limit=${limit}&page=${page}`
    );
  },
};

export default ReviewServices;
