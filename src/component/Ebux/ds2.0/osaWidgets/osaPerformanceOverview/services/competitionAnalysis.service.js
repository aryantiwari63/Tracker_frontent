import { _POST } from "../../../../../../services/axios.method";
import { BASE_URL } from "../../../../../../utils/url";

export const fetchCompetitionBrandAnalysisData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-competition-brand-analysis-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
export const fetchBrandAnalysisData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-brand-analysis-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
