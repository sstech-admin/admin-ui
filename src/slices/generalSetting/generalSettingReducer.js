import { createSlice } from "@reduxjs/toolkit";
import {
  getAllAccountAction,
  getAllInvestorTypeAction,
  getAllPaymentSystemAction,
} from "./generalSettingthunk";

export const initialState = {
  allPaymentSystem: [],
  getAllInvestorType: [],
  allAccount: [],
};

const generalSettingSlice = createSlice({
  name: "generalSetting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPaymentSystemAction.fulfilled, (state, action) => {
      if (action?.payload?.status === "success") {
        state.allPaymentSystem = action.payload?.data;
      }
    });
    builder.addCase(getAllInvestorTypeAction.fulfilled, (state, action) => {
      if (action?.payload?.status === "success") {
        state.getAllInvestorType = action.payload?.data;
      }
    });
    builder.addCase(getAllAccountAction.fulfilled, (state, action) => {
      if (action?.payload?.status === "success") {
        state.allAccount = action.payload?.data;
      }
    });
  },
});

export default generalSettingSlice.reducer;

// Data Object Types
// {
//   allPaymentSystem:  { "paymentSystemId": 7,     "name": "Weekly"}[],
//   getAllInvestorType:{ "investorTypeId": 1,      "name": "3.5 L" }[],
//   AllAccount:        { "accountId":1, "name": "Cash"  }[],
// }
