export const PALETTE = [
  { id: "OsaPerformanceOverview", kpi: ["OSA", "PRO"], img: "/assets/images/widget/drag-map.png", default: false, type: "OsaPerformanceOverview", label: "OSA Performance Overview", rowSize: 1 },
  { id: "OsaByBrand", kpi: ["OSA"], img: "/assets/images/widget/drag-bar.png", default: false, type: "OsaByBrand", label: "OSA By Brand", rowSize: 2 },
  { id: "OosDaysOverview", kpi: ["OSA"], img: "/assets/images/widget/drag-bubble.png", default: false, type: "OosDaysOverview", label: "OOS Days Overview", rowSize: 2 },
  { id: "Focuscharts", kpi: ["OSA", "SOS", "PRO","OR","SOM"], img: "/assets/images/widget/focus-chart.png", default: true, type: "Focuscharts", label: "Category Focus", rowSize: 1 },
  { id: "PlatformChart", kpi: ["OSA", "SOS", "PRO","OR","CS","SOM"], img: "/assets/images/widget/graphical-chart.png", default: true, type: "PlatformChart", label: "Graphical Analysis", rowSize: 1 },
  //   { id: "comprehensive-breakdown", img: "/assets/images/widget/comprehensive-breakdown.png", type:"comprehensive-breakdown", label: "comprehensive-breakdown",rowSize: 1 },

  { id: "SosWidgets", kpi: ["SOS"], img: "/assets/images/widget/soswidget.png", default: false, type: "SosWidgets", label: "SOS Analysis", rowSize: 1 },
  
  // { id: "Focuscharts", kpi: "SOS", img: "/assets/images/widget/focus-chart.png", default: true, type: "Focuscharts", label: "Focuscharts", rowSize: 1 },
  // { id: "PlatformChart", kpi: "SOS", img: "/assets/images/widget/graphical-chart.png", default: true, type: "PlatformChart", label: "PlatformChart", rowSize: 1 },
  ...(([1].indexOf(JSON.parse(localStorage.getItem("active_client_project")??{})?.client_project_id)>-1)?[
    { id: 'DayonDayTable', kpi: ['OSA', 'SOS', 'PRO', 'CS', 'RR', 'OR'], img: "/assets/images/widget/comprehensive-breakdown.png", default: false, type: "DayonDayTable", label: "Day on Day Data", rowSize: 1 },
    { id: "PlatformDistribution", kpi: ['OSA', 'PRO', 'CS', 'RR'], img: "/assets/images/widget/comprehensive-breakdown.png", default: false, type: "PlatformDistribution", label: "Platform Distribution", rowSize: 1 },
  ]:[])
   
]; 