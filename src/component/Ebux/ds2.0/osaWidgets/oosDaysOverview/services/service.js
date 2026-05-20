import { _POST } from "../../../../../../services/axios.method";
import { BASE_URL } from "../../../../../../utils/url";

export const fetchOOSDaysOverviewData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/oos-widgets/fetch-oos-days-overview-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const fetchOOSDaysBreakdownData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/oos-widgets/fetch-oos-days-breakdown-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}