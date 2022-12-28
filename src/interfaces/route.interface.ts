import { FC } from "react";

export interface RouteList {
	params?: { [key: string]: string };
	path: any;
	component: FC;
}