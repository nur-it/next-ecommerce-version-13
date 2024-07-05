import requests from "./httpServices";

const CategoryServices = {
  getShowingStoreCategory: async () => {
    return requests.get("/category/store/show");
  },

  getShowingCategory: async () => {
    return requests.get("/category/show");
  },

  getCategoryById: async (id) => {
    return requests.get(`/category/${id}`);
  },
};

export default CategoryServices;
