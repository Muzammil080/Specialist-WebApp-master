import { Pacs } from './main';
// import { PatientInfoService } from '../core/services/specialist/patientinfo.service';
// import { HttpService } from "../base/http.service";

// viewInstances.js 

/*jshint eqnull:true */
/*jslint plusplus: true */
/*jslint white: true */
/*global describe:true*/
/*jslint newcap: true*/
/*jslint nomen: true*/
/*jshint onevar: false */

/*global runExternalControllerCommand : false */
/*global window : false */

/*global logger : false */
/*global document : false */
/*global controller : false */
/*global ExternalCommandNames : false */
/*global updateGetImageHyperlink : false */
/*global Option : false */
/*global onChange_updateStudies : false */
/*global onChange_updateSeries : false */
/*global onChange_updateInstances : false */
/*global xxxxxxxxxxxxxxxx : false */
/*global xxxxxxxxxxxxxxxx : false */
/*global xxxxxxxxxxxxxxxx : false */
/*global xxxxxxxxxxxxxxxx : false */
export class ViewInstance {

    controller = new Pacs(null);
    ViewInstance() {

        var queryParams: any;
        // queryParams.options = {};
        // queryParams.options.SeriesOptions = {};
        // queryParams.options.SeriesOptions.SeriesInstanceUID = id;
        this.controller.QueryProxy.FindInstancesMax(queryParams, this.controller.maxInstanceQueryResults, this.onUpdateInstancesError, this.onUpdateInstancesSuccess);
    }


    onUpdateInstancesError(xhr, status, ex) {
  
    }

    onUpdateInstancesSuccess(instanceResults) {
        let instances = new Array();
        if (instanceResults && instanceResults.length > 0) {
            for (var i = 0; i < instanceResults.length; i++) {
                instances[i] = instanceResults[i].SOPInstanceUID;
            }
        }
     
    }

}