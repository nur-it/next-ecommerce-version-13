import { createSlice } from "@reduxjs/toolkit";

const setting = createSlice({
  name: "setting",
  initialState: {
    settingItem: [],
  },
  reducers: {
    addSetting: (state, action) => {
      const existsItem = state.settingItem.find(
        (x) => x.name === action.payload.name
      );
      if (existsItem) {
        return {
          ...state,
          settingItem: state.settingItem.map((x) => {
            if (x.name === existsItem.name) {
              return x;
            }
            return x;
          }),
        };
      } else {
        return {
          ...state,
          settingItem: [...state.settingItem, action.payload],
        };
      }
    },
    updateSetting: (state, action) => {
      return {
        ...state,
        settingItem: state.settingItem.map((x) => {
          if (x.name === action.payload.name) {
            return {
              ...action.payload,
            };
          }
          return x;
        }),
      };
    },
    removeSetting: (state, action) => {
      return {
        ...state,
        settingItem: state.settingItem.filter((x) => x.name !== action.payload),
      };
    },

    clearSetting: (state) => {
      return {
        ...state,
        settingItem: [],
      };
    },
  },
});

export const { addSetting, updateSetting, removeSetting, clearSetting } =
  setting.actions;

export default setting.reducer;
