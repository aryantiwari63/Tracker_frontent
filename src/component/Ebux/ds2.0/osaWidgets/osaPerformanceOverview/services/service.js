import { _POST } from "../../../../../../services/axios.method";
import { BASE_URL } from "../../../../../../utils/url";

export const fetchPlatformPerformanceGraphicalAnalysisData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-platform-performance-graphical-analysis-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const fetchPlatformPerformanceData = async (payload={}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-platform-performance-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
// export const fetchOSAMoversAndShakersData = async (payload={}) => {
//     try {
//         let clientId = localStorage.getItem("client_id");
//         const response = await _POST(`${BASE_URL}ebux/osa-widgets/fetch-osa-movers-and-shakers-data?clientId=${clientId}`, payload, {
//             'Content-Type': 'application/json'
//         });
//         return response?.data?.data ?? [];
//     } catch (error) {
//         return [];
//     }
// }
