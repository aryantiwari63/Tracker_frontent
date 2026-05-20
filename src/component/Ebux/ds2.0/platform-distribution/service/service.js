import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";

export const fetchPlatformDistributionData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/widget/fetch-platform-distribution-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const fetchPlatformDistributionFooterData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/widget/fetch-platform-distribution-footer-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}

