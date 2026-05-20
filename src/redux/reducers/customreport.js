import ActionType from "../types";
const initialState = {
  rightPanelList: {
    parameterList: [],
    breakdownList: [],
    showHeader: [],
    accepetedParameter: {},
  },
  generatedreportlist: [],
  generatedreportlisttotaldata: null,
  loading_custom: true,
  // parameter_list: [],
};
export const customreport = (state = initialState, action) => {
  // console.log("action commonReducer", action);

  switch (action.type) {
    case ActionType.LOADING_CUSTOM:
      return {
        ...state,
        loading_custom: action.payload,
      };

    case ActionType.RIGHTPANEL_LIST: {
      const { parameterList, breakdownList, showHeader, accepetedParameter } =
        action.payload;
      return {
        ...state,
        rightPanelList: {
          parameterList: parameterList,
          breakdownList: breakdownList,
          showHeader: showHeader,
          accepetedParameter: accepetedParameter,
        },
      };
    }
    case ActionType.GENERATEDREPORTLIST:
      return {
        ...state,
        generatedreportlist: action.payload,
      };
    case ActionType.GENERATEDREPORTLISTTOTALDATA:
      return {
        ...state,
        generatedreportlisttotaldata: action.payload,
      };

    case ActionType.SET_CHECKED_HEADER:
      return { ...state, showHeader: action.payload };
    // case ActionType.PARAMETER_LIST:
    //   return {
    //     ...state,
    //     parameter_list: action.payload,
    //   };
    default:
      return state;
  }
};

export default customreport;
