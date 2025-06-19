import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Transaction: [],
};

const TransactionSlice = createSlice({
  name: "Transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});


export default TransactionSlice.reducer;

//   "investorTypeId": 1,
//     "name": "3.5 L"
