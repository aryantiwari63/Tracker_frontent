import ActionType from "../types";
const initialState = {
  campaignSearch: [],
  adgroupSearch: [],
  fsnSearch: [],
  keywordSearch:[]
};
export const campaignSearchReducer = (state = initialState, action) => {
  // console.log("action commonReducer", action);
  switch (action.type) {
    case ActionType.GETCAMPAIGNSEARCH:
      return {
        ...state,
        campaignSearch: action.payload,
      };
    case ActionType.GETADGROUPSEARCH:
      return {
        ...state,
        adgroupSearch: action.payload,
      };
    case ActionType.GETFSNSEARCH:
      return {
        ...state,
        fsnSearch: action.payload,
      };
    case ActionType.GETKEYWORDSEARCH:
      return {
        ...state,
        keywordSearch: action.payload,
      };

    default:
      return state;
  }
};

export default campaignSearchReducer;
