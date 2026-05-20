import React from "react";
import Loader from "../component/loader/loader";
// import CompareCalendar from "../component/Ebux/common-components/CompareCalendar";
import MainComponent1 from "../component/Ebux/ds2.0/common-components/MainComponent1";

class EbuxWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.fakeRequest().then(() => {
      this.setState({ loading: false }); // showing the app
    });
  }

  fakeRequest = () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  };

  render() {
    let kpi = this.props.kpi || "OSA";

    const activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    const enabledKPIs = activeClientProject.kpi || {};
    if(!enabledKPIs[this.props.kpi]){
      kpi = Object.entries(enabledKPIs).find(([, value]) => value)?.[0];
    }
    // const kpi = "RR" || this.props.kpi || "OSA";
    //console.log('00000000',kpi)
    
    return (
      <>
        <Loader isLoading={this.state.loading} />
        <div>
          <MainComponent1 mainKpi={kpi}/>
          {/* <CompareCalendar/> */}
        </div>
      </>
    );
  }
}

export default EbuxWidget;
