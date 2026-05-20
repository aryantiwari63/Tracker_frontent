import React from "react";

const EditStepper = ({ step }) => {
  return (
    <>
      <div className="">
        <div className="row stepper__steps ">
          <ol className="row stepper__steps-heading  ">
            <div className=" pr-2">
              <div className="row items-center ">
                <div
                  className={[
                    " stepper__steps-count",
                    step >= 1 && "stepper__steps-count--active",
                  ].join(" ")}
                >
                  1
                </div>
                <span className=" stepper__steps-title">Product Selection</span>
                <div className="col  stepper__steps-line"></div>
              </div>
            </div>
            <div className=" pr-2">
              <div className="row items-center">
                <div
                  className={[
                    " stepper__steps-count",
                    step >= 2 && "stepper__steps-count--active",
                  ].join(" ")}
                >
                  2
                </div>
                <div className=" stepper__steps-title">Budgeting</div>
                <div className="col  stepper__steps-line"></div>
              </div>
            </div>
            <div className=" pr-2">
              <div className="row items-center">
                <div
                  className={[
                    " stepper__steps-count",
                    step === 3 && "stepper__steps-count--active",
                  ].join(" ")}
                >
                  3
                </div>
                <div className=" stepper__steps-title">Review</div>
              </div>
            </div>
          </ol>
        </div>
      </div>
    </>
  );
};

export default EditStepper;
