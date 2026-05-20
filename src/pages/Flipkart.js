import React from "react";
import FlipkartDashBoard from "../component/flipkart";
import Loader from "../component/loader/loader";

class Flipkart extends React.Component {
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
    // if (this.state.loading) {
    //   return <Loader />;
    // }

    return (
      <>
        <Loader isLoading={this.state.loading} />
        <div>
          <FlipkartDashBoard />
        </div>
      </>
    );
  }
}

export default Flipkart;
