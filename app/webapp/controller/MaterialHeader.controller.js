sap.ui.define(
    [
        "sap/ui/core/mvc/Controller", "../model/formatter",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "sap/ui/core/Fragment"
    ],
    function(Controller, formatter, Filter, FilterOperator, Sorter, Fragment) {
      "use strict";
  
      return Controller.extend("project1.controller.MaterialHeader", {
        formatter : formatter,

        onInit() {
        },
        //검색을 위한 함수
        onSearch : function () {
            // sap.ui.controller("project1.controller.")
            let category = this.byId("category").getValue(); 
            let code = this.byId("code").getValue(); 
            let name = this.byId("name").getValue();
            let date = this.byId("date").getValue();
            let produce = this.byId("produce").getSelectedKey();

            if(date){
                let MYear = date.split(".")[0]; //". " 기준으로 잘라서 앞의 연도 값을 변수에 저장
                let MMonth = date.split(".")[1]; //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                let MDay = date.split(".")[2]; //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                
                date = MYear + "-" + MMonth+"-" + MDay; //형식을 맞추어주기 위해서 연도-일자 형식으로 ReqDate 값에 저장
            }

            var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

            if(category) {aFilter.push(new Filter("category", FilterOperator.Contains, category))} //ReqNum값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(code) {aFilter.push(new Filter("code", FilterOperator.Contains, code))} //ReqGood값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(name) {aFilter.push(new Filter("name", FilterOperator.Contains, name))} //Requester값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(date) {aFilter.push(new Filter("date", FilterOperator.Contains, date))} //ReqDate값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(produce) {aFilter.push(new Filter("produce", FilterOperator.Contains, produce))} //ReqStatus값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            
            sap.ui.controller("project1.controller.ResponsiveMaterial").onSearch(aFilter);
            sap.ui.controller("project1.controller.GridMaterial").onSearch(aFilter);

        },
    

        //input 초기화 위한 함수
        onReset : function () {
            this.byId("category").setValue(""); 
            this.byId("code").setValue(""); 
            this.byId("name").setValue(""); 
            this.byId("produce").setSelectedKey(""); 
            this.byId("date").setValue(""); 
            //input 값 초기화
            this.onSearch(); // this가 onSearch를 가리키도록 함
        },
        
        onValueHelpRequest : function(){
            if(!this.byId("compop")){
                Fragment.load({
                    id: this.getView().getId(), 
                    name : "project1.view.fragment.MaterialSearch",
                    controller : this
                }).then(function(oDialog){ 
                    this.getView().addDependent(oDialog);
                    oDialog.open("filter");
                }.bind(this));
            } else {
                this.byId("compop").open("filter");
            }       
        },
        onCloseDialog : function() { // Busy Dialog
            this.byId("compop").destroy();
            //close일 경우 일회용
            //destroy로 변경 시 다회 사용 가능
            this.pDialog = null;
        },
        onSearchOpt : function() {
            let pop_mcode = this.byId("pop_mcode").getValue(); 
            let pop_mname = this.byId("pop_mname").getValue();

        
            var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

            if(pop_mcode) {aFilter.push(new Filter("code", FilterOperator.Contains, pop_mcode))} //ReqGood값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(pop_mname) {aFilter.push(new Filter("name", FilterOperator.Contains, pop_mname))} //Requester값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환

            let oTable = this.byId("selection_table").getBinding("rows");
            oTable.filter(aFilter); 


        },
        onSearchOptReset : function(){
            this.byId("pop_mcode").setValue(""); 
            this.byId("pop_mname").setValue(""); 
            //input 값 초기화
            this.onSearchOpt(); // this가 onSearch를 가리키도록 함

        },
        //원하는 row값 출력
        getContext : function(){
            var oTable = this.byId("selection_table");
            var iIndex = oTable.getSelectedIndex();
            var sMsg, row_value;
            if (iIndex < 0) {
                sMsg = null;
            } else {
                sMsg = oTable.getContextByIndex(iIndex);
                var row_value = sMsg.sPath;
                this.byId("pop_mcode").setValue(this.getView().getModel("Material").getProperty(row_value)["code"]); 
                this.byId("pop_mname").setValue(this.getView().getModel("Material").getProperty(row_value)["name"]); 
                this.byId("code").setValue(this.getView().getModel("Material").getProperty(row_value)["code"]); 
                this.byId("name").setValue(this.getView().getModel("Material").getProperty(row_value)["name"]); 
    
            }
        

            this.onSearchOptReset();
            this.onCloseDialog();
        },
    
      });
    }
  );