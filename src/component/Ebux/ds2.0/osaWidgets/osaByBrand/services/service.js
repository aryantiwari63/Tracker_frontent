import { _POST } from "../../../../../../services/axios.method";
import { BASE_URL } from "../../../../../../utils/url";

export const fetchOSAByBrandAnalysisData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-osa-by-brand-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}