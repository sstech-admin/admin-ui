import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllAccount,
  getAllInvestorType,
  getAllPaymentSystem,
} from "./generalSettingAPI";

export const getAllPaymentSystemAction = createAsyncThunk(
  "generalSetting/getAllPaymentSystem",
  async () => {
    const response = await getAllPaymentSystem();
    return response;
  }
);

export const getAllInvestorTypeAction = createAsyncThunk(
  "generalSetting/getAllInvestorType",
  async () => {
    const response = await getAllInvestorType();
    return response;
  }
);

export const getAllAccountAction = createAsyncThunk(
  "generalSetting/getAllAccount",
  async () => {
    const response = await getAllAccount();
    return response;
  }
);
