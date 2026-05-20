import React from 'react';
import AmazonTable from "../tables/AmazonTable";
import Loader from '../component/loader/loader';

class CampaignTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false
        };
      }
 

  componentDidMount() {
    this.setState({ loading: true });
    this.fakeRequest().then(() => {
         this.setState({ loading: false }); // showing the app
    });
  }

  fakeRequest = () => {
    return new Promise(resolve => setTimeout(() => resolve(), 2000));
  };

  render() {
    if (this.state.loading) {
      return <Loader/>
    }

    return (
        <>
        <div>
        <AmazonTable />
        </div>
        </>
    )
  }
}

export default CampaignTable;