import React, {  useState } from "react";
import MetricAnalyzerHeader from "./MetricAnalyzerHeader";
import Adgroup from "./Adgroup";
import Keywords from "./Keywords";
import Asins from "./Asins";
import Placement from "./Placement";
import Campaign from "./Campaign";
import { defaultDateRange } from "../../../utils/helpers";
import { format } from "date-fns";

const MetricAnalyzer = () => {
  const dateFilters = defaultDateRange();
  const [selectedMetric, setSelectedMetric] = useState("ctr");
  const [platform, setPlatform] = useState([]);
  const [campType, setCampType] = useState([
    { label: "Sponsored Product", value: "SP" },
    { label: "Sponsored Brand", value: "SB" },
    { label: "Sponsored Display", value: "SD" },
  ]);
  const [tags, setTags] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
      endDate: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
      key: dateFilters["key"],
    },
  ]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const onApply = () => {
    setShouldUpdate(true);
  };
  return (
    <>
      <div>
        <MetricAnalyzerHeader
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          platform={platform}
          setPlatform={setPlatform}
          campType={campType}
          setCampType={setCampType}
          tags={tags}
          setTags={setTags}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setShouldUpdate={setShouldUpdate}
          onApply={onApply}
        />
      </div>
      <Campaign
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        platform={platform}
        setPlatform={setPlatform}
        campType={campType}
        setCampType={setCampType}
        tags={tags}
        setTags={setTags}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApply={onApply}
      />
      <Adgroup
        selectedMetric={selectedMetric}
        platform={platform}
        campType={campType}
        dateRange={dateRange}
      />
      <Keywords
        selectedMetric={selectedMetric}
        platform={platform}
        campType={campType}
        dateRange={dateRange}
      />
      <Asins
        shouldUpdate={shouldUpdate}
        setShouldUpdate={setShouldUpdate}
        selectedMetric={selectedMetric}
        platform={platform}
        campType={campType}
        dateRange={dateRange}
      />
      <Placement
        shouldUpdate={shouldUpdate}
        setShouldUpdate={setShouldUpdate}
        selectedMetric={selectedMetric}
        platform={platform}
        campType={campType}
        dateRange={dateRange}
      />
    </>
  );
};

export default MetricAnalyzer;
