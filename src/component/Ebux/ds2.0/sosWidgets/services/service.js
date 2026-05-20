import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";

export const fetchSOSAnalysisData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/sos-widgets/fetch-sos-analysis-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}

export const fetchRankAnalysisData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/sos-widgets/fetch-rank-analysis-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
