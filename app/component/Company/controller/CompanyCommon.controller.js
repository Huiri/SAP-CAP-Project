sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project3.controller.CompanyCommon", {

        onDataView : async function(){
            this.getView().byId("ui_table").setBusy(true);
            const Company =  await $.ajax({
                type : "get",
                url : "/company/Company"
            });
            this.getView().byId("ui_table").setBusy(false);

            let CompanyModel = new JSONModel(Company.value);
            this.getView().setModel(CompanyModel, "CompanyModel");

            totalNumber = this.getView().getModel("CompanyModel").oData.length;

            let TableIndex = "협력 업체 목록 (" + totalNumber +")";
            this.getView().byId("TableName").setText(TableIndex); 


        },
        onDelete : async function(key){
            let url = `/company/Company/${key}`;
            await fetch(url, {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json;IEEE754Compatible=true"
                }
            })
            this.getView().byId("ui_table").setBusy(false);


        }
	});
});