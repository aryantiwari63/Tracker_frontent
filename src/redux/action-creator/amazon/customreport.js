/* eslint-disable no-console */
import { _POST } from "../../../services/axios.method";
import {
  // AMAZON_CUSTOM_RIGHTPANEL_LIST,
  // AMAZON_CUSTOM_GENERATEREPORT,
  ALL_BUTTON_FLAGS,
  // AMAZON_CUSTOM_SAVEREPORT,
  // AMAZON_CUSTOM_PARAMETER,
} from "../../../utils/constants";
import { cancelRequest } from "../../../utils/helpers";
import ActionType from "../../types";
import { setLoading } from "../commonAction";
import pako from "pako";

// const platformUrl = {
//   amazon: AMAZON_CUSTOM_GENERATEREPORT,
//   blinkit:
// };

export const generatecustomreport = (payload) => async (dispatch) => {
  try {
    // eslint-disable-next-line no-console

    // const ourRequest = await cancelRequest();
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.CUSTOMREPORT));
    const generateReportRes = await _POST(
      `/${payload.platform}/generatereport`,
      payload
      // {
      //   cancelToken: ourRequest.token,
      // }
    );
    let data = [];
    // console.log("etstststtstst");
    // Check if generateReportRes is defined and has data property
    if (generateReportRes && generateReportRes.data) {
      dispatch({
        type: ActionType.GENERATEDREPORTLISTTOTALDATA,
        payload: generateReportRes.data.data?.totaldata || 0,
      });
      // Extract compressed data from API response
      const compressedData =
        generateReportRes?.data?.data?.compressedData || [];

      // Check if compressedData is defined and has data property
      if (compressedData && compressedData.data) {
        // Decompress data
        const uint8array = new Uint8Array(compressedData.data);
        const decompressedData = pako.inflate(uint8array, { to: "string" });
        // eslint-disable-next-line no-console
        // console.log("decompressedData", JSON.parse(decompressedData));

        // Dispatch action to store data in Redux
        dispatch({
          type: ActionType.GENERATEDREPORTLIST,
          payload: JSON.parse(decompressedData),
        });
        data = JSON.parse(decompressedData);
      } else {
        console.error("Compressed data or its data property is undefined");
      }
    } else {
      console.error("generateReportRes or its data property is undefined");
    }

    setTimeout(() => {
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CUSTOMREPORT));
    }, [50]);
    return data;
  } catch (error) {
    console.error(error, "testError");
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.CUSTOMREPORT));
  }
};

export const savecustomreport = (payload, callback) => async () => {
  try {
    const ourRequest = await cancelRequest();
    await _POST(`/${payload.platform}/savereport`, payload, {
      cancelToken: ourRequest.token,
    });

    // Call the callback function if provided
    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error(error, "testError");
  }
};
export const updatecustomreport = (payload, callback) => async () => {
  try {
    const ourRequest = await cancelRequest();
    await _POST(`/${payload.platform}/updatereport`, payload, {
      cancelToken: ourRequest.token,
    });

    // Call the callback function if provided
    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error(error, "testError");
  }
};

export const customreport = (payload) => async (dispatch) => {
  try {
    const ourRequest = await cancelRequest();
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.COLUMNLIST));
    dispatch({
      type: ActionType.LOADING_CUSTOM,
      payload: true,
    });
    const res = await _POST(
      `/${payload.platform}/rightPanelList`,
      {
        type: payload,
      },
      {
        cancelToken: ourRequest.token,
      }
    );
    if (res?.data?.data) {
      dispatch({
        type: ActionType.RIGHTPANEL_LIST,
        payload: res?.data?.data?.data,
      });
      dispatch({
        type: ActionType.LOADING_CUSTOM,
        payload: false,
      });
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.COLUMNLIST));
    }
  } catch (error) {
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.COLUMNLIST));

    console.error(error, "testError");
  }
};

// export const getAttributesParameter = (payload) => async (dispatch) => {
//   try {
//     const ourRequest = await cancelRequest();
//     const res = await _POST(
//       AMAZON_CUSTOM_PARAMETER,
//       {
//         type: payload,
//       },
//       {
//         cancelToken: ourRequest.token,
//       }
//     );
//     if (res?.data?.data) {
//       dispatch({
//         type: ActionType.PARAMETER_LIST,
//         payload: res?.data?.data?.data,
//       });
//     }
//   } catch (error) {
//     console.error(error, "testError");
//   }
// };
