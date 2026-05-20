import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Dropdown } from "primereact/dropdown";
import {
  metricOperator,
  dropDownCustom,
} from "../../Amazon/CustomReportSetting/CustomMetric";

const CreateMetricTab = ({ buttonStyleCss, dropDownCss, searchValue = "" }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    metric: "",
    operator: "",
    name: "",
    format: "",
    description: "",
  });

  const [selectedMetric, setSelectedMetric] = useState([]);

  const metricArr = [
    {
      label: "One",
      value: "oneee",
    },
    {
      label: "two",
      value: "twoee",
    },
    {
      label: "three",
      value: "threeee",
    },
  ];

  const handleForm = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInput = () => {
    setSelectedMetric((prev) => [...prev, form?.metric]);
    setForm((prev) => ({ ...prev, metric: "" }));
  };

  const handleUpdateSelectedMetric = ({ index, value }) => {
    const newArr = [...selectedMetric];
    newArr.splice(index, 1, value);
    setSelectedMetric(newArr);
  };

  const handleRemoveSelectedMetric = (index) => {
    const newArr = [...selectedMetric];
    newArr.splice(index, 1);
    setSelectedMetric(newArr);
  };

  useEffect(() => {
    if (searchValue) {
      setOpen(false);
    }
  }, [searchValue]);

  return (
    <div className="bg-white">
      <div
        className="flex gap-2 bg-[#e9ecef] py-2 px-3 items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="bg-white border border-[#d9d9d9]">
          {open ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </div>
        <div className="mr-1 font-medium">Create custom metric</div>
        <img src="/assets/images/imp.svg" className="w-[4px]" />
      </div>

      {open && (
        <div className="px-3 space-y-3 py-3">
          <div className="flex py-2 justify-between">
            <div className="flex-[0.6]">
              <Dropdown
                value={form.metric}
                onChange={(e) => handleForm("metric", e.value)}
                options={metricArr}
                optionLabel="label"
                placeholder="Select Metric"
                className="w-full md:w-14rem original"
              />
            </div>

            <div className="flex-[0.35] flex items-cente justify-between gap-1">
              <button
                onClick={() => {
                  form?.metric?.length > 1 && handleAddInput();
                }}
                className={`w-full py-1  text-[#ffffff] rounded-md border font-medium text-[14px] font-[#252525] ${buttonStyleCss}`}
              >
                Add Input
              </button>
            </div>
          </div>

          {selectedMetric?.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {selectedMetric?.map((value, index) => {
                return (
                  <MetricNameChip
                    key={index}
                    value={value}
                    index={index}
                    dropDownCss={dropDownCss}
                    handleRemoveSelectedMetric={() =>
                      handleRemoveSelectedMetric(index)
                    }
                    handleUpdateSelectedMetric={handleUpdateSelectedMetric}
                  />
                );
              })}
            </div>
          )}

          <div className="flex justify-between py-2 ">
            <div className="flex-[0.6] flex items-cente justify-between gap-1">
              {metricOperator.map((option, index) => {
                return (
                  <div
                    key={index}
                    title={option.title}
                    className=" text-[14px] font-medium border bg-[#F6F6F6] rounded-md cursor-pointer px-[15px] py-[3px]"
                  >
                    {option.title}
                  </div>
                );
              })}
            </div>

            <div className="flex-[0.35]">
              <button
                className={`w-full py-1  text-[#ffffff] rounded-md border font-medium text-[14px] font-[#252525] ${buttonStyleCss}`}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex-[0.48] ">
              <div className="text-[14px] ">Name</div>
              <input
                value={form.name}
                onChange={(e) => handleForm("name", e.target.value)}
                type="text"
                placeholder="Spend"
                className="w-full h-[32px] border border-[#dedede] outline-none  px-2"
              />
            </div>

            <div className="flex-[0.48]">
              <div className="text-[14px] ">Format</div>
              <Dropdown
                value={form.format}
                onChange={(e) => handleForm("format", e.value)}
                options={dropDownCustom}
                optionLabel="title"
                placeholder="Select"
                className="w-full md:w-14rem original"
              />
            </div>
          </div>

          <div className="border border-[#dedede]">
            <textarea
              value={form?.description}
              onChange={(e) => handleForm("description", e.target.value)}
              className="border row outline-none px-2 py-2 border-none"
              rows={3}
              placeholder="Add Description"
              maxLength={100}
            />
            <div className="flex justify-end text-[#bfbfbf] pr-2">
              {form?.description?.length}/100
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className={
                "popup__button bg-white border  text-gray-800  text-sm"
              }
            >
              Cancel
            </button>
            <button
              className={`py-2 capitalize text-white mx-2 rounded-md text-sm px-6 mr-0 ${buttonStyleCss} bg-gray-300 hover:bg-gray-400 cursor-not-allowed`}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateMetricTab;

const MetricNameChip = ({
  index,
  value,
  dropDownCss,
  handleRemoveSelectedMetric,
  handleUpdateSelectedMetric,
}) => {
  const metricArr = [
    {
      id: 1,
      label: "One",
      value: "oneee",
    },
    {
      id: 2,
      label: "two",
      value: "twoee",
    },
    {
      id: 3,
      label: "three",
      value: "threeee",
    },
  ];
  const [showList, setShowList] = useState(false);

  return (
    <div className="relative bg-slate-100 rounded-full px-4 py-1 flex items-center cursor-pointer">
      <div className="font-medium" onClick={() => setShowList(!showList)}>
        {value}
        {showList && (
          <div className="absolute z-[1000] max-h-[20vh] p-1 top-8 left-0 min-w-full border bg-[#fefefe] overflow-y-auto rounded-md shadow-lg">
            {metricArr.map((option, id) => {
              return (
                <div
                  onClick={() =>
                    handleUpdateSelectedMetric({ index, value: option?.label })
                  }
                  key={id}
                  className={`text-[14px] font-normal w-full hover:text-white px-1 min-w-full ${dropDownCss}`}
                >
                  {option?.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <img
        onClick={handleRemoveSelectedMetric}
        src={`/assets/images/closecustom.svg`}
        alt="close"
        className="ml-2 cursor-pointer size-3"
      />
    </div>
  );
};
