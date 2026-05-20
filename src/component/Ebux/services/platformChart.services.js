import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";
export const fetchPlatformChartData = async (kpi, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
    try {

        const payload = {filters, selectedFilters, selectedPlatform,selectedOption,
            isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
export const fetchCompetitionPlatformChartData = async (kpi,filters,selectedFilters,  selectedOption,competitionBrand=[]) => {
    try {

        const payload = {kpi,filters, selectedFilters, competitionBrand,selectedOption}


        // const response = await _POST(`${BASE_URL}ebux/fetch-competition-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/fetch-competition-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}

export const fetchRRCompetitionPlatformChartData = async (kpi, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
    try {

        const payload = {filters, selectedFilters, selectedPlatform,selectedOption,
            isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-competition-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
export const fetchSOMCompetitionPlatformChartData = async (kpi, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
    try {

        const payload = {filters, selectedFilters, selectedPlatform,selectedOption,
            isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-competition-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}