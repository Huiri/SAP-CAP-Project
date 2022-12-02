sap.ui.define([
    'sap/m/MessageToast','sap/ui/core/mvc/Controller', "sap/ui/model/json/JSONModel",
    "sap/m/Dialog", "sap/m/Button", "sap/ui/core/Fragment", "sap/ui/core/syncStyleClass",
], // 사용할 모듈 선언
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    
    function (MessageToast, Controller, JSONModel, Dialog, Button, Fragment, syncStyleClass) {//파라미터는 별칭 선언
        "use strict";

        return Controller.extend("project1.controller.HelloPanel", { // 소괄호 안의 경로 파일을 컨트롤러로 사용하겠다는 선언
            onInit: function () {
                var oData = {
                    recipient : {
                        name:"World",
                    }
                };
                var oData2 = {
                    recipient : {
                        name2 : "World2"
                    }
                };
                var oData3 = {
                    oDatadata : 
                        {
                            name : "22.11.24",
                            value : 
                            [
                                { 
                                    sub : `[MVC 패턴]`,
                                    txt : `- Model : 데이터 및 데이터 동작 지정
                                        - View : 화면
                                        - Controller : 화면 제어 동작 스크립트 지정`
                                    },
                                {
                                sub : `[Nested View]`,
                                txt : `- View 파일에 새로운 View 참조하여 동작`
                                    }
                                ]
                        }
                    
                };
                var oData4 = {
                    student : [
                        {
                            name : "moon"
                        }
                    ]
                    
                };
                var oModel = new JSONModel(oData);
                var oModel2 = new JSONModel(oData2);
                var oModel3 = new JSONModel(oData3);
                var oModel4 = new JSONModel(oData4);

                this.getView().setModel(oModel, "test");
                this.getView().setModel(oModel2, "test2");
                this.getView().setModel(oModel3, "test3");
                this.getView().setModel(oModel4, "test4");
                //값이 각각 변경됨
                // console.log(this.getView().getModel("test").getProperty("/recipient/name"));
                // console.log(this.getView().getModel("test3").recipient.name); //undefined
                console.log(this.getView().getModel("test3").getProperty("/oDatadata/value")[0]["txt"]); //0번째 값의 txt
                console.log(this.getView().getModel("test4").getProperty("/student")[0]["name"]); //moon


            },

            
            onPress : function ( ){
                alert("안녕하세요.");
            },
            
            // Toast 메세지 출력
            handleMessageToastPress: function() {
                var msg = this.getView().getModel("test").getProperty("/recipient/name");
                MessageToast.show(msg);
            },
            test:function(){
                console.log(this.getView().getModel("test").getProperty("/recipient/name"))
            },
            test2:function(){
                console.log(this);
            },
            
            //Dialog Open 
            onOpenDialog : function (){ // Standard Dialog
                if(!this.pDialog){
                    this.pDialog = this.loadFragment({
                        name:"project1.view.fragment.HelloDialog"
                    });
                }
                this.pDialog.then(function(oDialog){
                    oDialog.open();
                });
            },
            onOpenBusyDialog: function () { // Busy Dialog
                if (!this._pBusyDialog) {
                    this._pBusyDialog = Fragment.load({
                        name: "project1.view.fragment.HelloBusyDialog",
                        controller: this
                    }).then(function (oBusyDialog) {
                        this.getView().addDependent(oBusyDialog);
                        syncStyleClass("sapUiSizeCompact", this.getView(), oBusyDialog);
                        return oBusyDialog;
                    }.bind(this));
                }
    
                this._pBusyDialog.then(function(oBusyDialog) {
                    oBusyDialog.open();
                    this.simulateServerRequest();
                }.bind(this));
            },

            //Dialog Close 
            onDialogClosed: function (oEvent) { // Standard Dialog
                clearTimeout(iTimeoutId);
    
                if (oEvent.getParameter("cancelPressed")) {
                    MessageToast.show("The operation has been cancelled");
                } else {
                    MessageToast.show("The operation has been completed");
                }
            },
            onCloseDialog : function() { // Busy Dialog
                this.byId("helloDialog").destroy();
                //close일 경우 일회용
                //destroy로 변경 시 다회 사용 가능
                this.pDialog = null;
            }
            
        });
        
    });
 

