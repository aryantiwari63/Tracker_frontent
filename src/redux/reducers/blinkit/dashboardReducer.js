import ActionType from "../../types";
const initialState = {
  performanceBreakdown: {},
};
export const blinkitDashBoardReducer = (state = initialState, action) => {
  // console.log("action commonReducer", action);
  switch (action.type) {
    case ActionType.BLINKITPERFORMANCEBREAKDOWN:
      return {
        ...state,
        performanceBreakdown: action.payload,
      };
    default:
      return state;
  }
};

export default blinkitDashBoardReducer;
