import React, { useEffect, useState } from "react";
import WeightageCard from "./WeightageCard";
// import { LuSave } from "react-icons/lu";
import { MdOutlineHistory } from "react-icons/md";
import { getPlatformList, getContentScoreWeightage, saveContentScoreWeightage } from "../../../services/ebuxMaster.service";
import ContentHeader from "./ContentHeader";
import ContentScoreConfigurationPreview from "./ContentScoreConfigurationPreview";
import AlertMessage from "./AlertMessage";

export default function ContentScoreConfiguration() {
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatformsObj, setSelectedPlatformsObj] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [originalWeightageData, setOriginalWeightageData] = useState([]);
  const [weightageData, setWeightageData] = useState([]);
  const [activeStep, setActiveStep] = useState("content");

  // loading states for skeletons
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [loadingWeightage, setLoadingWeightage] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoadingPlatforms(true);
      try {
        const result = await getPlatformList();
        setPlatforms(result || []);

        if (result && result.length > 0) {
          setSelectedPlatform(String(result[0].pf_id));
          setSelectedPlatformsObj(result[0]);
        }
      } catch (error) {
        console.error("Failed to load platforms:", error);
      } finally {
        setLoadingPlatforms(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handlePlatformChange = (e) => {
    const pfId = e.target.value;
    setSelectedPlatform(pfId);
    const platformObj = platforms?.find(p => String(p.pf_id) === String(pfId));
    setSelectedPlatformsObj(platformObj || {});
    setShowAlert(false);
  };


  useEffect(() => {
    if (!selectedPlatform) {
      setWeightageData([]);
      setOriginalWeightageData([]);
      return;
    }

    const fetchPlatformContent = async () => {
      setLoadingWeightage(true);
      try {
        const data = await getContentScoreWeightage(selectedPlatform);

        // Convert value → number
        const normalized = (data || []).map(item => ({
          ...item,
          value: Number(item.value) || 0
        }));

        console.log("Normalized Data:", normalized);

        setWeightageData(normalized.map(item => ({ ...item })));
        setOriginalWeightageData(normalized.map(item => ({ ...item })));

      } catch (error) {
        console.error("Error fetching platform content:", error);
        setWeightageData([]);
        setOriginalWeightageData([]);
      } finally {
        setLoadingWeightage(false);
      }
    };

    fetchPlatformContent();
  }, [selectedPlatform]);

  const totalWeightage = weightageData.reduce((acc, item) => {
    const num = Number(item?.value ?? 0);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  const isInvalid = totalWeightage !== 100;

  const handleChange = (index, value) => {
    setWeightageData(prev =>
      prev.map((item, i) => (i === index ? { ...item, value: Number(value) } : item))
    );
    setShowAlert(false);
  };

  //console.log('platformsplatformsplatforms', originalWeightageData)

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showAlert, setShowAlert] = useState(true);


  const handleSave = async () => {
    if (!selectedPlatform) {
      setSaveMsg("Please select a platform before saving.");
      return;
    }

    // prevent saving if total not 100
    if (isInvalid) {
      setSaveMsg("Total weightage must be 100% before saving.");
      return;
    }

    setSaving(true);
    setSaveMsg("");

    try {
      // create an object of scores
      const scores = {};

      weightageData.forEach((item) => {
        const name = (item?.field_name || "").toLowerCase();
        const value = Number(item?.value ?? 0);
        scores[name] = value;
      });

      const payload = {
        ...scores,
      };

      const result = await saveContentScoreWeightage(selectedPlatform, payload);

      if (!result || result?.isSuccess === false) {
        const msg = result?.message || "Failed to save configuration";
        throw new Error(msg);
      }

      setSaveMsg("Configuration saved successfully.");
      setActiveStep("content");
    } catch (err) {
      setSaveMsg("Save failed: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };


  /* -------------------------
     Skeleton components (inline)
     ------------------------- */

  const PlatformSelectSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
    </div>
  );

  const WeightageGridSkeleton = ({ cols = 4 }) => {
    // show 8 placeholders (cards)
    const arr = Array.from({ length: Math.max(4, cols) * 2 });
    return (
      <div className="grid grid-cols-4 gap-4 px-4 pb-10">
        {arr.map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-11/12 mb-3" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <div className="max-w-full mx-auto  rounded-lg ">
        {/* Steps header */}
        <ContentHeader activeStep={activeStep} />

        {/* Content */}
        {activeStep === "content" && (
          <div className="content-scrore">
            <div className="bg-white border rounded-xl mt-5">
              <div className="flex items-start justify-between bg-gray-50 p-4 px-5 rounded-t-xl">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 mb-1">
                    Content Score Configuration
                  </h1>
                  <p className="text-sm text-gray-600">
                    Define weightage for product page elements and mandatory keywords for content quality scoring
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <MdOutlineHistory className="w-5 h-5" />
                    History
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-lg">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Platform:
                  </label>
                  <div className="relative">
                    {loadingPlatforms ? (
                      <PlatformSelectSkeleton />
                    ) : (
                      <>
                        <select
                          value={selectedPlatform}
                          onChange={handlePlatformChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                        >
                          <option value="" disabled>-- Select Platform --</option>
                          {platforms?.map((p) => (
                            <option key={p.pf_id} value={String(p.pf_id)}>
                              {p.pf_name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>



            <div className="mt-6 space-y-3">

              {isInvalid && (
                <AlertMessage
                  type="error"
                  message={`Total weightage must be exactly 100%. Current total: ${totalWeightage}%`}
                // onClose={() => setShowAlert(false)}
                />
              )}

              {saveMsg && showAlert && (
                <AlertMessage
                  type={saveMsg.startsWith("Save failed") ? "error" : "success"}
                  message={saveMsg}
                  onClose={() => setShowAlert(false)}
                />
              )}

            </div>


            <div className="mt-4 bg-white rounded-lg">
              <div className="">
                <div className="flex items-center justify-between mb-6 bg-gray-50 px-5 py-3 mt-1 rounded-t-xl">
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 mb-1">
                      Content Element Weightage
                    </h1>
                    <p className="text-sm text-gray-600">
                      Platform: <span className="font-semibold">{selectedPlatformsObj?.pf_name}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg mb-1">Total</p>
                    <p className={`text-3xl font-bold ${isInvalid ? "text-red-600" : "!text-[#1890FF]"}`}>{totalWeightage}%</p>
                  </div>
                </div>

                {(loadingWeightage || weightageData?.length==0) ? (
                  <WeightageGridSkeleton />
                ) : (
                  <div className="grid grid-cols-4 gap-4 !px-4 !pb-10">
                    {weightageData?.map((item, index) => (
                      <WeightageCard
                        key={index}
                        title={item?.label ?? "-"}
                        subtitle=""
                        percentage={item?.value ?? 0}
                        onChange={(val) => handleChange(index, val)}
                      />
                    ))}
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-3 pt-6 pb-12 px-5">
                <button
                  onClick={() => setWeightageData(originalWeightageData?.map(item => ({ ...item })))}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loadingWeightage || loadingPlatforms}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!isInvalid) {
                      setActiveStep("preview");
                      setShowAlert(true);
                    }
                  }}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium ${isInvalid ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"}  transition-colors`}
                  disabled={isInvalid || loadingWeightage || loadingPlatforms}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {activeStep === "preview" && (
          <ContentScoreConfigurationPreview
            weightageData={weightageData}
            totalWeightage={totalWeightage}
            saving={saving}
            handleSave={handleSave}
            setActiveStep={setActiveStep}
            originalWeightageData={originalWeightageData}
            setWeightageData={setWeightageData}
            selectedPlatformsObj={selectedPlatformsObj}
          />
        )}
      </div>
    </div>
  );
}
