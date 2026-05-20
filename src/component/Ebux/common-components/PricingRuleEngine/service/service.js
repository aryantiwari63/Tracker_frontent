
import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";
export const getAllPriceingRuleData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/get-all-priceing-rules?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
export const savePriceingRuleData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/save?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.status ?? {};
    } catch (error) {
        return {};
    }
}
export const editPriceingRuleData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/edit?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.status ?? {};
    } catch (error) {
        return {};
    }
}
export const deletePriceingRuleData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/delete?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const statusUpdatePriceingRuleData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/status-update?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const getProductAffectedData = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/get-product-affected-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        // return response?.data?.data ?? {};
        return response?.data?.data ?? {
            data: [],
            total: 0,
            page: 1,
            total_pages: 1
        };

    } catch (error) {
        return {};
    }
}
export const getHeaderCardSettings = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/get-header-card-settings?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const updateProductPricingOutput = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/update-product-pricing-output?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
export const getPriceingRuleById = async (payload = {}) => {
    try {
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/priceing-rule/get-priceing-rule-by-id?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? {};
    } catch (error) {
        return {};
    }
}
