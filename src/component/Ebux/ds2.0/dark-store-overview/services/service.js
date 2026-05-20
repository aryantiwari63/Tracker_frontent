import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";


export const fetchDarkStoreData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/dark-store/fetch-drill-down-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}

export const fetchDarkStoreComprehensiveBreakdownTableData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/dark-store/comprehensive-breakdown-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const fetchNDPFDarkStoreCoverage = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/dark-store/nd-pf-darkstore-coverage?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}