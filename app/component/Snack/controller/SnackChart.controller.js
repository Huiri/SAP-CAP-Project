sap.ui.define([
	"sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"
], function(
	Controller, JSONModel
) {
	"use strict";

	return Controller.extend("project5.controller.SnackChart", {
        onInit : function(){
            var oData = {
                beverage : 0,
                beveragepercent : '',
                snack : 0,
                snackpercent : '',
                etc : 0,
                etcpercent : '',
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "state");
            this.onDataView();
        },
        toSnackthome : function(){
            this.getOwnerComponent().getRouter().navTo("SnackHome");
        },
        onDataView: async function () {
            var view = this.getView()
            const Snack = await $.ajax({
                type: "get",
                url: `/snack/Snack`
            })
            let SnackModel = new JSONModel(Snack.value);
            view.setModel(SnackModel, "SnackModel");
            let data = view.getModel("SnackModel");
            let a = 0.00, b = 0.00, c = 0.00;
            for (let i = 0; i < data.oData.length; i++) {
                let state = `/${i}/snack_category`;
                if (data.getProperty(state) === 'B') {
                    a++;
                }
                if (data.getProperty(state) === 'S') {
                    b++;
                }
                if (data.getProperty(state) === 'X') {
                    c++;
                }
            }
            view.getModel("state").setProperty("/beverage", a / data.oData.length * 100);
            view.getModel("state").setProperty("/snack", b / data.oData.length * 100);
            view.getModel("state").setProperty("/etc", c / data.oData.length * 100);

            view.getModel("state").setProperty("/beveragepercent", (a / data.oData.length * 100).toFixed(2) + '%');
            view.getModel("state").setProperty("/snackpercent", (b / data.oData.length * 100).toFixed(2) + '%');
            view.getModel("state").setProperty("/etcpercent", (c / data.oData.length * 100).toFixed(2) + '%');
        }	});
});