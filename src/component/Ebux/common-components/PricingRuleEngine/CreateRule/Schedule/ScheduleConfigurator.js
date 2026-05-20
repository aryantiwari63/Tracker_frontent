import React, { forwardRef, useImperativeHandle } from "react";
import WeeklySchedule from "./WeeklySchedule";
import DatewiseSchedule from "./DatewiseSchedule";
import { Radio, Tab } from "./ScheduleUI";

const ScheduleConfigurator = forwardRef(({ is_edit, initSchedule, value, onChange }, ref) => {
  const { type, mode, weekly, datewise } = value;
  const update = (patch) => onChange({ ...value, ...patch });

  // ref to DatewiseSchedule
  const datewiseRef = React.useRef(null);
  const weeklyRef = React.useRef(null);


  // expose handleSave to parent
  useImperativeHandle(ref, () => ({
    handleSave: () => {
      if (type === "custom" && mode === "weekly") {
        return weeklyRef.current?.handleSave?.() ?? true;
      }
      if (type === "custom" && mode === "datewise") {
        return datewiseRef.current?.handleSave?.() ?? true;
      }
      return true;
    }
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-gray-900">Schedule</h3>

      <Radio
        label="Continuously"
        desc="Rule runs as often possible (usually every 2 hours)."
        checked={type === "continuous"}
        onChange={() => update({ type: "continuous" })}
      />

      <Radio
        label="Daily"
        desc="at 12:00 am Kolkata time"
        checked={type === "daily"}
        onChange={() => update({ type: "daily" })}
      />

      <Radio
        label="Custom"
        desc="Adjust the schedule to run on specific days and at specific times"
        checked={type === "custom"}
        onChange={() => update((is_edit && (["weekly", "datewise"].indexOf(initSchedule?.mode)>-1)) ? { ...initSchedule } :{ type: "custom", mode: "weekly" })}
      />
      {type === "custom" && (
        <>
          <div className="flex gap-2">
            <Tab active={mode === "weekly"} onClick={() => update(is_edit && initSchedule?.mode === "weekly" ? { ...initSchedule } : { mode: "weekly" })}>
              Weekly
            </Tab>
            <Tab active={mode === "datewise"} onClick={() => update(is_edit && initSchedule?.mode === "datewise" ? { ...initSchedule } : { mode: "datewise" })}>
              Datewise
            </Tab>
          </div>

          <p className="text-xs text-gray-500">
            Maximum 4 time frames can be scheduled.
          </p>

          {mode === "weekly" && (
            <WeeklySchedule
              ref={weeklyRef}
              value={weekly}
              onChange={(weekly) => update({ weekly })}
            />
          )}

          {mode === "datewise" && (
            <DatewiseSchedule
              ref={datewiseRef}
              value={datewise}
              onChange={(datewise) => update({ datewise })}
            />
          )}
        </>
      )}
    </div>
  );
});

ScheduleConfigurator.displayName = "ScheduleConfigurator";
export default ScheduleConfigurator;
