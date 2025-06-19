import { combineReducers } from "@reduxjs/toolkit";

import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ProfileReducer from "./auth/profile/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import InvestorSliceReducer from "./Invester/investerReducer";
import TransactionSliceReducer from "./transaction/transactionReducer";
import GeneralSettingsReducer from "./generalSetting/generalSettingReducer";

const rootReducer = combineReducers({
  Login: LoginReducer,
  Account: AccountReducer,
  Profile: ProfileReducer,
  ForgetPassword: ForgetPasswordReducer,
  investor: InvestorSliceReducer,
  transaction: TransactionSliceReducer,
  generalSetting: GeneralSettingsReducer,
});

export default rootReducer;
