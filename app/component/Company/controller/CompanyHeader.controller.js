sap.ui.define(
    [
        "sap/ui/core/mvc/Controller", "../model/formatter",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "sap/ui/core/Fragment"
    ],
    function(Controller, formatter, Filter, FilterOperator, Sorter, Fragment) {
      "use strict";
  
      return Controller.extend("project3.controller.CompanyHeader", {
        formatter : formatter,

        onInit() {
        },
        //검색을 위한 함수
        onSearch : function () {
            let ComNum = this.byId("ComNum").getValue(); 
            let ComName = this.byId("ComName").getValue(); 
            let ComDate = this.byId("ComDate").getValue();
            let ComPerson = this.byId("ComPerson").getValue();
            let Status = this.byId("Status").getSelectedKey();

            if(ComDate){
                let ComYear = ComDate.split(".")[0]; //". " 기준으로 잘라서 앞의 연도 값을 변수에 저장
                let ComMonth = ComDate.split(".")[1]; //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                let ComDay = ComDate.split(".")[2]; //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                
                ComDate = ComYear + "-" + ComMonth+"-" + ComDay; //형식을 맞추어주기 위해서 연도-일자 형식으로 ReqDate 값에 저장

            }

            var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

            if(ComNum) {aFilter.push(new Filter("comcode", FilterOperator.Contains, ComNum))} 
            if(ComName) {aFilter.push(new Filter("comname", FilterOperator.Contains, ComName))} 
            if(ComDate) {aFilter.push(new Filter("comdate", FilterOperator.Contains, ComDate))}
            if(ComPerson) {aFilter.push(new Filter("comperson", FilterOperator.Contains, ComPerson))} 
            if(Status) {aFilter.push(new Filter("comstate", FilterOperator.Contains, Status))} 

            sap.ui.controller("project3.controller.ResponsiveCompany").onSearch(aFilter);
            sap.ui.controller("project3.controller.GridCompany").onSearch(aFilter);

        },
    

        //input 초기화 위한 함수
        onReset : function () {

            this.byId("ComNum").setValue(""); 
            this.byId("ComName").setValue(""); 
            this.byId("ComDate").setValue(""); 
            this.byId("Status").setSelectedKey(""); 
            this.byId("ComPerson").setValue(""); 
            //input 값 초기화
            this.onSearch(); // this가 onSearch를 가리키도록 함
        },
        

      });
    }
  );