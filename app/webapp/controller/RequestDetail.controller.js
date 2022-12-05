sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
  "../model/formatter"
    ],
    function(Controller, JSONModel, formatter) {
      "use strict";
      var table;
      return Controller.extend("project1.controller.RequestDetail", {
        formatter: formatter,
        
        onInit : function() {
          this.getOwnerComponent().getRouter().getRoute("RequestDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onMyRoutePatternMatched : async function (oEvent){
          let SelectedNum = oEvent.getParameter("arguments").num;
          table = oEvent.getParameter("arguments").table;
          //설정해놓은 변수값 가져오기
          //manifest에서 선언한 변수를 가져오겠다 -> arguments
          let url = "/request/Request/" + SelectedNum;
          const Request = await $.ajax({
            type:"get",
            url : url
          });
          let RequestModel = new JSONModel(Request);
          this.getView().setModel(RequestModel, "RequestModel");
        },
        toBack : function () {
          if(table=="grid"){
            this.getOwnerComponent().getRouter().navTo("Request");
          }
        }
        
    
      });
    }
  );