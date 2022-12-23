sap.ui.define([
    'sap/ui/core/mvc/Controller', "sap/m/MessageToast",
    "../model/formatter", "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel", "sap/ui/export/Spreadsheet", "sap/ui/export/library"
],//사용할 모듈 선언
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	MessageToast,
	formatter,
	Filter,
	FilterOperator,
	Sorter,
	Fragment,
    JSONModel,
    Spreadsheet,
    exportLibrary) {//사용할 모듈의 별칭 선언(순서 맞춰 주어야 오류 발생 X)
        "use strict";
        let totalNumber, SelectedState;
        const EdmType = exportLibrary.EdmType;

        return Controller.extend("project5.controller.SnackList", { // 소괄호 안의 경로 파일을 컨트롤러로 사용하겠다는 선언
            formatter:formatter, //뷰에서 사용할 메소드 명 : 직접 만든 formatter 함수
            
            onInit: async function () {
                this.getOwnerComponent().getRouter().getRoute("SnackList").attachPatternMatched(this.onMyRoutePatternMatched, this);
                this.getOwnerComponent().getRouter().getRoute("SnackDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
            },
            onMyRoutePatternMatched :async function(oEvent){
                // SelectedState = oEvent.getParameter("arguments").status;
                // if(SelectedState=='%20'){
                //     SelectedState=''
                // }
                // await this.onDataView();
                // this.byId("ReqStatus").setSelectedKey(SelectedState);
                // this.onSearch();
                this.onDataView();
                this.onReset();
            },
            
            onDataView : async function(){
                this.getView().byId("snackTable").setBusy(true);
                const Snack =  await $.ajax({
                    type : "get",
                    url : "/snack/Snack"
                });
                this.getView().byId("snackTable").setBusy(false);

                let SnackModel = new JSONModel(Snack.value);
                this.getView().setModel(SnackModel, "SnackModel");

                totalNumber = this.getView().getModel("SnackModel").oData.length;

                let TableIndex = `간식 목록 (${totalNumber})`;
                this.getView().byId("TableName").setText(TableIndex); 

            },
            onDataExport: function () {
                let aCols, oRowBinding, oSettings, oSheet, oTable;
                oTable = this.byId('snackTable');
                oRowBinding = oTable.getBinding('rows');
                aCols = this.createColumnConfig();
    
                let oList =[];
                for(let j = 0; j < oRowBinding.oList.length; j++){
                    if(oRowBinding.aIndices.indexOf(j) > -1){
                        oList.push(oRowBinding.oList[j]);
                    }
                }
                for(let i = 0; i < oList.length; i++){
                    if(oList[i].snack_status === 'A'){
                        oList[i].snack_status2 = "많음";
                    }
                    if(oList[i].snack_status === 'B'){
                        oList[i].snack_status2 = "보통";
                    }
                    if(oList[i].snack_status === 'C'){
                        oList[i].snack_status2 = "적음";
                    }
                    if(oList[i].snack_category === 'B'){
                        oList[i].snack_category2 = "음료";
                    }
                    if(oList[i].snack_category === 'X'){
                        oList[i].snack_category2 = "기타";
                    }
                    if(oList[i].snack_category === 'S'){
                        oList[i].snack_category2 = "과자";
                    }
                }

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oList,
                    fileName: '간식 목록.xlsx',
                    worker: false
                };
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            createColumnConfig : function(){
                const aCols = [];
                aCols.push({
                    label : "간식 카테고리",
                    property : "snack_category2",
                    type : EdmType.String
                });
                aCols.push({
                    label : "간식 코드",
                    property : "snack_code",
                    type : EdmType.String
                });
                aCols.push({
                    label : "간식 이름",
                    property : "snack_name",
                    type : EdmType.Int32
                });
                aCols.push({
                    label : "간식 가격",
                    property : "snack_price",
                    type : EdmType.String
                });
                aCols.push({
                    label : "재고",
                    property : "snack_stock",
                    type : EdmType.String
                });
                aCols.push({
                    label : "재고 상태",
                    property : "snack_status2",
                    type : EdmType.String
                });
                aCols.push({
                    label : "재고 신청일",
                    property : "snack_date",
                    type : EdmType.String
                });
                aCols.push({
                    label : "선호도",
                    property : "snack_prefer",
                    type : EdmType.String
                });
                return aCols;
            },
            onCreateOrder : function(){
                let CreateOrder = this.getView().getModel("SnackModel").oData;
                let CreateOrderIndex = CreateOrder.length - 1;
                let CreateNum = CreateOrder[CreateOrderIndex].request_number + 1;
                this.getOwnerComponent().getRouter().navTo("CreateOrder", {num : CreateNum});
            },
            onNavToDetail : function(oEvent) {
                let SelectedNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
                console.log(SelectedNum);
                this.getOwnerComponent().getRouter().navTo("SnackDetail", {num : SelectedNum});
                //, {변수명 : manifest route에 작성한 변수명과 일치시켜야 함}

            },

            
            //검색을 위한 함수
            onSearch : function () {
                let snackTitle = this.byId("snackTitle").getValue(); 
                let snackCategory = this.byId("snackCategory").getSelectedKey(); 
                let snackStatus = this.byId("snackStatus").getSelectedKey();
                let snackReqDate = this.byId("snackReqDate").getValue();
                let snackPrefer = this.byId("snackPrefer").getValue();

                if(snackReqDate){
                    let ReqYear = ReqDate.split("- ")[0]; 
                    let ReqMonth = ReqDate.split("- ")[1].padStart(2,'0'); 
                    ReqDate = ReqYear + "-" + ReqMonth; 
                }

                var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

                if(snackTitle) {aFilter.push(new Filter("snack_name", FilterOperator.Contains, snackTitle))} 
                if(snackCategory) {aFilter.push(new Filter("snack_category", FilterOperator.Contains, snackCategory))}
                if(snackStatus) {aFilter.push(new Filter("snack_status", FilterOperator.Contains, snackStatus))} 
                if(snackReqDate) {aFilter.push(new Filter("snack_date", FilterOperator.Contains, snackReqDate))} 
                if(snackPrefer) {aFilter.push(new Filter("snack_prefer", FilterOperator.EQ, snackPrefer))}
                
                let oTable = this.byId("snackTable").getBinding("rows"); 
                oTable.filter(aFilter); 

            },

            onClearField : function (){
                this.byId("snackTitle").setValue(""); 
                this.byId("snackCategory").setSelectedKey(""); 
                this.byId("snackStatus").setSelectedKey(""); 
                this.byId("snackReqDate").setValue(""); 
                this.byId("snackPrefer").setValue(""); 
                 

            },
            onReset : function () {
                this.onClearField();
                this.onSearch(); 
            },

            onSort : function () {
                if(!this.byId("SortDialog")){
                    Fragment.load({
                        id: this.getView().getId(),
                        name : "project5.view.fragment.SortDialog",
                        controller : this
                    }).then(function(oDialog){
                        this.getView().addDependent(oDialog);
                        oDialog.open("filter");
                    }.bind(this));
                } else {
                    this.byId("SortDialog").open("filter");
                    
                }

            },

            onConfirmSortDialog : function(oEvent){ 
                let mParams = oEvent.getParameters(); 
                let sPath = mParams.sortItem.getKey(); 
                let bDescending = mParams.sortDescending; 

                let aSorters = [];

                aSorters.push(new Sorter(sPath, bDescending)); 

                let oBinding = this.byId("snackTable").getBinding("rows"); 
                oBinding.sort(aSorters); 
            },
            onCreateOrder :function (){
                // let SelectedIndex = this.getView().getModel("SnackModel").oData.length-1;
                // let SelectedNum = this.getView().getModel("SnackModel").oData[SelectedIndex].request_number;
                this.getOwnerComponent().getRouter().navTo("CreateOrder");

            },
            
            toSnackHome : function(){
                this.getOwnerComponent().getRouter().navTo("SnackHome")
            }
            	
    
        });
        
    });
 

