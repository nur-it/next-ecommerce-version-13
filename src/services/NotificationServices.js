import requests from "./httpServices";

const NotificationServices = {
  addNotification: async (body, headers) => {
    return requests.post("/notification/add", body, headers);
  },
  getAllNotification: async (page) => {
    return requests.get(`/notification?page=${page}`);
  },
};

export default NotificationServices;
