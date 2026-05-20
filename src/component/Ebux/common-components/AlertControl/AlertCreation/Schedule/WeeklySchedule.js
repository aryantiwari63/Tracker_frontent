import {
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import { Toggle, TimeInput, IconBtn } from "./ScheduleUI";

const DAYS = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday"
];

const WeeklySchedule = forwardRef(({ value = {}, onChange }, ref) => {
  const [errors, setErrors] = useState({});

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const newErrors = {};
    let hasAtLeastOne = false;

    DAYS.forEach(day => {
      const times = value[day] || [];

      if (times.length > 0) {
        hasAtLeastOne = true;
        times.forEach((t, idx) => {
          if (!t.time) {
            if (!newErrors[day]) newErrors[day] = {};
            newErrors[day][idx] = "Time is required";
          }
        });
      }
    });

    if (!hasAtLeastOne) {
      newErrors._general = "Please select at least one day and time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    handleSave: validate
  }));

  /* ---------------- ACTIONS ---------------- */

  const toggleDay = (day) => {
    // setErrors({});
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[day]; // ✅ remove only this day’s errors
      return copy;
    });

    const enabled = value[day]?.length;
    onChange({
      ...value,
      [day]: enabled ? [] : [{ time: "" }]
    });
  };

  const updateTime = (day, idx, time) => {
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[day]) delete copy[day][idx];
      return copy;
    });

    onChange({
      ...value,
      [day]: value[day].map((t, i) =>
        i === idx ? { time } : t
      )
    });
  };

  const addTime = (day) => {
    if (value[day].length >= 4) return;
    onChange({
      ...value,
      [day]: [...value[day], { time: "" }]
    });
  };

  const removeTime = (day, idx) => {
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[day]) delete copy[day][idx];
      return copy;
    });

    onChange({
      ...value,
      [day]: value[day].filter((_, i) => i !== idx)
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-3">
      {errors._general && (
        <div className="text-sm text-red-500 font-medium mb-4">
          {errors._general}
        </div>
      )}
      {DAYS.map(day => {
        const times = value[day] || [];
        const enabled = times.length > 0;

        return (
          <div key={day} className="flex items-start gap-3">
            <Toggle checked={enabled} onChange={() => toggleDay(day)} />
            <span className="w-24">{day}</span>

            <div className="flex gap-2">
              {times.map((t, i) => {
                const disabledTimes = times
                  .filter((_, idx) => idx !== i)
                  .map(t => t.time)
                  .filter(Boolean);

                return (
                  <div key={i} className="flex flex-col gap-1 ml-[16px]">
                    <div className="flex gap-2 items-center">
                      <p className="">Time Slot {i + 1} <span className="text-red-500">*</span></p>

                      <TimeInput
                        value={t.time}
                        disabledTimes={disabledTimes}   // ✅ FIX
                        onChange={(v) => updateTime(day, i, v)}
                      />
                      <IconBtn danger onClick={() => removeTime(day, i)}>✕</IconBtn>
                    </div>

                    {errors[day]?.[i] && (
                      <div className="text-xs text-red-500">
                        {errors[day][i]}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>

            {enabled && times.length < 4 && (
              <IconBtn onClick={() => addTime(day)}>＋ Add</IconBtn>
            )}
          </div>
        );
      })}
    </div>
  );
});

WeeklySchedule.displayName = "WeeklySchedule";
export default WeeklySchedule;
