// import { 
//   // X, Plus, 
//   Trash2
//   // , Lock, Zap, AlertCircle 
// } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faTrash, faShield } from "@fortawesome/free-solid-svg-icons";

// import GuardrailsConstraints from './GuardrailsConstraints';
import ScheduleConfigurator from './Schedule/ScheduleConfigurator';
import { savePriceingRuleData, editPriceingRuleData } from '../service/service';
import { Link, useHistory, useLocation } from "react-router-dom";

const set_price_list = ["Fixed Price"
  // , "Increase By", "Decrease By"
];
const arithmetic_operators = [
  "+", "-", "*", "/"
]
const units = [
  "%", "Amount"
]
const apply_to_list = [
  "All Products", "By Category", "By Collection"
]

const competitor = [
  "Amazon",
  "Walmart",
  "Target"
];
const target_list = {
  under_cut: "Under Cut",
  increase_by: "Increase By",
  equal_to: "Equal To",
  set_price: "Set Price"
}
const our_price_is = {
  between: "With in Of",
  not_between: "Outside Of",
  equal_to: "Equal To",
  greater_than: "Higher Than",
  less_than: "Lower Than"
}
const init_pricing_rule = {
  active: true,
  is_delete: false,
  one_commerce_client_id: "",
  rule_name: "",
  description: "",
  apply_to: apply_to_list[0],
  or_rules: [
    {
      and_rules: [
        { our_price_is: Object.keys(our_price_is)[0], competitor: "", value1: 0, value2: 0, unit: units[0] }
      ]
    }
  ],
  then_actions: { price_action: 'Update Our Price to', target: Object.keys(target_list)[0], competitor: "", value: '0', unit: units[0] },
  with_limits_guardrails: {
    minimum_price: 0,
    maximum_price: 0,
    maximum_update_in_a_day: 5,
    minimum_inventory_level: 0
  },
  // schedule: ["0 */2 * * *"]
  schedule: {
    type: "continuous", // continuous | daily | custom
    mode: "", // weekly | datewise
    weekly: {},
    datewise: [{ date: "", times: [""] }]
  }
};
export default function CreateRule() {
  const scheduleRef = useRef(null);
  const location = useLocation();
  const edit_rule = location.state?.edit_rule || null;
  console.log('edit_ruleedit_rule', edit_rule)
  const history = useHistory();

  const [conditionsError, setConditionsError] = useState(null);
  const [thenActionError, setThenActionError] = useState(null);
  const [guardrailsError, setGuardrailsError] = useState(null);

  const [enabled, setEnabled] = useState(init_pricing_rule.active);
  const [ruleName, setRuleName] = useState(init_pricing_rule.rule_name);
  const [description, setDescription] = useState(init_pricing_rule.description);
  const [applyTo, setApplyTo] = useState(init_pricing_rule.apply_to);

  const [conditions, setConditions] = useState(init_pricing_rule.or_rules);
  const [thenAction, setThenAction] = useState(init_pricing_rule.then_actions);
  //eslint-disable-next-line no-unused-vars
  const [minPriceValue, setMinPriceValue] = useState(init_pricing_rule.with_limits_guardrails.minimum_price);
  //eslint-disable-next-line no-unused-vars
  const [maxPriceValue, setMaxPriceValue] = useState(init_pricing_rule.with_limits_guardrails.maximum_price);
  // const [maxPriceCeiling, setMaxPriceCeiling] = useState(init_pricing_rule.with_limits_guardrails.maximum_price);

  //eslint-disable-next-line no-unused-vars
  const [maxPriceChangeValue, setMaxPriceChangeValue] = useState(init_pricing_rule.with_limits_guardrails.maximum_update_in_a_day);
  //eslint-disable-next-line no-unused-vars
  const [minInventoryLevel, setMinInventoryLevel] = useState(init_pricing_rule.with_limits_guardrails.minimum_inventory_level);

  const [initSchedule, setInitSchedule] = useState(init_pricing_rule?.schedule);

  const [schedule, setSchedule] = useState(init_pricing_rule?.schedule);
  useEffect(() => {
    // if (edit_rule) {
    setEnabled(edit_rule?.active ?? init_pricing_rule.active);
    setRuleName(edit_rule?.rule_name ?? init_pricing_rule.rule_name);
    setDescription(edit_rule?.description ?? init_pricing_rule.description);
    setApplyTo(edit_rule?.apply_to ?? init_pricing_rule.apply_to);
    setConditions(edit_rule?.or_rules ?? init_pricing_rule.or_rules);
    setThenAction(edit_rule?.then_actions ?? init_pricing_rule.then_actions);
    setMinPriceValue(edit_rule?.with_limits_guardrails?.minimum_price ?? init_pricing_rule.with_limits_guardrails.minimum_price);
    setMaxPriceValue(edit_rule?.with_limits_guardrails?.maximum_price ?? init_pricing_rule.with_limits_guardrails.maximum_price);
    setMaxPriceChangeValue(edit_rule?.with_limits_guardrails?.maximum_update_in_a_day ?? init_pricing_rule.with_limits_guardrails.maximum_update_in_a_day);
    setMinInventoryLevel(edit_rule?.with_limits_guardrails?.minimum_inventory_level ?? init_pricing_rule.with_limits_guardrails.minimum_inventory_level);
    // setSchedule(edit_rule.schedule);
    const initScheduleValue = edit_rule?.schedule ? parseCrontabToSchedule(edit_rule?.schedule) : init_pricing_rule.schedule;
    setInitSchedule(initScheduleValue);
    setSchedule(initScheduleValue);

    // }
  }, [edit_rule]);




  const DAY_MAP = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  const DAY_REVERSE_MAP = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
  };

  function parseCrontabToSchedule(crons = []) {
    // CONTINUOUS
    if (crons.length === 1 && crons[0] === "0 */2 * * *") {
      return {
        type: "continuous",
        mode: "",
        weekly: {},
        datewise: [{ day: "", times: [""] }]
      };
    }

    // DAILY
    if (crons.length === 1 && crons[0] === "0 0 * * *") {
      return {
        type: "daily",
        mode: "",
        weekly: {},
        datewise: [{ day: "", times: [""] }]
      };
    }

    const weekly = {};
    const datewiseMap = {};

    crons.forEach(expr => {
      const [m, h, d, , w] = expr.split(" ");
      const time = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;

      // WEEKLY
      if (w !== "*") {
        const day = DAY_REVERSE_MAP[w];
        if (!weekly[day]) weekly[day] = [];
        weekly[day].push({ time });
      }

      // DATEWISE
      if (d !== "*") {
        if (!datewiseMap[d]) datewiseMap[d] = [];
        datewiseMap[d].push(time);
      }
    });

    if (Object.keys(weekly).length > 0) {
      return {
        type: "custom",
        mode: "weekly",
        weekly,
        datewise: [{ day: "", times: [""] }]
      };
    }

    return {
      type: "custom",
      mode: "datewise",
      weekly: {},
      datewise: Object.entries(datewiseMap).map(([day, times]) => ({
        day: Number(day),
        times
      }))
    };
  }


  function buildCrontab(schedule, timezone = "Asia/Kolkata") {
    const crons = [];

    // CONTINUOUS → every 2 hours
    if (schedule.type === "continuous") {
      crons.push({
        expression: "0 */2 * * *",
        timezone,
        type: "continuous"
      });
      return crons;
    }

    // DAILY → midnight
    if (schedule.type === "daily") {
      crons.push({
        expression: "0 0 * * *",
        timezone,
        type: "daily"
      });
      return crons;
    }

    // WEEKLY
    if (schedule.type === "custom" && schedule.mode === "weekly") {
      Object.entries(schedule.weekly).forEach(([day, times]) => {
        times.forEach(({ time }) => {
          if (!time) return;
          const [h, m] = time.split(":");
          crons.push({
            expression: `${m} ${h} * * ${DAY_MAP[day]}`,
            timezone,
            type: "weekly"
          });
        });
      });
    }

    // DATEWISE
    if (schedule.type === "custom" && schedule.mode === "datewise") {
      schedule.datewise.forEach(({ times, day }) => {
        if (!day) return;
        times.forEach(time => {
          if (!time) return;
          const [h, m] = time.split(":");
          crons.push({
            expression: `${m} ${h} ${day} * *`,
            timezone,
            type: "datewise"
          });
        });
      });
    }

    return crons;
  }


  const handleCreateRule = async () => {

    const crontab = buildCrontab(schedule);
    if (ruleName.trim() === "") {
      alert("Please enter a rule name.");
      return;
    }
    let errorMessage = null;
    const filterConditions = conditions
      .map((orRule, orIdx) => {
        const validAndRules = [];

        for (let andIdx = 0; andIdx < orRule.and_rules.length; andIdx++) {
          const andRule = orRule.and_rules[andIdx];

          const label = `OR ${orIdx + 1}, condition ${andIdx + 1}`;
          if (!andRule.competitor?.trim()) {
            errorMessage = `Please select a competitor in ${label}.`;
            break;
          }

          const v1 = Number(andRule.value1);
          const v2 = Number(andRule.value2);
          const op = andRule.value1;


          if (Number.isNaN(v2)) {
            errorMessage = `Please enter a valid number in ${label}.`;
            break;
          }

          if (andRule.unit === "%" && v2 > 100) {
            errorMessage = `Percentage cannot exceed 100 in ${label}.`;
            break;
          }

          if (["between", "not_between"].includes(andRule.our_price_is)) {
            if (Number.isNaN(v1)) {
              errorMessage = `Please enter a valid number in ${label}.`;
              break;
            }

            if (andRule.unit === "%" && v1 > 100) {
              errorMessage = `Percentage cannot exceed 100 in ${label}.`;
              break;
            }

            if (!(v1 >= 0 && v2 > 0 && v1 < v2)) {
              errorMessage = `Invalid range in ${label}.`;
              break;
            }
          }

          if (["equal_to", "greater_than", "less_than"].includes(andRule.our_price_is)) {
            if (["*", "/"].includes(op) && v2 < 1) {
              errorMessage = `Value must be ≥ 1 for * or / in ${label}.`;
              break;
            }
            if (!["*", "/"].includes(op) && v2 < 0) {
              errorMessage = `Value cannot be negative in ${label}.`;
              break;
            }
          }

          validAndRules.push(andRule);
        }

        return { and_rules: validAndRules };
      })
      .filter(orRule => orRule.and_rules.length > 0);

    if (errorMessage) {
      setConditionsError(errorMessage);
      return;
    }
    if (filterConditions.length === 0) {
      setConditionsError("Please add at least one valid condition.");
      return;
    }
    if (thenAction.competitor.trim() === "") {
      setThenActionError("Please select a competitor for then action.");
      return;
    }
    if (
      thenAction.target === "set_price" &&
      thenAction.competitor !== "Fixed Price"
    ) {
      setThenActionError("Invalid then action configuration.");
      return;
    }

    if (thenAction.target != "equal_to" && (Number(thenAction.value) || 0) === 0) {
      setThenActionError("Please enter a value for then action.");
      return;
    }
    if (thenAction.unit === "%" && (Number(thenAction.value) || 0) > 100) {
      setThenActionError("Percentage cannot exceed 100 for then action.");
      return;
    }
    if (minPriceValue < 0) {
      setGuardrailsError("Minimum Price cannot be negative.");
      return;
    }
    if (maxPriceValue < 0) {
      setGuardrailsError("Maximum Price cannot be negative.");
      return;
    }
    if (maxPriceValue < minPriceValue) {
      setGuardrailsError("Maximum Price cannot be less than Minimum Price.");
      return;
    }
    if (maxPriceChangeValue <= 0) {
      setGuardrailsError("Maximum Price Change must be greater than zero.");
      return;
    }
    if (thenAction.target == "equal_to") {
      setThenAction(old => ({ ...old, value: "0", unit: units[1] }));
    }
    if (thenAction.target == "set_price") {
      setThenAction(old => ({ ...old, unit: units[1] }));
    }
    //scheduleRef validation
    if (!scheduleRef.current) return;
    const isValid = scheduleRef.current.handleSave();
    if (!isValid) return;
    //scheduleRef validation
    const payload = {
      active: enabled,
      is_delete: false,
      rule_name: ruleName,
      description: description,
      apply_to: applyTo,
      or_rules: filterConditions,
      then_actions: thenAction,
      with_limits_guardrails: {
        minimum_price: minPriceValue,
        maximum_price: maxPriceValue,
        maximum_update_in_a_day: maxPriceChangeValue,
        minimum_inventory_level: minInventoryLevel
      },
      schedule: crontab.map(c => c.expression)
    };
    if (edit_rule) {
      // await editPriceingRuleData({
      //   id: edit_rule.id,
      //   ...payload
      // });
      // alert("Pricing Rule updated successfully!");


      const response = await editPriceingRuleData({
        id: edit_rule.id,
        ...payload
      });
      if (response?.code === 200) {
        alert("Pricing Rule updated successfully!");
        history.push("/pricing-rule-engine");
      } else {
        alert(response?.message || "Failed to save Pricing Rule");
      }

    } else {
      const response = await savePriceingRuleData(payload);
      console.log('response?.code',response)
      if (response?.code === 200) {
        alert("Pricing Rule saved successfully!");
        history.push("/pricing-rule-engine");
      } else {
        alert(response?.message || "Failed to save Pricing Rule");
      }

    }

    console.log("FINAL PAYLOAD 👉", payload);
  };
  const updateAndRule = (orIdx, andIdx, patch) => {
    setConditions(prev =>
      prev.map((orRule, i) =>
        i === orIdx
          ? {
            ...orRule,
            and_rules: orRule.and_rules.map((andRule, j) =>
              j === andIdx ? { ...andRule, ...patch } : andRule
            )
          }
          : orRule
      )
    );
  };

  const addOrCondition = () => {
    setConditions(prev => [
      ...prev,
      { and_rules: [{ ...init_pricing_rule.or_rules[0].and_rules[0] }] }
    ]);
  };

  const addAndCondition = (orIdx) => {
    setConditions(prev =>
      prev.map((orRule, i) =>
        i === orIdx
          ? {
            ...orRule,
            and_rules: [
              ...orRule.and_rules,
              { ...init_pricing_rule.or_rules[0].and_rules[0] }
            ]
          }
          : orRule
      )
    );
  };

  const deleteOrCondition = (orIdx) => {
    setConditions(prev => prev.filter((_, i) => i !== orIdx));
  };

  const deleteAndCondition = (orIdx, andIdx) => {
    setConditions(prev =>
      prev.map((orRule, i) =>
        i === orIdx
          ? {
            ...orRule,
            and_rules: orRule.and_rules.filter((_, j) => j !== andIdx)
          }
          : orRule
      )
    );
  };
  const normalizeValue2 = (operator, rawValue) => {
    const value = Number(rawValue) || 0;

    if (["*", "/"].includes(operator)) {
      return (value < 1) ? 1 : value;
    }
    return value;
  };
  return (
    <div className="bg-white rounded-xl shadow-2xl w-full mb-8">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {edit_rule ? "Edit Pricing Rule" : "Create New Pricing Rule"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">Define conditions, actions, and guardrails for intelligent price optimization</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          {/* <X size={24} /> */}
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Rule Name *</label>
          <input
            type="text"
            placeholder="e.g., Amazon Price Match - Electronics"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Description (Optional)</label>
          <textarea
            placeholder="Describe what this rule does and when it should be applied..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Apply To</label>
          <select
            value={applyTo}
            onChange={(e) => setApplyTo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {apply_to_list?.map((e, i) => <option key={i} disabled={i > 0} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-lg w-[40px] h-[40px]">
              <div className='bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                ?
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">IF - Define Conditions</h3>
          </div>
          {conditionsError && (
            <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {conditionsError}
            </div>
          )}


          {conditions.map((condition, idx) => (
            <React.Fragment key={idx}>
              <div key={`condition-${idx}`} className="space-y-3 bg-white rounded-lg p-4">

                {condition?.and_rules?.map((sub_condition, sub_idx) => (

                  <div key={`condition-${idx}-${sub_idx}`} className="flex flex-col gap-3 items-start w-full">
                    <div className="flex gap-3 items-center w-full" >
                      <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700 flex-1">
                        Our Price Is
                        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full"
                          value={sub_condition.our_price_is}
                          onChange={(e) => {
                            let updated = { our_price_is: e.target.value };
                            if (e.target.value == "between" || e.target.value == "not_between") {
                              updated = { ...updated, value1: 0, value2: 0 };
                            } else {
                              updated = { ...updated, value1: "+", value2: 0 };
                            }

                            updateAndRule(idx, sub_idx, updated)
                          }}

                        >
                          {Object.keys(our_price_is)?.map((e, i) => <option key={i} value={e}>{our_price_is[e]}</option>)}
                        </select>
                      </label>
                      <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700 flex-1">
                        Competitor
                        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full"
                          value={sub_condition.competitor}
                          onChange={(e) => {
                            updateAndRule(idx, sub_idx, { competitor: e.target.value })
                          }}
                        >
                          <option value={""}>Select-Competitor</option>
                          {competitor?.map((e, i) => <option key={i} value={e}>{e}</option>)}
                        </select>
                      </label>
                      <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700">
                        By
                        {(sub_condition.our_price_is == "not_between" || sub_condition.our_price_is == "between") ?
                          <div className='flex w-full gap-2 items-center bg-gray-200  border border-gray-200 rounded-lg '>
                            <input type="number" min="0" placeholder="90"
                              value={(sub_condition?.value1)}
                              onBlur={(e) =>
                                updateAndRule(idx, sub_idx, {
                                  value1: (Number(e.target.value) || 0)
                                })
                              }
                              onChange={(e) =>
                                updateAndRule(idx, sub_idx, {
                                  value1: e.target.value
                                })
                              }
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-20" />
                            <span className="text-gray-500">
                              {sub_condition.our_price_is == "between" ? <>&gt; &lt;</> : <>&lt; &gt;</>}
                            </span>
                            <input type="number" min="0" placeholder="95"
                              value={(sub_condition?.value2)}
                              onBlur={(e) =>
                                updateAndRule(idx, sub_idx, {
                                  value2: (Number(e.target.value) || 0)
                                })
                              }
                              onChange={(e) =>
                                updateAndRule(idx, sub_idx, {
                                  value2: e.target.value
                                })
                              }
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-20" />
                          </div>
                          :
                          <div className='flex w-full gap-2 items-center bg-gray-200 border border-gray-200 rounded-lg '>
                            {/* <span className="text-gray-500">
                              {sub_condition.our_price_is == "less_than" ? <>&lt;</> : sub_condition.our_price_is == "greater_than" ? <> &gt;</> : <>=</>}
                            </span> */}
                            <div className="relative">
                              <select
                                className="appearance-none cursor-pointer px-3 py-2 border border-gray-200 rounded-lg text-sm bg-[#FFFFFF]"
                                value={arithmetic_operators.indexOf(sub_condition.value1) > -1 ? sub_condition.value1 : "+"}
                                onChange={(e) => {
                                  const op = e.target.value;
                                  updateAndRule(idx, sub_idx, {
                                    value1: op,
                                    value2: ["*", "/"].includes(op) ? 1 : 0
                                  });
                                }}
                              >
                                {arithmetic_operators?.map((e, i) => <option key={i} value={e}>{e}</option>)}
                              </select>
                            </div>
                            <input type="number" min={["*", "/"].indexOf(sub_condition.value1) > -1 ? 1 : 0} placeholder="95"
                              value={(sub_condition?.value2)}
                              onBlur={(e) =>
                                updateAndRule(idx, sub_idx, {
                                  value2: normalizeValue2(sub_condition.value1, e.target.value)
                                })
                              }
                              onChange={(e) =>
                                updateAndRule(idx, sub_idx, {
                                  value2: e.target.value
                                })
                              }
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-20" />
                          </div>}
                      </label>
                      <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700">
                        Unit
                        <select className={`px-3 py-2 border border-gray-200 rounded-lg text-sm `}
                          value={sub_condition.unit}
                          onChange={(e) =>
                            updateAndRule(idx, sub_idx, { unit: e.target.value })
                          }
                        >

                          {units?.map((e, i) => <option key={i} value={e}>{e}</option>)}
                        </select>
                      </label>
                      {conditions[idx].and_rules.length > 1 && (
                        <button onClick={() => deleteAndCondition(idx, sub_idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end">
                          {/* <Trash2 size={18} /> */}
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100">
                            <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
                          </div>
                        </button>
                      )}
                    </div>
                    {sub_idx < conditions[idx].and_rules.length - 1 && <div className="items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg transition-colors font-medium text-sm">AND</div>}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <button onClick={() => addAndCondition(idx)} className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-lg transition-colors font-medium text-sm">
                    {/* <Plus size={16} /> */}
                    + AND
                  </button>

                  {conditions.length > 1 && (
                    <button onClick={() => deleteOrCondition(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      {/* <Trash2 size={18} /> */}
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100">
                        <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
              {idx < conditions.length - 1 && <div key={`or-${idx}`} className="text-left px-2 my-3 text-gray-700 font-semibold text-sm">OR</div>}
            </React.Fragment>
          ))}



          <button onClick={() => addOrCondition()} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm">
            {/* <Plus size={16} /> */}
            Add Another Condition (OR)
          </button>
        </div>

        <div className="bg-green-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2.5 rounded-lg w-[40px] h-[40px]">

              <FontAwesomeIcon
                icon={faBolt}
                className="text-white w-5 h-5"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">THEN - Define Action</h3>
          </div>

          {thenActionError && (
            <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {thenActionError}
            </div>
          )}

          <div className="space-y-3 bg-white rounded-lg p-4">

            <div className="flex gap-3 items-end">
              <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700 flex-1">
                Price Action
                <div
                  className='px-3 py-2 border border-gray-200 rounded-lg text-sm w-full'
                >
                  Update Our Price to
                </div>
              </label>
              <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700 flex-1">
                Target
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full"
                  value={thenAction.target}
                  onChange={(e) => {
                    setThenAction(old => {
                      const updated = { ...old, target: e.target.value };
                      if (e.target.value == "set_price") {
                        updated.competitor = set_price_list[0];
                        updated.value = "0";
                        updated.unit = units[1];
                      } else if (e.target.value == "equal_to") {
                        updated.value = "0";
                        updated.unit = units[1];
                      } else {
                        updated.value = "0";
                        updated.unit = units[0];
                      }
                      return updated;
                    });
                  }}
                >
                  {Object.keys(target_list)?.map((e, i) => <option key={i} value={e}>{target_list[e]}</option>)}
                </select>
              </label>
              {(() => {
                const values = [];
                if (thenAction.target == "set_price") {
                  values.push(...set_price_list);
                } else {
                  const competitor = [...new Set(conditions.flatMap(r => r.and_rules.map(a => a.competitor).filter(Boolean).map(c => `${c} By`)))];
                  values.push(...[...competitor, ...((competitor.length > 1) ? ["Higher One By", "Lower One By"] : [])]);
                }
                return (
                  <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700 flex-1">
                    Competitor
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex-1 w-full"
                      value={
                        values?.indexOf(thenAction.competitor) > -1 ? thenAction.competitor : ""
                      }
                      onChange={(e) => {
                        setThenAction(old => ({ ...old, competitor: e.target.value }));
                      }}
                    >
                      <option value={""}>Select-Competitor</option>
                      {values?.map((e, i) => <option key={i} value={`${e}`} >{`${e}`}</option>)}
                    </select>
                  </label>
                )
              })()}
              {thenAction.target == "equal_to" ? <></> :
                <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700">
                  Value
                  <input
                    type="number"
                    className='px-3 py-2 border border-gray-200 rounded-lg text-sm flex-1 w-full'
                    value={thenAction.value}
                    onBlur={(e) =>
                      setThenAction(old => ({ ...old, value: Number(e.target.value) || 0 }))
                    }
                    onChange={(e) =>
                      setThenAction(old => ({ ...old, value: e.target.value }))
                    }
                  />
                </label>}

              {
                <label className="flex flex-col items-start gap-2 text-sm font-medium text-gray-700 ">
                  Unit
                  <select disabled={(thenAction.target == "equal_to") || (thenAction.target == "set_price" && thenAction.competitor == set_price_list[0])} className={`px-3 py-2 border border-gray-200 rounded-lg text-sm `}
                    value={thenAction.unit}
                    onChange={(e) => {
                      setThenAction(old => ({ ...old, unit: e.target.value }));
                    }}
                  >

                    {units?.map((e, i) => <option key={i} value={e}>{e}</option>)}
                  </select>
                </label>}
            </div>

          </div>

        </div>
        {/* <GuardrailsConstraints
          minPriceValue={minPriceValue}
          setMinPriceValue={setMinPriceValue}
          maxPriceCeiling={maxPriceCeiling}
          setMaxPriceCeiling={setMaxPriceCeiling}
          maxPriceChangeValue={maxPriceChangeValue}
          setMaxPriceChangeValue={setMaxPriceChangeValue}
          minInventoryLevel={minInventoryLevel}
          setMinInventoryLevel={setMinInventoryLevel}
        /> */}
        <div className="bg-orange-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faShield} className="text-white text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">WITH LIMITS - Guardrails & Constraints</h3>
          </div>

          {guardrailsError && (
            <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {guardrailsError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Minimum Price (Floor)</label>
              <input type="number" min="0" placeholder="0" value={minPriceValue}
                onBlur={(e) => setMinPriceValue((Number(e.target.value) || 0))}
                onChange={(e) => {
                  setMinPriceValue(e.target.value);
                }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Maximum Price (Ceiling)</label>
              <input type="number" min="0" placeholder="0" value={maxPriceValue}
                onBlur={(e) => setMaxPriceValue((Number(e.target.value) || 0))}
                onChange={(e) => {
                  setMaxPriceValue(e.target.value);
                }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Max Price Change Per Day</label>
              <input type="number" min="1" placeholder="0" value={maxPriceChangeValue}
                onBlur={(e) => setMaxPriceChangeValue((Number(e.target.value) || 1))}
                onChange={(e) => {
                  setMaxPriceChangeValue(e.target.value);
                }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Minimum Inventory Level</label>
              <input disabled type="number" min="0" placeholder="0" value={minInventoryLevel}
                onBlur={(e) => setMinInventoryLevel((Number(e.target.value) || 0))}
                onChange={(e) => {
                  setMinInventoryLevel(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3">
            {/* <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-900">Apply Time-Based Restrictions</span>
            </label>

            <div className="grid grid-cols-3 gap-3 pl-7">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Active Days</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>All Days</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Start Time</label>
                <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="--:-- --" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">End Time</label>
                <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="--:-- --" />
              </div>
            </div> */}

            <ScheduleConfigurator value={schedule} is_edit={edit_rule ? true : false} initSchedule={initSchedule} onChange={setSchedule} ref={scheduleRef} />
          </div>
        </div>

      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-end">
        {/* <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Enable Rule</span>
          </label>
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm">
            Test Rule
          </button>
        </div> */}

        <div className="flex gap-3">

          <Link to={"/pricing-rule-engine"} className="px-6 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </Link>
          <button
            onClick={handleCreateRule} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            {edit_rule ? "Update Rule" : "Create Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
