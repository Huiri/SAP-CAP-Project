sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter"
], function(
	Controller, JSONModel, formatter
) {
	"use strict";

	return Controller.extend("project2.controller.Request_home", {
        formatter : formatter,
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RequestHome").attachPatternMatched(this.onMyRoutePatternMatched, this);
            
        },
        onMyRoutePatternMatched : async function() {
            let waiting_url = "/request/Request?$filter=request_state eq 'B'&$orderby=request_number desc&$top=3";
            let stateTotal_url = "/request/Request?$apply=groupby((request_state),aggregate(request_number%20with%20countdistinct%20as%20total))";
            const RecentRequest = await $.ajax({
                type : "get",
                url : waiting_url
            })
            const RequestState = await $.ajax({
                type : "get",
                url : stateTotal_url
            })
            let RecentRequestModel = new JSONModel(RecentRequest.value);
            this.getView().setModel(RecentRequestModel, "RecentRequestModel");

            let StatusRequestModel = new JSONModel(RequestState.value);
            this.getView().setModel(StatusRequestModel, "StatusRequestModel");


        },
        onRequest_list : function(){
            this.getOwnerComponent().getRouter().navTo("Request", {status : " "});
        },
        onRequest_state : function() {
            this.getOwnerComponent().getRouter().navTo("RequestChart");
        },
        onPress : function(){

        },
        onNavToDetail : function(oEvent){
            let data_path = oEvent.getSource().oBindingContexts.RecentRequestModel.sPath;
            let SelectedKey = this.getView().getModel("RecentRequestModel").getProperty(data_path).request_number;
            this.getOwnerComponent().getRouter().navTo("RequestDetailexpand", {num : SelectedKey, where : "home"});
        },
        onStateClick : function(sButtonText, sVal){
            this.getOwnerComponent().getRouter().navTo("Request", {status: sVal});
            console.log(sVal);
        }
 	});
});