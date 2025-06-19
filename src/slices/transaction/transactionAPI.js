import axios from "axios";
import { api } from "../../helpers/fakebackend_helper";

export const getAllTransaction = (data) => {
  const query = new URLSearchParams(data).toString();
  return api.get(`/transaction/admin/all?${query}`);
};
export const getAllBulkTransaction = (data) =>
  api.get("/bulk-transactions", data);
// export const addTransaction = (data) =>
//   api.create("/transaction/addTransaction", data);
export const addTransaction = (data) => {
  return axios
    .post("/transaction/addTransaction", data)
    .then((response) => response)
    .catch((error) => {
      // Log the full error structure for debugging
      console.error("API ERROR FULL:", error);

      // Throw a custom error that includes backend message if exists
      const customError = new Error(
        error?.response?.data?.message || error.message
      );
      throw customError;
    });
};
export const updateTransaction = (data) =>
  api.create("/updateTransaction", data);
export const addPayout = (data) =>
  api.create("/transaction/admin/payout", data);
export const exportPendingTransaction = (data) =>
  axios.post("/exportPendingTransaction", data, { responseType: "blob" });

export const deleteTransaction = (data) =>
  api.create("/transaction/deleteTransaction", data);
export const deleteAllTransaction = (data) =>
  api.create("/deleteAllTransaction", data);
export const updateTransactionStatus = (data) =>
  api.create("/transaction/admin/updateTransactionStatus", data);
export const updateAllTransactionStatus = (data) =>
  api.create("/updateAllTransactionStatus", data);
export const deleteAllBulkTransactionTransaction = (data) =>
  api.create("/deleteAllBulkTransactionTransaction", data);
export const updateAllBulkTransactionTransactionStatus = (data) =>
  api.create("/bulk-transactions/admin/updateStatus", data);
export const updateAllExportPendingTransactionTransactionStatus = (data) =>
  api.create("/updateAllExportPendingTransactionTransactionStatus", data);
export const getAllExportPendingTransaction = (data) =>
  api.create("/getAllExportPendingTransaction", data);
export const addExportPendingTransaction = (data) =>
  api.create("/addExportPendingTransaction", data);
