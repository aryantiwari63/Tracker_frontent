import ActionType from "../../types";
const initialState = {
  instamartproductList: [],
  instamartkeywordList: [],
  // categoryList: [],
};
export const instamartCreateCampaignReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ActionType.GETINSTAMARTPRODUCTLIST:
      return {
        ...state,
        instamartproductList: action.payload,
      };
    case ActionType.GETINSTAMARTKEYWORDLIST:
      return {
        ...state,
        instamartkeywordList: action.payload,
      };
    // case ActionType.GETCATEGORYLIST:
    //   return {
    //     ...state,
    //     categoryList: action.payload,
    //   };
    default:
      return state;
  }
};

export default instamartCreateCampaignReducer;
