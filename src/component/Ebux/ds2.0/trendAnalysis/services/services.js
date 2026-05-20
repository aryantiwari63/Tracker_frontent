import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";

export const fetchTrendAnalysisTabData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-trend-analysis-tab-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}

export const fetchTrendAnalysisTableData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-trend-analysis-table-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
