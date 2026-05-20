/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	setLoading,
	setToastMessageHandler,
} from '../../../../../redux/action-creator/commonAction';
import { RPA_ACTION_EDIT } from '../../../../../utils/constants';
import { _POST } from '../../../../../services/axios.method';
import DialogBox from '../../../../common-components/dialogBox.js';
import { useSelector } from 'react-redux';
import ActionType from '../../../../../redux/types';
import { BudgetModal } from './budgetModal';

export const CampaignRpa = ({ op, editRef }) => {
	const [showPopup, setShowPopup] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [actionName, setActionName] = useState('');
	let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
	let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);

	const dispatch = useDispatch();
	const ACTION_TYPE = 'campaign';

	const createPayload = (action) => {
		const data = selectedCheckBox.campaign.map((data) => ({
			campaign_name: [data?.campaign_name],
			campaign_id: [data?.campaign_id],
			action,
			action_type: ACTION_TYPE,
			set_value: null,
			action_message: `${action} campaign`,
			media_type: 'Amazon',
			action_status: 1,
			profile_id: amazonProfile,
			campaign_type: data?.campaign_type,
		}));
		handleAction(data);
		dispatch({
			type: ActionType.CHECKBOX,
			payload: [],
		});
	};

	const handleAction = async (data) => {
		try {
			setLoading(true);
			const res = await _POST(RPA_ACTION_EDIT, data);

			setLoading(false);
			if (res?.status === 200) {
				dispatch(setToastMessageHandler('Action performed successfully', true));
			} else {
				dispatch(setToastMessageHandler('Failed to perform action', false));
			}
		} catch (error) {
			console.log(error);
			dispatch(setToastMessageHandler('Something went wrong!', false));
		}
	};

	const handleClick = (e, action) => {
		setShowPopup(false);
		setActionName(action);
		setShowDialog(true);
	};

	const handleDialogCancel = () => {
		setShowDialog(false);
		dispatch({
			type: ActionType.CHECKBOX,
			payload: [],
		});
	};

	const handleDialogApply = () => {
		setShowDialog(false);
		createPayload(actionName);
	};

  return (
    <>
      {op === true && (
        <div className="relative" ref={editRef}>
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[140px]">
            <ul className="edit-button ">
              <li
                onClick={(e) => handleClick(e, "enable")}
                className="edit-button-li"
              >
                Enable
              </li>
              <li
                onClick={(e) => handleClick(e, "pause")}
                className="edit-button-li"
              >
                Pause
              </li>
              {/* <li
                // onClick={(e) => handleClick(e, "pause")}
                className="edit-button-li"
              >
                Abort
              </li> */}
              {/* <li
                onClick={(e) => handleClick(e, "archive")}
                className="edit-button-li"
              >
                Archive
              </li> */}
              {/* <li
                onClick={() => setShowPopup(!showPopup)}
                className="edit-button-li"
              >
                Set budget
              </li> */}
            </ul>
          </div>
          {showPopup && <BudgetModal setOpenState={setShowPopup} />}
          {showDialog && (
            <DialogBox
              buttonName="Accept"
              title="Confirmation"
              onAccept={handleDialogApply}
              onCancel={handleDialogCancel}
            >
              Are you sure you want to {actionName} the status of selected
              records?
            </DialogBox>
          )}
        </div>
      )}
    </>
  );
};
