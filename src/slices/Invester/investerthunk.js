import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddInvestor, GetInvestor } from "./investerAPI";

export const AddInvestorAction = createAsyncThunk(
  "investor/addInvestor",
  async () => {
    const response = await AddInvestor();
    return response;
  }
);

export const GetInvestorAction = createAsyncThunk(
  "investor/addInvestor",
  async (data) => {
    const response = await GetInvestor(data);
    return response;
  }
);
