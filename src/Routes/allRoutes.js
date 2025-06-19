import { Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Investors from "../pages/Investors";
import AddInvestors from "../pages/AddInvestors";

// import Signin from "../pages/Authentication/login";
import Logout from "../pages/Authentication/logout";
import UserProfile from "../pages/Authentication/user-profile";
import Register from "../pages/Authentication/register";
import Forgetpassword from "../pages/Authentication/forgetpassword";
import AllTransaction from "../pages/AllTransaction";
import AddTransaction from "../pages/AddTransaction";
import InvestorsDetails from "../pages/InvestorsDetails";
import AllAccount from "../pages/AllAccount";
import AmountScreen from "../pages/AmountScreen";
import AddAccount from "../pages/AddAccount";
import AddBulkTransaction from "../pages/AddPayout";
import AllBulkTransaction from "../pages/AllBulkTransaction";
import Login from "../pages/Authentication/login";
import BulkTransactionDetails from "../pages/BulkTransactionDetails";
// import AddInveterWithoutLogin from "../pages/AddInveterWithoutLogin";
import ReferenceInvestors from "../pages/ReferenceInvestors";
import ReferenceInvestorsDetails from "../pages/ReferenceInvestorsDetails";
import AccountDetails from "../pages/AccountDetails";
import EditInvestors from "../pages/EditInvestors";
import GetInvestorsOpen from "../pages/GetInvestorsOpen";
import ExportHistory from "../pages/ExportHistory";
import AddExportPendingTransaction from "../pages/AddExportPendingTransaction";
import ExportHistoryDetails from "../pages/ExportHistoryDetails";
import AllAddFunds from "../pages/AllAddFunds";
import Users from "../pages/User";
import Deposits from "../pages/Deposit";
import Paying from "../pages/Paying";
import PayingBank from "../pages/PayingBank";
import PayingTds from "../pages/PayingTds";
import AllPendingTransaction from "../pages/AllPendingTransaction";
import InvestorsPending from "../pages/InvestorsPending";
import AllWithdraws from "../pages/AllWithdraws";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },

  // user profile
  { path: "/user-profile", component: <UserProfile /> },

  { path: "/", component: <Dashboard /> },
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "/investors", exact: true, component: <Investors /> },
  { path: "/investors-pending", exact: true, component: <InvestorsPending /> },

  { path: "/users", component: <Users /> },
  { path: "/deposit", component: <Deposits /> },
  { path: "/paying", component: <Paying /> },
  { path: "/payout-bank", component: <PayingBank /> },
  { path: "/tally-export", component: <PayingTds /> },

  
  { path: "/statement/:slug/:slug", exact: true, component: <GetInvestorsOpen /> },

  {
    path: "/reference-investors",
    exact: true,
    component: <ReferenceInvestors />,
  },
  {
    path: "/reference-investors/:slug",
    exact: true,
    component: <ReferenceInvestorsDetails />,
  },
  {
    path: "/investors/:slug",
    exact: true,
    component: <InvestorsDetails />,
  },
  {
    path: "/add-investors",
    exact: true,
    component: <AddInvestors />,
  },
  {
    path: "/add-investors/:slug",
    exact: true,
    component: <EditInvestors />,
  },
  {
    path: "/all-add-funds",
    exact: true,
    component: <AllAddFunds />,
  },
  {
    path: "/all-withdraws-funds",
    exact: true,
    component: <AllWithdraws />,
  },
  {
    path: "/transaction",
    exact: true,
    component: <AllTransaction />,
  },
  {
    path: "/pending-transaction",
    exact: true,
    component: <AllPendingTransaction />,
  },
  {
    path: "/transaction/:slug",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  {
    path: "/add-transaction",
    exact: true,
    component: <AddTransaction />,
  },
  {
    path: "/add-transaction/:slug",
    exact: true,
    component: <AddTransaction />,
  },
  {
    path: "/payouts",
    exact: true,
    component: <AddBulkTransaction />,
  },
  {
    path: "/all-bulk-transaction",
    exact: true,
    component: <AllBulkTransaction />,
  },
  {
    path: "/all-bulk-transaction/:slug",
    exact: true,
    component: <BulkTransactionDetails />,
  },
  {
    path: "/profit-loss",
    exact: true,
    component: <AmountScreen />,
  },
  {
    path: "/all-account",
    exact: true,
    component: <AllAccount />,
  },
  {
    path: "/all-account/:slug",
    exact: true,
    component: <AccountDetails />,
  },
  {
    path: "/add-account",
    exact: true,
    component: <AddAccount />,
  },
  {
    path: "/add-account/:slug",
    exact: true,
    component: <AddAccount />,
  },
  {
    path: "/public/investor/:slug",
    exact: true,
    component: <GetInvestorsOpen />,
  },
  {
    path: "/export-bank",
    exact: true,
    component: <ExportHistory />,
  },
  {
    path: "/export-pending-transaction",
    exact: true,
    component: <AddExportPendingTransaction />,
  },
  {
    path: "/export-history/:slug",
    exact: true,
    component: <ExportHistoryDetails />,
  },

];

const publicRoutes = [
  // Authentication
  { path: "/login", component: <Login /> },
  // { path: "/public/investor", component: <AddInvestorsOpen /> },
  { path: "/logout", component: <Logout /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <Forgetpassword /> },
];

export { publicRoutes, authProtectedRoutes };