sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    'sap/ui/model/BindingMode',
    "sap/m/MessageBox",
], function(
	Controller, 
    JSONModel, 
    formatter,
    BindingMode,
    MessageBox
) {
	"use strict";
    var SelectedNum, Today;

	return Controller.extend("project5.controller.SnackDetail", {
        formatter: formatter,
        
        onInit : function() {
          let layoutModel = new JSONModel({layout : false});
          this.getView().setModel(layoutModel, "layoutModel");

          let editModel = new JSONModel({editable : false});
          this.getView().setModel(editModel, "editModel");

          this.getOwnerComponent().getRouter().getRoute("SnackDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
          this.getOwnerComponent().getRouter().getRoute("SnackDetailexpand").attachPatternMatched(this.onMyRoutePatternMatched2, this);
        },

        onMyRoutePatternMatched : async function (oEvent){
          SelectedNum = oEvent.getParameter("arguments").num;
          this.getView().getModel("layoutModel").setProperty("/layout", false);

          let url = "/snack/Snack/" + SelectedNum;
          const Snack =  await $.ajax({
            type : "get",
            url : url
          });
          let now = new Date();
          Today = now.getFullYear() + "-" +(now.getMonth()+1).toString().padStart(2,'0')+"-"+now.getDate().toString().padStart(2, '0');

          let SnackModel = new JSONModel(Snack);
          this.getView().setModel(SnackModel, "SnackModel");

          console.log(SnackModel);

          SnackModel.setDefaultBindingMode(BindingMode.OneWay);
        },
        onMyRoutePatternMatched2 : async function (oEvent){
          SelectedNum = oEvent.getParameter("arguments").num;
          this.getView().getModel("layoutModel").setProperty("/layout", true);

          let url = "/snack/Snack/" + SelectedNum;
          const Snack = await $.ajax({
            type:"get",
            url : url
          });
          let now = new Date();
          Today = now.getFullYear() + "-" +(now.getMonth()+1).toString().padStart(2,'0')+"-"+now.getDate().toString().padStart(2, '0');

          let SnackModel = new JSONModel(Snack);
          this.getView().setModel(SnackModel, "SnackModel");

          console.log(SnackModel);
          SnackModel.setDefaultBindingMode(BindingMode.OneWay);
          

        },
        onClearField : function(){
          this.byId("InputsnackName").setValue("");
          this.byId("InputsnackPrice").setValue("");
          this.byId("InputsnackQuant").setValue("");
          this.byId("InputsnackUpdateDate").setValue("");
          this.byId("InputsnackPrefer").setValue("");

      },
      onEditReject : function(){
          this.validateForVboxClear("snackData");

          this.onClearField();
          this.getView().getModel("editModel").setProperty("/editable", false);

      },

        toBack : function () {
          this.validateForVboxClear("snackData");
          this.getView().getModel("editModel").setProperty("/editable", false);
          this.getOwnerComponent().getRouter().navTo("SnackList");
        },
        onEdit : function (){
          this.getView().getModel("editModel").setProperty("/editable", true);

          let snackName = this.byId("snackName").getText();
          this.byId("InputsnackName").setValue(snackName);

          let snackPrice = this.byId("snackPrice").getText();
          this.byId("InputsnackPrice").setValue(snackPrice);

          let snackQuant = this.byId("snackQuant").getText();
          this.byId("InputsnackQuant").setValue(snackQuant);

          let snackUpdateDate = this.byId("snackUpdateDate").getText();
          this.byId("InputsnackUpdateDate").setValue(snackUpdateDate);
          
          let snackPrefer = this.byId("snackPrefer").getText();
          this.byId("InputsnackPrefer").setValue(snackPrefer);

      }, 
      onEditConfirm : async function() {
        var check = await this.validateForVbox("snackData");
        // let isError = this.onErrorMessageBoxPress();
        // if(isError === false){
        //     return;
        if(check===true){
          return
        }
          let temp = new JSONModel().oData;
          let prefer = parseInt(this.byId("InputsnackPrefer").getValue());
          temp.snack_name = this.byId("InputsnackName").getValue();
          temp.snack_price = parseInt(this.byId("InputsnackPrice").getValue());
          temp.snack_stock = parseInt(this.byId("InputsnackQuant").getValue());
          temp.snack_prefer =  prefer ? prefer : 0;
          let status = (temp.snack_stock >= 100) ? 'A' : (temp.snack_stock >= 30) ? 'B' : 'C';
          temp.snack_status = status;
          temp.snack_date = this.byId("InputsnackUpdateDate").getValue();

          const snackName = await $.ajax({
            type:"GET",
            url: `/snack/Snack?$filter=snack_name eq '${temp.snack_name}'`
          }); 
          if(snackName.value.length > 0){
              MessageBox.error("존재하는 간식 요청입니다."); return
          }

          let url = `/snack/Snack/${SelectedNum}`;
          let newSnack = await $.ajax ({
            type : "PATCH",
            url : url,
            contentType : "application/json;IEEE754Compatible=true",
            data : JSON.stringify(temp),

          });
        
          newSnack = new JSONModel(newSnack);
          this.getView().setModel(newSnack,"SnackModel");
          
          this.onEditReject();
          this.toBack();

      },
      onFull : function(){
          this.getOwnerComponent().getRouter().navTo("SnackDetailexpand", {num:SelectedNum});
        },
      onExitFull : function(){
        this.getOwnerComponent().getRouter().navTo("SnackDetail", {num:SelectedNum});
      },
        
      validateForVbox:function(sParam){
        var check=false;
        console.log(this.byId(sParam));

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
      });
    }
  );