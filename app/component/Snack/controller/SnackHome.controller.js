sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/model/json/JSONModel", 
	"../model/formatter"
], function(
	Controller, 
	JSONModel, 
	formatter
) {
	"use strict";

	return Controller.extend("project5.controller.SnackHome", {

		formatter : formatter,

		onInit() {
            this.getOwnerComponent().getRouter().getRoute("SnackHome").attachPatternMatched(this.onMyRoutePatternMatched, this);
            
        },

		onMyRoutePatternMatched : async function() {
            let waiting_url = "/snack/Snack?$filter=snack_status eq 'C'&$orderby=snack_date desc&$top=3";
            let stateTotal_url = "/snack/Snack?$apply=groupby((snack_status),aggregate(request_number%20with%20countdistinct%20as%20total))";
            const RecentRequest = await $.ajax({
                type : "get",
                url : waiting_url
            })
            // const RequestState = await $.ajax({
            //     type : "get",
            //     url : stateTotal_url
            // })
            let RecentRequestModel = new JSONModel(RecentRequest.value);
            this.getView().setModel(RecentRequestModel, "RecentRequestModel");

            // let StatusRequestModel = new JSONModel(RequestState.value);
            // this.getView().setModel(StatusRequestModel, "StatusRequestModel");


        },

		toSnackList: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("SnackList");
		},

		toSnackChart: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("SnackChart");

		}
	});
});