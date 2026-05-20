import React from 'react'
import GlobalSummary from './globalMap'
import GlobalTable from './globalviewTable'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { APPLICATION_ROUTES } from '../../../../utils/constants';

export default function GlobalView() {
    const [loading,setLoading]=useState(false);
    const [kpiData,setKpiData]=useState({});
    const [client_projects,set_client_projects] =useState(JSON.parse(localStorage.getItem("client_projects") ?? "[]")); 

    const [active_client_project, setActiveClientProject] = useState({});
    const previous_active_client_project = useRef();
     const [regions,setRegions] = useState([]);
  const [countriesData,setCountriesData] = useState({});
    const [selectedRegion, setSelectedRegion] = useState("All"??active_client_project?.continent ?? 'Asia');
    
    useEffect(() => {
        const _client_projects=JSON.parse(localStorage.getItem("client_projects") ?? "[]");
        set_client_projects(_client_projects);
        const active_client = JSON.parse(localStorage.getItem("active_client_project") ?? "{}");
        previous_active_client_project.current = JSON.stringify(active_client);
        setActiveClientProject(active_client);
    }, []);
    useEffect(() => {
        if(!active_client_project?.continent){

            const active_client = JSON.parse(localStorage.getItem("active_client_project") ?? "{}");
            previous_active_client_project.current = JSON.stringify(active_client);
            setActiveClientProject(active_client);
            
        }
        // setSelectedRegion(active_client_project?.continent);
        setSelectedRegion("All");
    }, [active_client_project]);

    useEffect(() => {
        if(!client_projects?.length){

            const _client_projects=JSON.parse(localStorage.getItem("client_projects") ?? "[]");
            set_client_projects(_client_projects);
            
        }
    }, [client_projects]);
    

    const continent_country=useMemo(()=>{
        return client_projects?.filter(i=>(active_client_project?.account?i?.account==active_client_project?.account:true))?.map((project) => ({continent:project?.continent,country:project?.country,flag:project?.flag,project}))??[]
    },[client_projects,active_client_project])
     const handle_active_client_project_change = (new_active_client_project) => {
        if (previous_active_client_project.current != JSON.stringify(new_active_client_project)) {
          previous_active_client_project.current = JSON.stringify(new_active_client_project);
          localStorage.setItem("active_client_project", JSON.stringify(new_active_client_project));
          // setActiveClientProject(new_active_client_project);
          // window.location.reload();
        }
          window.location.href = APPLICATION_ROUTES.COMMONSCREEN;
      }

   
    return (
        <>
            <div className='flex flex row w-full gap-3 bg-gray-100'>
                <GlobalSummary kpiData={kpiData} setKpiData={setKpiData} loading={loading} setLoading={setLoading} handle_active_client_project_change={handle_active_client_project_change} regions={regions} setRegions={setRegions} countriesData={countriesData} setCountriesData={setCountriesData} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} continent_country={continent_country} active_client_project={active_client_project} />
                <GlobalTable kpiData={kpiData} setKpiData={setKpiData} loading={loading} setLoading={setLoading} handle_active_client_project_change={handle_active_client_project_change} countriesData={selectedRegion=="All"?(Object.values(countriesData??[])?.flat()):countriesData[selectedRegion]} continent_country={continent_country} active_client_project={active_client_project} />
            </div>
        </>

    )
}
