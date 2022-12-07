sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"
], // 사용할 모듈 선언
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    
    function ( Controller, JSONModel, MessageBox) {//불러온 모듈의 별칭 선언
        "use strict";
        let Today, CreateNum;

        return Controller.extend("project3.controller.AddCompany", { // 소괄호 안의 경로 파일을 컨트롤러로 사용하겠다는 선언
            onInit: function () {
                const myRoute = this.getOwnerComponent().getRouter().getRoute("AddCompany");
                myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);

            },
            onMyRoutePatternMatched : function(oEvent) {
    
                this.onClearField();
                CreateNum = parseInt(oEvent.getParameter("arguments").num) + 1;

                let now = new Date();
                Today = now.getFullYear() + "-" +(now.getMonth()+1).toString().padStart(2,'0')+"-"+now.getDate().toString().padStart(2, '0');

                this.getView().byId("ComCode").setText(CreateNum);
                this.getView().byId("ComDate").setText(Today);
            },
            onErrorMessageBoxPress: function () {
                let comname = this.byId("ComName").getValue();
                let comperson = this.byId("ComPerson").getValue();
                let comcontact = this.byId("ComContact").getValue();
                let comgood = this.byId("ComGood").getValue();
                let comaddress = this.byId("ComAddress").getValue();
                let msg;
                if(comname === null || comname === "") {
                    msg = "업체명을 입력해주세요.";
                } else if(comperson === null || comperson === "") {
                    msg = "담당자를 입력해주세요.";
                } else if(comcontact === null || comcontact === "") {
                    msg = "담당자 연락처를 입력해주세요.";
                }  else if(comgood === null || comgood === "") {
                    msg = "거래 품목을 입력해주세요.";
                } else if(comaddress === null || comaddress === "") {
                    msg = "주소를 입력해주세요.";
                } else{
                    return;
                }
                MessageBox.error(msg);
                return false;
            },
            onCreate : async function(){

                // IEEE754Compatible : deciaml이나 int64의 경우 해당 내용을 작성하지 않으면 정밀도가 떨어짐
                // 그냥 기본값이라고 생각하고 작성하기
                let isError = this.onErrorMessageBoxPress();
                if(isError === false){
                    return;
                } else {
                    let temp = new JSONModel(this.temp).oData;

                    temp.comname = this.byId("ComName").getValue();
                    temp.comperson = this.byId("ComPerson").getValue();
                    temp.comcontact = this.byId("ComContact").getValue();
                    temp.comgood = this.byId("ComGood").getValue();
                    temp.comstate = this.byId("ComStatus").getSelectedKey();
                    if(temp.comstate === "" || temp.comstate === null) {
                        temp.comstate = "hold"
                    }
                    temp.comaddress = this.byId("ComAddress").getValue();
                    temp.comcode = String(CreateNum);
                    temp.comdate = Today;
                    await fetch("/company/Company", {
                        method : "POST",
                        body : JSON.stringify(temp),
                        headers : {
                            "Content-Type" : "application/json;IEEE754Compatible=true"
                        }
                    })
    
                }

                this.onClearField();
                this.onBack();

            },

            //이전 페이지로 돌아가고 싶을 때 사용(정확히는 Request 페이지로 돌아가고 싶을 때 사용)
            onBack : function(){
                this.getOwnerComponent().getRouter().navTo("GridCompany");
                //getOwnerComponent : manifest||Component에 있는 정보 불러올 때 사용하는 메소드
                //getRouter : Router의 정보를 가져오고자 할 때 사용하는 메소드
                //navTo : navigation To의 약자, routes의 name을 통해 이동
                //Request페이지로 이동
            },
            onClearField : function(){
                this.byId("ComName").setValue("");
                this.byId("ComPerson").setValue("");
                this.byId("ComContact").setValue("");
                this.byId("ComGood").setValue("");
                this.byId("ComStatus").setSelectedKey("hold");
                this.byId("ComAddress").setValue("");

            }

        });
      }
    );
    