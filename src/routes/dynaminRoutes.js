import * as React from "react";

 export const HOMEComponent = React.lazy(() => import("../pages/Home"));


export const DASHBOARDComponent = React.lazy(() =>
  import("../pages/Dashboard")
);

