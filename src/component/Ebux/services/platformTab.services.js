import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const fetchKPIOverallData = async (kpi,filters, selectedFilters, selectedPlatform, isPrevious = false) => {
    try {
        const payload = {filters, selectedFilters, selectedPlatform,
            isPrevious,kpi
        }

      // const response = await _POST(`${BASE_URL}ebux/kpi-overall-report`, payload, {
      //   'Content-Type': 'application/json'
      // });

      let id_token= localStorage.getItem("id_token");
        let clientId = localStorage.getItem("client_id");
      const response = await _POST(`${BASE_URL}ebux/kpi-overall-report?clientId=${clientId}`, payload, 
      //   {
      //   'Content-Type': 'application/json'
      // }
      {
        headers: {
          idtoken:id_token
        },
      }
    );
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  };
export const fetchPlatformTabData = async (kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
    try {

        const payload = {filters, selectedFilters, selectedPlatform,
            isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-tab-data`, payload, {
        //     'Content-Type': 'application/json'
        // });

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-tab-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return {};
    }
}