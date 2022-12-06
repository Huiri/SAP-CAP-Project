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
          let visibleModel = new JSONModel({footer : false, reject : false});
          this.getView().setModel(visibleModel, "visibleMode");
          this.getOwnerComponent().getRouter().getRoute("RequestDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onBeforeRendering(){
          this.getView().getModel("visibleMode").setProperty("/footer",false);
        },
        onMyRoutePatternMatched : async function (oEvent){
          this.getView().getModel("visibleMode").setProperty("/footer",false);
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

          
          console.log(RequestModel.oData.request_state);
          if(RequestModel.oData.request_state === 'B'){
            this.getView().getModel("visibleMode").setProperty("/footer",true);
            // visibleModel.oData.footer = true;
          } else if(RequestModel.oData.request_state === 'C'){
            // this.getView().getModel("visibleMode").setProperty("/footer",false);
            visibleModel.oData.reject = true;
          }
          
        },
        
        onBack : function () {
          if(table=="grid"){
            this.getOwnerComponent().getRouter().navTo("Request");
          }
        },
        onApprove : async function(){
          let temp = new JSONModel().oData;
          console.log(temp.request_number);
          temp.request_number = String(this.byId("ReqNum").getText());
          temp.request_state = "A";
          // var temp = {
          //   request_number : String(this.byId("ReqNum").getText()),
          //   request_state : "A"
          // }
          let url = "/request/Request/" + temp.request_number;
          await $.ajax ({
            type : "PATCH",
            url : url,
            contentType : "application/json;IEEE754Compatible=true",
            data : JSON.stringify(temp),

          });
          this.onBack();
        },
        onReject : function(){
          if(!this.pDialog){
            this.pDialog = this.loadFragment({
                name:"project1.view.fragment.RejectReason"
            });
          }

          this.pDialog.then(function(oDialog){
              oDialog.open();
          });

        },
        onInputRejectReason : async function(){
          let temp = new JSONModel().oData;
          temp.request_number = String(this.byId("ReqNum").getText());
          temp.request_state = "C";
          temp.request_reject_reason = String(this.byId("RejectReason").getValue());
          console.log(temp.request_number);
          console.log(temp.request_state);
          console.log(temp.request_reject_reason);
          let url = "/request/Request/" + temp.request_number;
          await $.ajax ({
            type : "PATCH",
            url : url,
            contentType : "application/json;IEEE754Compatible=true",
            data : JSON.stringify(temp),

          });
          this.onCancelRejectReason();
          this.onBack();

        }, 
        onCancelRejectReason : function(){
          this.byId("RejectReason").setValue("");
          this.byId("OrderRejectDialog").destroy();
          this.pDialog = null;

        }
        
    
      });
    }
  );