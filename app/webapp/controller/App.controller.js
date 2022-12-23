sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
        },
        toRequest : function (){
          this.getOwnerComponent().getRouter().navTo("Request", {status : null});
        },
        toCompany : function (){
          this.getOwnerComponent().getRouter().navTo("GridCompany");
        },
        toMaterial : function(){
          this.getOwnerComponent().getRouter().navTo("GridMaterial");

        },
        toHome : function(){
          this.getOwnerComponent().getRouter().navTo("Home");

        },

		toSnack: function() {
      this.getOwnerComponent().getRouter().navTo("Snack");

		}
      });
    }
  );
  