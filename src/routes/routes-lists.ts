import { lazy } from "react";
import { RouteList } from "../interfaces/route.interface";
import { ACCOUNT, ACTIVITY, CALCULATOR, DASHBOARD, } from "./route-path";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Account = lazy(() => import("../pages/Account"));
const Activity = lazy(() => import("../pages/Activity"));
const Calculator = lazy(() => import("../pages/Calculator"));


export const routeList: RouteList[] = [
	{
		path: DASHBOARD,
		component: Dashboard,
	},
	{
		path: ACCOUNT,
		component: Account,
	},
	{
		path: ACTIVITY,
		component: Activity,
	},
	{
		path: CALCULATOR,
		component: Calculator,
	},
];
