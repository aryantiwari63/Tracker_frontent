/* eslint-disable no-console */
import React, { useEffect, useState, useReducer } from "react";
import { TagManagerProvider } from "../../../context/tagManagerContext";
import { _GET } from "../../../services/axios.method";
import { GET_ALL_TAGS } from "../../../utils/constants";
const initialFilters = {
    quickFilters: {
        created_on: [],
        platform: [],
        created_by: [],
        accounts: [],
    },
    calendar: { showCalendar: false, from: undefined },
}
export const stateSetter = (state, action) => {
    const { value, type } = action;
    switch (type) {
        case "CATEGORY":
            return (state = { ...state, category: value });
        case "QUICK_FILTERS": {
            const newState = { ...state };
            const filterState = newState["quickFilters"][value?.parentKey];
            // console.log("filterState>>>>", filterState);
            // if(filterState)
            if (value?.parentKey === "created_by" || value?.parentKey === 'accounts' || value?.parentKey === 'platform') {
                const index = filterState.findIndex((val) => val.id === value.id);

                if (index !== -1) {
                    newState["quickFilters"][value?.parentKey].splice(index, 1);
                } else {
                    newState["quickFilters"][value?.parentKey].push(value);
                }
            } else if (
                filterState &&
                filterState.length > 0 &&
                value.parentKey !== "created_by"
            ) {
                const index = filterState.findIndex((val) => val.id === value.id);
                if (value.value === "custom_date_range") {
                    newState["calendar"] = {
                        showCalendar: index > -1 ? false : true,
                        from: index > -1 ? undefined : value,
                    };
                }
                if (index === -1) {
                    // data exist but not a selected data
                    newState["quickFilters"][value?.parentKey] = [];
                    newState["quickFilters"][value?.parentKey].push(value);

                    // console.log("newState>>>>>>>>>>>>>", newState);
                } else {
                    //if data exist for selected data
                    newState["quickFilters"][value?.parentKey] = [];
                }
            } else {
                if (value.value === "custom_date_range") {
                    newState["calendar"] = { showCalendar: true, from: value };
                }
                newState["quickFilters"][value?.parentKey].push(value);
            }
            return (state = newState);
        }
        case "SEARCH": {
            return (state = { ...state, search: value });
        }
        // case "QUICK_FILTER_CREATED_BY": {
        //   console.log("value>>>>>>>", value);
        //   // return (state = { ...state, search: value });
        //   return;
        // }
        case "QUICK_FILTERS_DATE": {
            const newState = { ...state };
            const filterState = newState["quickFilters"][value?.parentKey];
            const index = filterState.findIndex((val) => val.id === value.id);
            filterState[index] = value;
            newState["quickFilters"][value?.parentKey] = filterState;
            newState["calendar"] = {
                showCalendar: index > -1 ? false : true,
                from: index > -1 ? undefined : value,
            };
            return (state = newState);
        }
        default:
            return state;
    }
};

export default function TagManage({ children }) {
    const [allTagsData, setAllTagsData] = useState([]);
    const [selectedCheckboxes, setSelectedCheckBoxes] = useState([]);
    const [isCreatedOrUpdated, setIsCreatedOrUpdated] = useState(false);
    const [searchTagName, setSearchTagName] = useState('');
    const [filters, dispatch] = useReducer(stateSetter, initialFilters);
    const [orderBy, setOrderBy] = useState({ key: 'created_at', order: '-1' });
    const [loading, setLoading] = useState(true);
    const [deletedData, setDeletedData] = useState([]);
    const serializeFilters = (filters) => {
        const params = new URLSearchParams();
    
        Object.keys(filters).forEach(key => {
            filters[key].forEach(filter => {
                Object.keys(filter).forEach(filterKey => {
                    params.append(`${key}[${filterKey}]`, filter[filterKey]);
                });
            });
        });
    
        return params.toString();
    };
    
    useEffect(()=>{
      const allTagsIds = allTagsData.map(ele=>ele.tag_id);
      const filterSelectedCheckboxes = selectedCheckboxes.filter(ele => allTagsIds.includes(ele));
      const allTagsSelectedData = allTagsData.filter(ele => filterSelectedCheckboxes.includes(ele.tag_id));
      if (JSON.stringify(filterSelectedCheckboxes) !== JSON.stringify(selectedCheckboxes)) {
        setSelectedCheckBoxes(filterSelectedCheckboxes);
        setDeletedData(allTagsSelectedData);
      }
    },[allTagsData, selectedCheckboxes])

    const fetchAllTagsApi = async () => {
        setLoading(true);
        try {
            let start_date = '';
            let end_date= '';
            if (filters.quickFilters.created_on.length) {
               const getRanges = filters.quickFilters.created_on[0].ranges;
               if (getRanges) {
                start_date = getRanges?.startDate;
                end_date = getRanges?.endDate;
               }
            }
            const queryParameters = serializeFilters(filters.quickFilters);
            const response = await _GET(
                `${GET_ALL_TAGS}?tagName=${searchTagName}&key=${orderBy.key}&order=${orderBy.order}&${queryParameters}&startDate=${start_date}&endDate=${end_date}&dashboard=true`
            );
            setAllTagsData(response.data.data.result);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllTagsApi();
    }, [searchTagName, orderBy, filters]);

    useEffect(() => {
        if (isCreatedOrUpdated) {
            fetchAllTagsApi();
            setIsCreatedOrUpdated(false);
        }
    }, [isCreatedOrUpdated])

    return (
        <TagManagerProvider value={{ allTagsData, selectedCheckboxes, setSelectedCheckBoxes, setIsCreatedOrUpdated, searchTagName, setSearchTagName, orderBy, setOrderBy, filters, dispatch, loading, deletedData, setDeletedData }}>
            {children}
        </TagManagerProvider>
    );
}
