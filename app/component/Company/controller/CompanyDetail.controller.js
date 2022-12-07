sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "../model/formatter"
], function(
	Controller, JSONModel, formatter
) {
	"use strict";
    var table, argument, param;

	return Controller.extend("project3.controller.CompanyDetail", {
        formatter : formatter,
        onInit : async function (){
            let editModel = new JSONModel({editable : false});
            this.getView().setModel(editModel, "editModel");
           
            this.getOwnerComponent().getRouter().getRoute("CompanyDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onMyRoutePatternMatched : async function(oEvent) {
            param = oEvent.getParameters();
            argument = oEvent.getParameter("arguments");
            let SelectedItem = oEvent.getParameter("arguments").num;
            table = oEvent.getParameter("arguments").table;
            let url = "/company/Company/" + SelectedItem;
            const Company = await $.ajax({
                type : "get",
                url : url
            })
            let CompanyModel = new JSONModel(Company);
            this.getView().setModel(CompanyModel, "CompanyModel");
  
        },
        toBack : function () {
            this.getView().getModel("editModel").setProperty("/editable", false);

            // window.history.go(-1);
            // console.log(table);
            // console.log(argument);
            // console.log(param);
            if(table==="grid"){
                this.getOwnerComponent().getRouter().navTo("GridCompany");
            } else if(table === "responsive"){
                this.getOwnerComponent().getRouter().navTo("ResponsiveCompany");

            }  
        },
        onEdit : function (){
            this.getView().getModel("editModel").setProperty("/editable", true);
            let oldcomname = this.byId("oldComName").getText();
            this.byId("ComName").setValue(oldcomname);

            let oldcomstatus = this.byId("oldComStatus").mProperties.state;
            if(oldcomstatus === "보류"){
                this.byId("ComStatus").setSelectedKey("hold");
            } else if(oldcomstatus === "주의"){
                this.byId("ComStatus").setSelectedKey("caution");
            } else if(oldcomstatus === "신용"){
                this.byId("ComStatus").setSelectedKey("trust");
            } else {
                this.byId("ComStatus").setSelectedKey("hold");
            }

            let oldcomperson = this.byId("oldComPerson").getText();
            this.byId("ComPerson").setValue(oldcomperson);

            let oldcontact = this.byId("oldComContact").getText();
            this.byId("ComContact").setValue(oldcontact);

            let oldcomaddress = this.byId("oldComAddress").getText();
            this.byId("ComAddress").setValue(oldcomaddress);
            
            let oldcomgood = this.byId("oldComGood").getText();
            this.byId("ComGood").setValue(oldcomgood);

        }, 
        onEditConfirm : async function() {
            let temp = new JSONModel().oData;
            temp.comname = this.byId("ComName").getValue();
            temp.comstate = this.byId("ComStatus").getSelectedKey();
            temp.comperson = this.byId("ComPerson").getValue();
            temp.comcontact = this.byId("ComContact").getValue();
            temp.comaddress = this.byId("ComAddress").getValue();
            temp.comgood = this.byId("ComGood").getValue();
            temp.comcode = this.byId("ComCode").getText();
            if(temp.comname === null || temp.comname === ""){
                temp.comname = this.byId("oldComName").getText();
            }
            if(temp.comstate === null || temp.comstate === ""){
                temp.comstate = "hold";
            }
            if(temp.comperson === null || temp.comperson === ""){
                temp.comperson = this.byId("oldComPerson").getText();
            }
            if(temp.comcontact === null || temp.comcontact === ""){
                temp.comname = this.byId("oldComContact").getText();
            }
            if(temp.comaddress === null || temp.comaddress === ""){
                temp.comaddress = this.byId("oldComAddress").getText();
            }
            if(temp.comgood === null || temp.comgood === ""){
                temp.comgood = this.byId("oldComGood").getText();
            }

            let url = "/company/Company/" + temp.comcode;
            await $.ajax ({
              type : "PATCH",
              url : url,
              contentType : "application/json;IEEE754Compatible=true",
              data : JSON.stringify(temp),
  
            });
            this.onEditReject();
            this.toBack();

        },
        onClearField : function(){
            this.byId("ComName").setValue("");
            this.byId("ComStatus").setSelectedKey("hold");
            this.byId("ComPerson").setValue("");
            this.byId("ComContact").setValue("");
            this.byId("ComAddress").setValue("");
            this.byId("ComGood").setValue("");

        },
        onEditReject : function(){
            this.onClearField();
            this.getView().getModel("editModel").setProperty("/editable", false);

        },
        

	});
});