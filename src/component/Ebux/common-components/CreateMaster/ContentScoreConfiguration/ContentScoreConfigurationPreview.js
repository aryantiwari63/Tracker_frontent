import React from "react";
import { WeightageCardPreview } from "./WeightageCardPreview";

export default function ContentScoreConfigurationPreview({
  weightageData,
  totalWeightage,
  saving,
  handleSave,
  setActiveStep,
  originalWeightageData,
  setWeightageData,
  selectedPlatformsObj
}) {
  return (
    <div className="preview-section">
      <div className="mt-4 bg-white rounded-lg ">
        <div className="">
          <div className="flex items-center justify-between mb-6 bg-gray-50 p-5 mt-1 rounded-t-xl">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                Configuration Preview
              </h1>
              <p className="text-sm text-gray-600">
                {selectedPlatformsObj?.pf_name ?? "-"} - summary of current scoring Configuration <span className="font-semibold"></span>
              </p>
            </div>
          </div>
          <div className="!px-4">
            <div className="grid grid-cols-3 gap-4 !pb-10">
              <WeightageCardPreview
                label="Platform"
                title={selectedPlatformsObj?.pf_name ?? "-"}
                subtitle="E-commerce platform"
                imgSrc="/assets/images/platformnew.svg"
              />

              <WeightageCardPreview
                label="Total Elements"
                title={weightageData.length ?? 0}
                subtitle="Scoring Elements Configured"
                imgSrc="/assets/images/sliders-horizontal.svg"
              />

              {/* <WeightageCardPreview
                      label="Keyword Rules"
                      title="4"
                      subtitle="Active keyword validations"
                      imgSrc="/assets/images/tags.svg"
                    /> */}

              <WeightageCardPreview
                label="Status"
                title={`${totalWeightage ?? 0}%`}
                subtitle="Complete & Valid"
                imgSrc="/assets/images/StatusRep.svg"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Scoring Breakdown
              </h2>

              <div className="space-y-3">
                {weightageData.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-800">
                    <span>
                      {item?.label ?? "-"}
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {item?.value ?? 0}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t mt-6 mb-4"></div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Weightage
                </span>
                <span className="text-lg font-semibold !text-[#0081F7]">{totalWeightage}%</span>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-6 pb-12 px-5">
          <button
            onClick={() => setWeightageData(originalWeightageData.map(item => ({ ...item })))
              & setActiveStep("content")}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${saving ? "bg-gray-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {saving ? "Saving..." : "Save and Apply Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
