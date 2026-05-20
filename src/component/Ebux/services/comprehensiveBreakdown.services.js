import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const fetchComprehensiveBreakdownTabUniqueDataCount = async (kpi,breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows,tabData=[]) => {
    try {
        const payload = { 
            kpi,           
            breakdownFilters,
            filters,
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            tabData
        }
        let id_token= localStorage.getItem("id_token");
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/breakdown/tab-data?clientId=${clientId}`, payload, 
        //     {
        //     'Content-Type': 'application/json'
        // }
        {
            headers: {
              idtoken:id_token
            },
          }
    );
        return response?.data?.data ?? [];
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("fetchComprehensiveBreakdownData-response", { error });
        return [];
    }
}
export const fetchComprehensiveBreakdownData = async (kpi, datakey, dataLable, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, isPrevious = false,columnsData=[]) => {
    try {
        const payload = {
            kpi,
            datakey,
            dataLable,
            breakdownFilters,
            filters,
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            isPrevious,
            columnsData
        }
        // const response = await _POST(`${BASE_URL}ebux/breakdown/comprehensive-breakdown-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/breakdown/comprehensive-breakdown-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("fetchComprehensiveBreakdownData-response", { error });
        return [];
    }
}
export const fetchDailyBasisComprehensiveBreakdownData = async (kpi, datakey, dataValue, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, isPrevious = false,columnsData=[]) => {
    try {
        
        const payload = {
            kpi,
            datakey,
            dataValue,
            breakdownFilters,
            filters,
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            comprehensiveBreakdownTableData,
            isPrevious,
            columnsData
        }
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/breakdown/daily-comprehensive-breakdown-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}