import BudgetPacerHeaders from "../../common-components/BudgetPacer/budgetPacerHeader";

import InstamartBudgetHistory from "./budgetHistory";
import InstamartBudgetSummary from "./budgetSummary";
import DailyBudgetInstamart from "./dailyBudget";

const BudgetPacerInsta = () => {
  return (
    <>
      {" "}
      <BudgetPacerHeaders
        summaryPage={<InstamartBudgetSummary />}
        dailyPage={<DailyBudgetInstamart />}
        historyPage={<InstamartBudgetHistory />}
      />
    </>
  );
};
export default BudgetPacerInsta;
