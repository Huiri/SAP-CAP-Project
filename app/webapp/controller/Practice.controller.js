sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.Practice", {
            onInit: function () {
                var oData = {
                    path :"project1.view.NestedView.MaterialHeader"
                }
                var oModel = new JSONModel(oData);

                this.getView().setModel(oModel, "test");


            }
        });
        
    });
 

