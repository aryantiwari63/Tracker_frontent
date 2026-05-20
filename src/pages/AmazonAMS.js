// import React from "react";
// import AmazonDashBoard from "../component/Amazon";
// import Loader from "../component/loader/loader";
// import BlinkItDashBoard from "../component/BlinkIt";
// // import BlinkItDashBoard from '../component/BlinkIt/Home';

// class AmazonAMS extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//     };
//   }

//   componentDidMount() {
//     this.setState({ loading: true });
//     this.fakeRequest().then(() => {
//       this.setState({ loading: false }); // showing the app
//     });
//   }

//   fakeRequest = () => {
//     return new Promise((resolve) => setTimeout(() => resolve(), 2000));
//   };

//   render() {
//     if (this.state.loading) {
//       return <Loader />;
//     }

//     return (
//       <>
//         <div>
//           {/* <AmazonDashBoard/> */}
//           <BlinkItDashBoard />
//         </div>
//       </>
//     );
//   }
// }

// export default AmazonAMS;
import React from "react";
// import BlinkDashBoard from "../component/BlinkIt";
import AmazonDashBoard from "../component/Amazon";

const AmazonAMS = () => {
  return (
    <>
      <AmazonDashBoard />
      {/* <BlinkDashBoard /> */}
      {/* <CommonScreenDashBoard /> */}
    </>
  );
};

export default AmazonAMS;
