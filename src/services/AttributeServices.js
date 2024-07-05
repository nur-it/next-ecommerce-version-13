import requests from "./httpServices";

const AttributeServices = {
  getShowingAttributes: async ({
    cname,
    id = "",
    ids = [],
    new_attribute = "",
  }) => {
    return requests.get(
      `/attributes/show?id=${id}&ids=${ids}&new_attribute=${new_attribute}&cname=${cname}`
    );
  },
};

export default AttributeServices;
