import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// import logger from "redux-logger";
import {
  sideBarReducer,
  campaignReducer,
  commonReducer,
  ruleReducer,
  campaignSearchReducer,
  tagReducer,
  amazonProfileReducer,
  blinkitDashBoardReducer,
  blinkitCreateCampaignReducer,
  zeptoDashBoardReducer,
  campaignTypeReducer,
  platformReducer,
  instamartCreateCampaignReducer,
  instamartSideBarReducer,
  customreport,
  authReducer,
  permissionsReducer
} from "./reducers";
import { recallCampaignReducer } from "./reducers/recallCampaignReducer";
import { recallGetRulesApiReducer } from "./reducers/recallGetRulesApiReducer";

const rootReducer = combineReducers({
  SideBarReducer: sideBarReducer,
  CampaignReducer: campaignReducer,
  CommonReducer: commonReducer,
  RuleReducer: ruleReducer,
  CampaignSearchReducer: campaignSearchReducer,
  TagReducer: tagReducer,
  RecallCampaignReducer: recallCampaignReducer,
  RecallGetRulesApiReducer: recallGetRulesApiReducer,
  BlinkitDashBoardReducer: blinkitDashBoardReducer,
  BlinkitCreateCampaignReducer: blinkitCreateCampaignReducer,
  AmazonProfileReducer: amazonProfileReducer,
  ZeptoDashBoardReducer: zeptoDashBoardReducer,
  CampaignTypeReducer: campaignTypeReducer,
  PlatformReducer: platformReducer,
  InstamartCreateCampaignReducer: instamartCreateCampaignReducer,
  InstamartSideBarReducer: instamartSideBarReducer,
  Customreport: customreport,
  AuthReducer: authReducer,
  permissionsReducer: permissionsReducer
});

const middleware = [thunk];
const composeEnacher = composeWithDevTools({ trace: true, traceLimit: 25 });
const STORE = createStore(
  rootReducer,
  composeEnacher(applyMiddleware(...middleware))
);

export default STORE;
