sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
  "../model/formatter"
    ],
    function(Controller, JSONModel, formatter) {
      "use strict";
      var SelectedNum, FromWhere;
      return Controller.extend("project2.controller.RequestDetail", {
        formatter: formatter,
        
        onInit : function() {
          let layoutModel = new JSONModel({layout : false});
          this.getView().setModel(layoutModel, "layoutModel");

          let visibleModel = new JSONModel({footer : false, reject : false});
          this.getView().setModel(visibleModel, "visibleMode");

          this.getOwnerComponent().getRouter().getRoute("RequestDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
          this.getOwnerComponent().getRouter().getRoute("RequestDetailexpand").attachPatternMatched(this.onMyRoutePatternMatched2, this);
        },
        onBeforeRendering(){
          this.getView().getModel("visibleMode").setProperty("/footer",false);
        },
        onMyRoutePatternMatched : async function (oEvent){
          this.getView().getModel("visibleMode").setProperty("/footer",false);
          SelectedNum = oEvent.getParameter("arguments").num;
          FromWhere = oEvent.getParameter("arguments").where;
          //설정해놓은 변수값 가져오기
          //manifest에서 선언한 변수를 가져오겠다 -> arguments
          let url = "/request/Request/" + SelectedNum;
          const Request = await $.ajax({
            type:"get",
            url : url
          });
          let RequestModel = new JSONModel(Request);
          this.getView().setModel(RequestModel, "RequestModel");

          
          if(RequestModel.oData.request_state === 'B'){
            this.getView().getModel("visibleMode").setProperty("/footer",true);
            // visibleModel.oData.footer = true;
          } else if(RequestModel.oData.request_state === 'C'){
            this.getView().getModel("visibleMode").setProperty("/reject",false);
            // visibleModel.oData.reject = true;
          }
          
          this.getView().getModel("layoutModel").setProperty("/layout", false);
        },
        onMyRoutePatternMatched2 : async function (oEvent){
          this.getView().getModel("visibleMode").setProperty("/footer",false);
          SelectedNum = oEvent.getParameter("arguments").num;
          FromWhere = oEvent.getParameter("arguments").where;

          let url = "/request/Request/" + SelectedNum;
          const Request = await $.ajax({
            type:"get",
            url : url
          });
          let RequestModel = new JSONModel(Request);
          this.getView().setModel(RequestModel, "RequestModel");

          
          if(RequestModel.oData.request_state === 'B'){
            this.getView().getModel("visibleMode").setProperty("/footer",true);
            // visibleModel.oData.footer = true;
          } else if(RequestModel.oData.request_state === 'C'){
            // this.getView().getModel("visibleMode").setProperty("/footer",false);
            visibleModel.oData.reject = true;
          }

          this.getView().getModel("layoutModel").setProperty("/layout", true);
        },
        
        onBack : function () {
            console.log(FromWhere);
            if(FromWhere === "home"){
              this.getOwnerComponent().getRouter().navTo("RequestHome");
            } else if(FromWhere === "detail" || FromWhere === " ") {
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
                name:"project2.view.fragment.RejectReason"
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

        },
        onfull : function(){
          this.getOwnerComponent().getRouter().navTo("RequestDetailexpand", {num:SelectedNum, where : FromWhere});

        },
        onexitfull : function(){
          this.getOwnerComponent().getRouter().navTo("RequestDetail", {num:SelectedNum, where : FromWhere});

        }
        
    
      });
    }
  );