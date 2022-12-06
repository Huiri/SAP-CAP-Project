sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter"
], function(
	Controller, JSONModel, formatter
) {
	"use strict";
    var table, argument, param;

	return Controller.extend("project1.controller.CompanyDetail", {
        formatter : formatter,
        onInit : async function (){
            this.getOwnerComponent().getRouter().getRoute("CompanyDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onMyRoutePatternMatched : async function(oEvent) {
            param = oEvent.getParameters();
            argument = oEvent.getParameter("arguments");
            let SelectedItem = oEvent.getParameter("arguments").num;
            table = oEvent.getParameter("arguments").table;
            let url = "/company/Company/" + SelectedItem;
            const Company = await $.ajax({
                type : "get",
                url : url
            })
            let CompanyModel = new JSONModel(Company);
            this.getView().setModel(CompanyModel, "CompanyModel");
  
        },
        toBack : function () {
            // window.history.go(-1);
            console.log(table);
            console.log(argument);
            console.log(param);
            if(table==="grid"){
                this.getOwnerComponent().getRouter().navTo("GridCompany");
            } else if(table === "responsive"){
                this.getOwnerComponent().getRouter().navTo("ResponsiveCompany");

            }  
        },

	});
});