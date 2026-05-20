import BudgetSummary from "./budgetSummary";
import DailyBudget from "./dailyBudget";
import BudgetPacerHeaders from "../../common-components/BudgetPacer/budgetPacerHeader";
import BudgetHistory from "./budgetHistory";

const BudgetPacerAms = () => {
  return (
    <>
      <BudgetPacerHeaders
        summaryPage={<BudgetSummary />}
        dailyPage={<DailyBudget />}
        historyPage  = {<BudgetHistory/>}
      />
      
    </>
  );
};

export default BudgetPacerAms;
