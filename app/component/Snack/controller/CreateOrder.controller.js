sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/ui/model/json/JSONModel", 
    "sap/m/MessageBox",
],
    
    function ( Controller, JSONModel, MessageBox) {
        "use strict";
        let Today, CreateNum;
        return Controller.extend("project5.controller.CreateOrder", {
            onInit: function () {
                const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateOrder");
                myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);

            },
            onMyRoutePatternMatched : function() {
    
                this.onReset();

                let now = new Date();
                Today = now.getFullYear() + "-" +(now.getMonth()+1).toString().padStart(2,'0')+"-"+now.getDate().toString().padStart(2, '0');

            },
            validateForVbox:function(sParam){
                var check=false;
                var item =this.byId(sParam).mAggregations.items;
                for(var i=0;i<item.length;i++){
                    // console.log(item[i].mAggregations);
                    var vboxitem = item[i].mAggregations.items;
                    for(var j=0;j<vboxitem.length;j++){
                        var element_type = vboxitem[j].getMetadata().getName().split('.')[2];
                        if (element_type == 'Input'|| element_type=='DatePicker'||element_type == 'ComboBox') {
                            vboxitem[j].setValueState("None");
                            vboxitem[j].setValueStateText(null);
                            if (vboxitem[j].mProperties.required == true) {
                                var element_value = vboxitem[j].mProperties.value;
                                if(element_value ==''||element_value==null||element_value==undefined){
                                    check=true;
                                    vboxitem[j].setValueState("Error");
                                    vboxitem[j].setValueStateText("필수 값을 입력해주세요.");
                                }
                            }
                        }
                        else if (element_type == 'Select') {
                            vboxitem[j].setValueState("None");
                            vboxitem[j].setValueStateText(null);
                            if (vboxitem[j].mProperties.required == true) {
                                var element_value = vboxitem[j].mProperties.selectedKey;
                                if(element_value ==''||element_value==null||element_value==undefined){
                                    check=true;
                                    vboxitem[j].setValueState("Error");
                                    vboxitem[j].setValueStateText("필수 값을 입력해주세요.");
                                }
                            }
                        }
                    }
                }
                return check;
            },
            validateForVboxClear:function(sParam){
                var item =this.byId(sParam).mAggregations.items;
                for(var i=0;i<item.length;i++){
                    // console.log(item[i].mAggregations);
                    var vboxitem = item[i].mAggregations.items;
                    for(var j=0;j<vboxitem.length;j++){
                        var element_type = vboxitem[j].getMetadata().getName().split('.')[2];
                        if (element_type == 'Input'|| element_type=='DatePicker'|| element_type == 'Select'||element_type == 'ComboBox') {
                            vboxitem[j].setValueState("None");
                            vboxitem[j].setValueStateText(null);
                        }
                    }
                }
            },
            onErrorMessageBoxPress: function () {
                let snackCategory = this.byId("snackCategory").getSelectedKey();
                let snackName = this.byId("snackName").getValue();
                let snackQuantity = this.byId("snackQuantity").getValue();
                let snackPrice = this.byId("snackPrice").getValue();
                let msg;
                if(snackCategory === null || snackCategory === "") {
                    msg = "간식 카테고리를 선택해주세요.";
                } else if(snackName === null || snackName === "") {
                    msg = "간식 이름을 입력해주세요.";
                } else if(snackQuantity === null || snackQuantity === "") {
                    msg = "간식 수량을 입력해주세요.";
                }  else if(snackPrice === null || snackPrice === "") {
                    msg = "간식 가격을 입력해주세요.";
                } else{
                    return;
                }
                MessageBox.error(msg);
                return false;
            },
            onCreate : async function(){
                var check = await this.validateForVbox("snackData");
                // let isError = this.onErrorMessageBoxPress();
                // if(isError === false){
                //     return;
                if(check===true){
                    return;
                } else {
                    let quant = parseInt(this.byId("snackQuantity").getValue());
                    let status = (quant >= 100) ? 'A' : (quant >= 30) ? 'B' : 'C';
                     
                    let temp = new JSONModel(this.temp).oData;
                    temp.snack_category = this.byId("snackCategory").getSelectedKey();
                    temp.snack_code = null;
                    temp.snack_name = this.byId("snackName").getValue();
                    temp.snack_stock = quant;
                    temp.snack_price = parseInt(this.byId("snackPrice").getValue());
                    temp.snack_status = status;
                    temp.snack_prefer = 0;
                    temp.snack_date = Today;

                    const snackName = await $.ajax({
                        type:"GET",
                        url: `/snack/Snack?$filter=snack_name eq '${temp.snack_name}'`
                    }); 
                    if(snackName.value.length > 0){
                        MessageBox.error("존재하는 간식 요청입니다."); return
                    }

                    const snackCategory = await $.ajax({
                        type:"GET",
                        url: "/snack/Snack?$filter=snack_category eq '" + temp.snack_category + "'&$orderby=snack_code desc&$top=1" 
                    }); 
                    let snackCategoryModel = new JSONModel(snackCategory.value);
                    this.getView().setModel(snackCategoryModel,"snackCategoryModel");
                    let oModel = this.getView().getModel("snackCategoryModel");
                    let oData = oModel.oData;

                    let sSnackCode = "";

                    console.log(oData);
                    let oSnackCode;
                    if(oData.length === 0){
                        sSnackCode = temp.snack_category + '-0001';
                        
                    } else {
                        oSnackCode = oData[0].snack_code;
                        let aSnackCode = oSnackCode.split('-');
                        console.log(aSnackCode);
                        let codeNum = parseInt(aSnackCode[1])+1;
                        codeNum = codeNum.toString().padStart(4, '0');
                        sSnackCode = `${aSnackCode[0]}-${codeNum}`;

                    }

                    temp.snack_code = sSnackCode; 

                    await fetch("/snack/Snack", {
                        method : "POST",
                        body : JSON.stringify(temp),
                        headers : {
                            "Content-Type" : "application/json;IEEE754Compatible=true"
                        }
                    })
    
                }

                this.onReset();
                this.toBack();

            },

            toBack : function(){
                this.onReset();
                this.validateForVboxClear("snackData");
                this.getOwnerComponent().getRouter().navTo("SnackList");
            },
            onReset : function(){
                this.byId("snackName").setValue("");
                this.byId("snackQuantity").setValue("");
                this.byId("snackPrice").setValue("");
                this.byId("snackCategory").setSelectedKey("");

            }
        });
      }
    );
    