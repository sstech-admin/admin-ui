import axios from "axios";
import { api } from "../../helpers/fakebackend_helper";

export const GetAllInvestor = (data) => api.get("/investor/admin/all", data);
export const publicGetInvestor = (data) =>
  api.get("/investor/public/getInvestor", data);
export const publicGetAllInvestorTransaction = (data) =>
  api.create("/transaction/public/getAllInvestorTransaction", data);
export const getAllReference = (data) => api.create("/references", data);
export const getAllReferenceInvestor = (data) =>
  api.create("/getAllReferenceInvestor", data);
export const getAllInvestorTransaction = (data) => {
  const query = new URLSearchParams(data).toString();
  return api.get(`/transaction/admin/investor/all?${query}`);
};
export const getBulkTransaction = (data) =>
  api.get(`/bulk-transactions/admin/getBulkTransaction`, data);
export const exportCsvApi = (data) =>
  api.create(`/export-data/admin/exportInvestorData`, data);
export const exportPayoutTds = (data) =>
  api.create(`/export-data/admin/exportData`, data);
export const exportBulkTransactionApi = (data) =>
  api.create(`/export-data/admin/exportBulkTransaction`, data);
export const getExportPendingTransaction = (data) =>
  api.create("/getExportPendingTransaction", data);
export const getAllBulkTransactionTransaction = (data) =>
  api.get(`/transaction/admin/all`, data);
export const getAllExportPendingTransactionTransaction = (data) =>
  api.create("/getAllExportPendingTransactionTransaction", data);
export const GetInvestor = (data) =>
  api.get(`/investor/admin/getInvestorProfile/${data?.userId}`);
export const GetInvestorImage = (data) =>
  api.get(`/investor/getInvestor/admin?=${data?.userId}`);
export const getAccount = (data) =>
  api.create("/transaction-accounts/getAccount", data);
export const getAllAccountTransaction = (data) =>
  api.create("/transaction-accounts/getAllAccountTransaction", data);
export const getAllTransactionalBank = () =>
  api.get("/investor/getAllTransactionalBank");
export const getAllPanCardType = () => api.get("/investor/getAllPanCardType");
export const deleteInvestor = (data) => {
  console.log("data", data);
  if (!data) {
    throw new Error("Investor ID is required");
  }

  return api.delete(`/investor/admin/delete/${data.investorId}`);
};
export const approveInvestor = (data) => {
  console.log("data", data);
  if (!data) {
    throw new Error("Investor ID is required");
  }

  return axios.patch(`/investor/admin/approve/${data.investorId}`);
};

// Withdraw Funds
export const GetWithdrawFunds = (data) => {
  const query = new URLSearchParams(data).toString();
  return api.get(`/investor/admin/getWithdrawalAmount?investorId=${data?.investorId}`);
};
export const getReferences = () => api.get("/references");

export const getReferenceInvestor = (id) =>
  api.get(`/references/${id}/investors`);

export const withdrawFunds = (data) =>
  api.create("/transaction/admin/withdrawFunds", data);


export const AddFunds = async (data) => {
  try {
    console.log("Sending data:", data);

    const response = await axios.post(
      "/transaction/admin/addFunds",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding funds:", error.response?.data || error.message);
    throw error;
  }
};
export const GetAllAddWithdrawLists = (data) => {
  const query = new URLSearchParams(data).toString();
  return api.get(`/transaction/admin/getAddWithdrawRequest?${query}`);
};

// TDS Certificates
export const GetTdsCertificateByUser = (userId, params) => {
  const queryString = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");

  return api.get(`/tds-certificates/admin/${userId}?${queryString}`);
};

export const GetAllUsers = (data) => {
  const query = new URLSearchParams(data).toString();
  return api.get(`/users/admin/all?${query}`);
};
export const AddTdsCertificate = (data) =>
  axios.post("/tds-certificates/admin", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updatedTransactionStatus = (data) =>
  api.create("/transaction/admin/updateTransactionStatus", data);

export const checkPanCard = (data) =>
  axios.post("/user-finance/checkPanCard", data);


export const AddInvestor = (data) => {
  return axios
    .post("/investor/admin/addInvestor", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
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

export const updateInvestor = (data) => {
  const formData = new FormData();

  // Append each key-value pair to FormData
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof File) {
        formData.append(key, data[key], data[key].name); // Append file with filename
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return axios
    .post(`/investor/admin/updateInvestor/${data?.investorId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const viewInvestorFile = (fileId) =>
  axios.get(`/viewInvestorFile/${fileId}`, {
    responseType: "arraybuffer", // Ensure response is treated as ArrayBuffer
  });
