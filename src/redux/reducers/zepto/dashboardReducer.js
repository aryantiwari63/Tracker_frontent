import ActionType from "../../types";
const initialState = {
  zeptoperformanceBreakdown: {},
};
export const zeptoDashBoardReducer = (state = initialState, action) => {
  // console.log("action commonReducer", action);
  switch (action.type) {
    case ActionType.ZEPTOPERFORMANCEBREAKDOWN:
      return {
        ...state,
        zeptoperformanceBreakdown: action.payload,
      };
    default:
      return state;
  }
};

export default zeptoDashBoardReducer;
