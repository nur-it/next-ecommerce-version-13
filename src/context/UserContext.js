import useReduxStore from "@hooks/useReduxStore";
import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  userInfo: Cookies.get("_userInfo")
    ? JSON?.parse(Cookies.get("_userInfo"))
    : null,
  shippingAddress: Cookies.get("_shippingAddress")
    ? JSON?.parse(Cookies.get("_shippingAddress"))
    : {},
  couponInfo: Cookies.get("_couponInfo")
    ? JSON?.parse(Cookies.get("_couponInfo"))
    : {},
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userInfo: action.payload };

    case "USER_LOGOUT":
      return {
        ...state,
        userInfo: null,
      };

    case "SAVE_SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.payload };

    case "SAVE_COUPON":
      return { ...state, couponInfo: action.payload };
  }
}

export const UserProvider = ({ children }) => {
  const { error } = useReduxStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
