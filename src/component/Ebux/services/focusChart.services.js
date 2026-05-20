import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";
export const fetchFocusChartData = async (focusKpi, kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
    try {
        
        const payload = {focusKpi, selectedFilters, selectedPlatform, isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-focus-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-focus-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        // eslint-disable-next-line no-console
        // console.log("fetchFocusChartData-response",{response});

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}