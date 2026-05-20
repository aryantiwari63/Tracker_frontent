/* eslint-disable */
import React from "react";
import NavButton from "./NavButton";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import DialogBox from "../../common-components/dialogBox.js";
import WhenPermitted from "../../common-components/WhenPermitted.js";
import { PERMISSIONS } from "../../../utils/constants.js";
const CustomReportType = ({
  reportType,
  color,
  edit,
  saveCustomReport,
  updateCustomReport,
  setShowDialog,
  showDialog,
  platform,
  errorInName,
}) => {
  const history = useHistory();

  const handlegoBack = () => {
    history.go(-1);
  };
  const { generatedreportlist } = useSelector((state) => state.Customreport);
  const dialogfunction = () => {
    setShowDialog(true);
  };
  const handleDialogCancel = () => {
    setShowDialog(false);
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    else return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <div className="col">
        <div className="row">
          <div className="w-[50%]">
            <b className="font-inter font-bold text-14">
              <span>
                <span
                  onClick={handlegoBack}
                  style={{ cursor: "pointer", color: "#9A9A9A" }}
                  onMouseOver={(e) => (e.target.style.color = color)}
                  onMouseOut={(e) => (e.target.style.color = "#9A9A9A")}
                >
                  Report
                </span>{" "}
                /{" "}
                <span
                  onClick={handlegoBack}
                  style={{ cursor: "pointer", color: "#9A9A9A" }}
                  onMouseOver={(e) => (e.target.style.color = color)}
                  onMouseOut={(e) => (e.target.style.color = "#9A9A9A")}
                >
                  Create Report
                </span>
              </span>{" "}
              / {" " + capitalizeFirstLetter(reportType)}
            </b>
          </div>
          <div className="w-[50%]">
            <div className="flex justify-end space-x-4">
              <WhenPermitted platform={platform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
              <NavButton
                name={edit ? "Update" : "Save"}
                color={color}
                onClick={edit ? dialogfunction : saveCustomReport}
                disabled={
                  (generatedreportlist && generatedreportlist?.length == 0) ||
                  errorInName
                }
              />
              </WhenPermitted>
              <img
                className="w-3 h-3 align-baseline my-2 cursor-pointer"
                src="/assets/images/x.png"
                alt="cross"
                onClick={() => handlegoBack()}
              />
            </div>
          </div>
          {showDialog && (
            <DialogBox
              title="Confirmation"
              buttonName="Okay"
              cancelbuttonName="No"
              onAccept={updateCustomReport}
              onCancel={handleDialogCancel}
              platform={platform}
            >
              Are you sure you want to update report?
            </DialogBox>
          )}
        </div>
      </div>
    </>
  );
};
export default CustomReportType;
