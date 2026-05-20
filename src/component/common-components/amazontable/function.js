export function getRuleConditionText(rule_conditions) {
  let tooltipText = [];
  rule_conditions?.map((conditionGroup, groupIndex) => {
    {
      if (groupIndex > 0) {
        tooltipText.push("OR");
      }
      conditionGroup?.map((condition, conditionIndex) => {
        tooltipText.push(`
            ${conditionIndex > 0 ? "AND " : ""} 
            ( If ${condition?.conditionCategory}${" "} is ${
              condition.conditionType != "is_not_in_range" ? "  " : ""
            }
            ${
              condition?.conditionType === "greater_than"
                ? "Greater than"
                : condition.conditionType === "smaller_than"
                ? "Less than"
                : condition.conditionType === "range"
                ? "Between"
                : condition.conditionType === "is_not_in_range"
                ? "n't between"
                : "-"
            }
            ${" "}
            ${
              condition?.conditionType === "range" ||
              condition?.conditionType === "is_not_in_range"
                ? `${condition?.less}-${condition?.greater}`
                : condition?.conditionType === "smaller_than"
                ? `${condition?.less}`
                : condition?.greater
            }
            ) `);
      });
    }
  });
  return tooltipText.join(" ");
}
