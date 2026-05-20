import { logEvent, setUserProperties } from "@firebase/analytics";
import { useLocation } from "react-router";
import { analytics } from "../services/firebase";
import { useEffect } from "react";

export const ScreenPath = () => {
  const location = useLocation();
  // const currentPath = location.pathname;
  // // const userId = localStorage.getItem("email"); // Use a custom user ID instead of email


  // logEvent(analytics, "Screen visit tracker", {
  //   pathName: currentPath == "/" ? "Login" : currentPath.replaceAll("/", " "),
  //   userName: localStorage.getItem("name"),
  // });


  // return null;
  useEffect(() => {
    logEvent(analytics, "screen_visit_tracker", {
      firebase_screen:
        location.pathname === "/" ? "Login" : location.pathname,
      user_name: localStorage.getItem("name") ?? "anonymous",
    });
  }, [location.pathname]);

  return null;
};

export const setUserProperty = async () => {
  const client_name = localStorage.getItem('client_name')
  // console.log(client_name,"cllllll")
  if (client_name)
    setUserProperties(analytics, { client_name });
}

export const trackDownload = async (name, title, type) => {
  const report_download_platform = localStorage.getItem('platform_type').replace(/"/g, '').substring(1)
  const report_name = name
  const report_title = title
  const report_type = type
  const report_ext = name.split('.')[1]
  //  console.error({report_download_platform,report_name,report_type,report_ext,report_title},"analytics")
  logEvent(analytics, "report_download", {
    report_download_platform,
    report_title,
    report_name,
    report_type,
    report_ext
  })
}

export const trackCard = async (name) => {
  //  console.error(name,"cardddd")
  logEvent(analytics, "metric_card_click", {
    card_name: name
  })
}

export const trackCampaignManagerTabs = (tab) => {
  // console.error(tab,"tabbbb")
  const tab_platform = localStorage.getItem('platform_type').replace(/"/g, '').substring(1)
  const tab_name = tab
  logEvent(analytics, "CM_tab_view", {
    tab_platform,
    tab_name
  })

}

export const trackCreateCampaignClick = () => {
  const platform = localStorage.getItem('platform_type').replace(/"/g, '').substring(1)
  logEvent(analytics, "create_campaign_clicked", {
    button_name: "Create",
    platform
  })
}

export const trackSelectedCampaignType = (selected_campaign_type) => {
  const platform = localStorage.getItem('platform_type').replace(/"/g, '').substring(1)
  logEvent(analytics, "selected_campaign_type", {
    selected_campaign_type,
    platform
  })
}

export const trackCampaignCreationSteps = (step_name) => {
  const platform = localStorage.getItem('platform_type').replace(/"/g, '').substring(1)
  logEvent(analytics, "creation_steps", {
    step_name,
    platform
  })
}

export const trackCampaignCreation = (message) => {
  logEvent(analytics, "campaign_created", {
    message,
  })
}


export const trackDashboardClick = ({ section, eventcategory, eventaction, eventlabel }) => {
  let data = {
    Section: section,
    Event: '',
    eventcategory: '',
    eventaction,
    eventlabel,
  };

  switch (section) {
    case 'Top filters':
      data.Event = 'top_filters_ds_dashboard';
      data.eventcategory = eventcategory
        ? `ds e-genie Top filters ${eventcategory}`
        : 'ds e-genie Top filters';
      break;

    case 'Dashboard sections':
      data.Event = 'dashboard_sections_ds';
      data.eventcategory = 'ds e-genie dashboard sections';
      break;

    case 'comprehensive breakdown':
      data.Event = 'comprehensive_breakdown';
      data.eventcategory = 'ds e-genie comprehensive breakdown';
      break;

    case 'category focus':
      data.Event = 'category_focus_download';
      data.eventcategory = eventcategory
        ? `ds e-genie category focus ${eventcategory}`
        : 'ds e-genie category focus';
      data.eventlabel = 'download';
      break;

    case 'graphical analysis':
      if (eventcategory === 'ds e-genie graphical analysis') {
        data.Event = 'graphical_analysis_download';
        data.eventlabel = 'download';
      } else if (eventcategory === 'ds e-genie graphical analysis filter') {
        data.Event = 'graphical_analysis_filter';
      }
      data.eventcategory = eventcategory;
      break;

    default:
      console.log(`Unhandled section in trackDashboardClick: ${section}`);
      return;
  }
  try {
    logEvent(analytics, "dashboard_data", data)
  }
  catch (err) {
    console.error(err, 'not working ')
  }
};
