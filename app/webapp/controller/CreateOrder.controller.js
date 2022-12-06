sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageBox",
], // 사용할 모듈 선언
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    
    function ( Controller, JSONModel, MessageBox) {//불러온 모듈의 별칭 선언
        "use strict";
        let Today, CreateNum;
        return Controller.extend("project1.controller.CreateOrder", { // 소괄호 안의 경로 파일을 컨트롤러로 사용하겠다는 선언
            onInit: function () {
                const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateOrder");
                myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
            },
            onMyRoutePatternMatched : function(oEvent) {
    
                this.onReset();
                CreateNum = parseInt(oEvent.getParameter("arguments").num) + 1;

                let now = new Date();
                Today = now.getFullYear() + "-" +(now.getMonth()+1).toString().padStart(2,'0')+"-"+now.getDate().toString().padStart(2, '0');

                this.getView().byId("ReqNum").setText(CreateNum);
                this.getView().byId("ReqDate").setText(Today);
            },
            onErrorMessageBoxPress: function () {
                let requestor = this.byId("Requestor").getValue();
                let req_good = this.byId("ReqGood").getValue();
                let req_qty = this.byId("ReqQty").getValue();
                let req_price = this.byId("ReqPrice").getValue();
                let req_reason = this.byId("ReqReason").getValue();
                let msg;
                if(req_good !== null && req_good !== "" && req_qty !== null && req_qty !== "" 
                 && requestor !== null && requestor !== "" && req_price !== null && req_price !== "" 
                 && req_reason !== null && req_reason !== ""){
                    return;
                } else if(req_good === null || req_good === "") {
                    msg = "요청 물품을 입력해주세요.";
                } else if(req_qty === null || req_qty === "") {
                    msg = "물품 개수를 입력해주세요.";
                } else if(requestor === null || requestor === "") {
                    msg = "요청자를 입력해주세요.";
                }  else if(req_price === null || req_price === "") {
                    msg = "예상 가격을 입력해주세요.";
                } else if(req_reason === null || req_reason === "") {
                    msg = "요청 사유를 입력해주세요.";
                }
                MessageBox.error(msg);
                return false;
            },
            onCreate : async function(){
                // let temp = {
                //     request_product : this.byId("ReqGood").getValue(),
                //     request_quantity : parseInt(this.byId("ReqQty").getValue()),
                //     requestor : this.byId("Requester").getValue(),
                //     request_reason : this.byId("ReqReason").getValue(),
                //     request_number : this.byId("ReqNum").getValue(),
                //     request_state : 'B',
                //     request_date : this.byId("ReqDate").getValue(),
                //     request_estimated_price : parseInt(this.byId("ReqPrice").getValue()),
                // }
                // await $.ajax ({
                //     type : "POST",
                //     url : "/request/Request",
                //     contentType : "application/json;IEEE754Compatible=true",
                //     data:JSON.stringify(temp)
                // });

                // IEEE754Compatible : deciaml이나 int64의 경우 해당 내용을 작성하지 않으면 정밀도가 떨어짐
                // 그냥 기본값이라고 생각하고 작성하기
                let isError = this.onErrorMessageBoxPress();
                if(isError === false){
                    return;
                } else {
                    let temp = new JSONModel(this.temp).oData;
                    temp.request_product = this.byId("ReqGood").getValue();
                    temp.request_quantity = parseInt(this.byId("ReqQty").getValue());
                    temp.requestor = this.byId("Requestor").getValue();
                    temp.request_reason = this.byId("ReqReason").getValue();
                    temp.request_number = String(CreateNum);
                    temp.request_state = 'B';
                    temp.request_date = Today;
                    temp.request_estimated_price = parseInt(this.byId("ReqPrice").getValue());
                    await fetch("/request/Request", {
                        method : "POST",
                        body : JSON.stringify(temp),
                        headers : {
                            "Content-Type" : "application/json;IEEE754Compatible=true"
                        }
                    })
    
                }

                this.onReset();
                this.onBack();

            },

            //이전 페이지로 돌아가고 싶을 때 사용(정확히는 Request 페이지로 돌아가고 싶을 때 사용)
            onBack : function(){
                this.onReset();
                this.getOwnerComponent().getRouter().navTo("Request");
                //getOwnerComponent : manifest||Component에 있는 정보 불러올 때 사용하는 메소드
                //getRouter : Router의 정보를 가져오고자 할 때 사용하는 메소드
                //navTo : navigation To의 약자, routes의 name을 통해 이동
                //Request페이지로 이동
            },
            onReset : function(){
                this.byId("ReqGood").setValue("");
                this.byId("ReqQty").setValue("");
                this.byId("Requestor").setValue("");
                this.byId("ReqReason").setValue("");
                this.byId("ReqPrice").setValue("");

            }
        });
      }
    );
    