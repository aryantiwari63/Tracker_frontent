import TokenLogin from "../component/login/TokenLogin";
import { APPLICATION_ROUTES, APP_ROLE } from "../utils/constants";

import {
 
  DASHBOARDComponent,
 
} from "./dynaminRoutes";



let availableRoutes= [
  
{
    routePath: APPLICATION_ROUTES.DASHBOARD,
    component: DASHBOARDComponent,
    isPrivate: true,
    accessRoles: [
      APP_ROLE.ADMIN,
      APP_ROLE.OWNER,
      APP_ROLE.ANALYST,
      APP_ROLE.MANAGER,
    ],
    visibleAfterLogin: true,
    sidebar: "/dashboard",
  },

  {
     routePath: APPLICATION_ROUTES.TokenLogin,
    component: TokenLogin,
    isPrivate: false,
    accessRoles: [
      
    ],
    visibleAfterLogin: true,
    sidebar: "/dashboard",
  }
];

export default availableRoutes;
