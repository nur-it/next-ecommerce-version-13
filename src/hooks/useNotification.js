import { addSetting, removeSetting, updateSetting } from "@redux/slice/setting";
// import SettingServices from "@services/SettingServices";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

const useNotification = () => {
  const dispatch = useDispatch();
  const [cname, setCname] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setCname(Cookies.get("_cname"));
    setSocket(io(process.env.NEXT_PUBLIC_API_SOCKET_URL));
    // console.log("socket url", process.env.NEXT_PUBLIC_API_SOCKET_URL);
    // setSocket(io("http://localhost:5065"));
  }, []);

  useEffect(() => {
    socket?.on("get_notification", (notification) => {
      // console.log("socket connected in useNotification!", notification);
      if (notification?.cname === cname) {
        if (notification?.option === "globalSetting") {
          // console.log("global setting removed!");
          // dispatch(removeSetting("globalSetting"));
          const globalSettingData = {
            ...notification?.globalSetting,
            name: "globalSetting",
          };
          dispatch(updateSetting(globalSettingData));
        }
        if (notification?.option === "storeSetting") {
          // console.log("store setting removed!");
          // dispatch(removeSetting("storeSetting"));
          const storeSettingData = {
            ...notification?.storeSetting,
            name: "storeSetting",
          };
          dispatch(updateSetting(storeSettingData));
        }
        if (notification?.option === "storeCustomizationSetting") {
          // console.log("store customization setting removed!");
          // dispatch(removeSetting("storeCustomizationSetting"));
          const storeCustomizationSettingData = {
            ...notification?.storeCustomizationSetting,
            name: "storeCustomizationSetting",
          };
          dispatch(updateSetting(storeCustomizationSettingData));
          Cookies.remove("_seo");
        }
      }
    });
    return () => socket?.off("get_notification");
  }, [socket, cname]);
  return { socket };
};

export default useNotification;
