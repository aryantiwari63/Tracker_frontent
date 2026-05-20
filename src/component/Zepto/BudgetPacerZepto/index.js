import BudgetHistoryZepto from "./budgetHistory";
import DailyBudgetZepto from "./dailyBudget";
import BudgetSummaryZepto from "./budgetSummary";
import BudgetPacerHeaders from "../../common-components/BudgetPacer/budgetPacerHeader";

const BudgetPacerZepto = () => {
  return (
    <>
      <BudgetPacerHeaders
        summaryPage={<BudgetSummaryZepto />}
        dailyPage={<DailyBudgetZepto />}
        historyPage={<BudgetHistoryZepto />}
      />
    </>
  );
};

export default BudgetPacerZepto;
