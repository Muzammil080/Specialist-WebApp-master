import { BaseModel } from "./base.model";

export class RouteInfoModel {
    routeId : number;
    title : string;
    path : string;
    icon : string;
    rootRouteId : number;
    meta : string;
    component : any;
    guard : any;

    constructor(routeId : number, title : string, path: string, icon : string, 
                    rootRouteId : number, meta : string, component : any, guard : any){
        this.routeId = routeId;
        this.title = title;
        this.path = path;
        this.icon = icon;
        this.rootRouteId = rootRouteId;
        this.meta = meta;
        this.component = component;
        this.guard = guard;
    }
}