import axios from "axios";
import { api } from "../../helpers/fakebackend_helper";

export const getAllPaymentSystem = (data) =>
  api.get("/investor/getAllPaymentSystem", data);
export const getAllInvestorType = (data) =>
  api.get("/investor/getAllInvestorType", data);
export const getAllAccount = (data) =>
  api.get("/transaction-accounts/getAllAccount", data);
export const getAllBulkTransactionAccount = (data) =>
  api.create("/getAllBulkTransactionAccount", data);
export const updateAccount = (data) =>
  api.create("/transaction-accounts/updateAccount", data);
export const deleteAccount = (data) => api.create("/deleteAccount", data);
export const deleteBulkTransaction = (data) => api.create("/bulk-transactions/deleteBulkTransaction", data);
export const addAccount = (data) =>
  api.create("/transaction-accounts/addAccount", data);
export const saveAmount = (data) => api.create("/amount/saveAmount", data);
export const getAllAmount = (data) => api.create("/amount/getAllAmount", data);
export const getAllTransactionMode = (data) =>
  api.get("/investor/getAllTransactionMode", data);
export const getallTransactinalBank = (data) =>
  api.get("/transaction/getallTransactinalBank", data);
export const publicPrepareInvestor = (data) =>
  api.create("/public/prepareInvestor", data);
export const getInvestorFileURL = (data) =>
  api.create("/getInvestorFileURL", data);
export const publicAddInvestor = (data) =>
  axios.post("/public/addInvestor", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const saveFinalAmount = async (data) => {
  try {
    const response = await axios.post("/amount/finalAmount", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Something went wrong!";
  }
};
