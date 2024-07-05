import { createSlice } from "@reduxjs/toolkit";

const extraCart = createSlice({
  name: "extraCart",
  initialState: {
    extraCartItem: [],
  },
  reducers: {
    addToExtraCart: (state, action) => {
      const exist = state.extraCartItem.find(
        (item) => item.id === action.payload.id
      );

      if (exist) {
        exist.addedQuantity++;
      } else {
        state.extraCartItem.push(action.payload);
      }
    },
    incrementExtraCartItem: (state, action) => {
      const { id, qty } = action.payload;
      // console.log("payload", action.payload);
      const exist = state.extraCartItem.find((item) => item.id === id);

      if (exist) {
        exist.addedQuantity += qty;
        exist.itemTotal =
          exist.addedQuantity * Number(exist.impactOnPriceWithTax);
      }
    },
    decrementExtraCartItem: (state, action) => {
      const { id, qty } = action.payload;
      const exist = state.extraCartItem.find((item) => item.id === id);
      if (exist && exist.addedQuantity > 1) {
        exist.addedQuantity -= qty;
        exist.itemTotal =
          exist.addedQuantity * Number(exist.impactOnPriceWithTax);
      } else {
        return exist;
      }
    },
    removeExtraFromCart: (state, action) => {
      state.extraCartItem = state.extraCartItem.filter(
        (x) => x.id !== action.payload
      );
    },
    clearExtraCart: (state) => {
      state.extraCartItem = [];
    },
  },
});

export const {
  addToExtraCart,
  clearExtraCart,
  incrementExtraCartItem,
  decrementExtraCartItem,
  removeExtraFromCart,
} = extraCart.actions;

export default extraCart.reducer;
