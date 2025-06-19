import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  AllInvestor: [],
};

const InvestorSlice = createSlice({
  name: "investor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

  },
});

export default InvestorSlice.reducer;

// type
// getAllInvestorType: Array[{"investorTypeId": 1,"name": "3.5 L"}]
// AllInvestor : Array[{
//     "userId": 4,
//     "userName": "1251",
//     "firstName": "fInvestor",
//     "middleName": "mInvestor",
//     "lastName": "lInvestor",
//     "investorTypeId": 1,
//     "investorTypeName": "3.5 L",
//     "paymentSystemId": 1,
//     "paymentSystemName": "Weekly"
// }]
