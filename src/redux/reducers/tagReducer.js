import ActionType from "../types";

const initialState = {};

export const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.TAG:
      return {
        ...state,
        tagData: action.payload,
      };
    default:
      return state;
  }
};
