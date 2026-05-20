import BlinkitBudgetHistory from "./budgetHistory";
import BlinkitBudgetSummary from "./budgetSummary";
import BlinkitDailyBudget from "./dailyBudget";
import BudgetPacerHeaders from "../../common-components/BudgetPacer/budgetPacerHeader";

const BudgetPacerBlinkit = () => {
  return (
    <>
      {" "}
      <BudgetPacerHeaders
        summaryPage={<BlinkitBudgetSummary />}
        dailyPage={<BlinkitDailyBudget />}
        historyPage={<BlinkitBudgetHistory />}
      />
    </>
  );
};
export default BudgetPacerBlinkit;
