sap.ui.define([
    'sap/ui/core/mvc/Controller', "sap/m/MessageToast",
    "../model/formatter", "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
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
    JSONModel) {//사용할 모듈의 별칭 선언(순서 맞춰 주어야 오류 발생 X)
        "use strict";
        let totalNumber;
        return Controller.extend("project2.controller.Request", { // 소괄호 안의 경로 파일을 컨트롤러로 사용하겠다는 선언
            formatter:formatter, //뷰에서 사용할 메소드 명 : 직접 만든 formatter 함수
            
            onInit: async function () {
                const myRoute = this.getOwnerComponent().getRouter().getRoute("Request");
                myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
            },
            onMyRoutePatternMatched :async function(){
                this.onDataView();
                // this.onReset();
            },
            onCheckExecute : function(){
                let ischecked = this.byId("checkAll").getSelected();
                if(ischecked === true) {
                    this.onCheckAll(true);
                } else {
                    this.onCheckAll(false);

                }
            },
            onCheckAll : function (ischecked){
                let model= this.getView().getModel("RequestModel");
                for(let i = 0; i < totalNumber; i++){
                    let request_state = `/${i}/request_state`;

                    if(model.getProperty(request_state) ==='B'){
                        let key =`/${i}/CHK`;
                        model.setProperty(key, ischecked);

                    }
                }
            
            },
            onDataView : async function(){
                this.getView().byId("ui_table").setBusy(true);
                const Request =  await $.ajax({
                    type : "get",
                    url : "/request/Request"
                });
                 this.getView().byId("ui_table").setBusy(false);

                let RequestModel = new JSONModel(Request.value);
                this.getView().setModel(RequestModel, "RequestModel");

                totalNumber = this.getView().getModel("RequestModel").oData.length;

                let TableIndex = "물품 요청 목록 (" + totalNumber +")";
                this.getView().byId("TableName").setText(TableIndex); 

            },
            onCreateOrder : function(){
                let CreateOrder = this.getView().getModel("RequestModel").oData;
                let CreateOrderIndex = CreateOrder.length - 1;
                let CreateNum = CreateOrder[CreateOrderIndex].request_number + 1;
                this.getOwnerComponent().getRouter().navTo("CreateOrder", {num : CreateNum});
            },
            onNavToDetail : function(oEvent) {
                let SelectedNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
                console.log(SelectedNum);
                this.getOwnerComponent().getRouter().navTo("RequestDetail", {num : SelectedNum,table:"grid"});
                //, {변수명 : manifest route에 작성한 변수명과 일치시켜야 함}

            },

            onDeleteOrd : async function(){

                let model= this.getView().getModel("RequestModel");
                for(let i = 0; i < totalNumber; i++){
                    let chk = `/${i}/CHK`;
                    if(model.getProperty(chk) === true){
                        let key =`/${i}/request_number`;
                        let request_number = model.getProperty(key);
                        await this.onDelete(request_number);
                    }
                }
                this.onDataView();
            },
            onDelete : async function(key) {
                let url = `/request/Request/${key}`;
                await fetch(url, {
                    method : "DELETE",
                    headers : {
                        "Content-Type" : "application/json;IEEE754Compatible=true"
                    }
                })
            },
            
            //검색을 위한 함수
            onSearch : function () {
                let ReqNum = this.byId("ReqNum").getValue(); 
                let ReqGood = this.byId("ReqGood").getValue(); 
                let ReqDate = this.byId("ReqDate").getValue();
                let Requester = this.byId("Requester").getValue();
                let ReqStatus = this.byId("ReqStatus").getSelectedKey();

                if(ReqDate){
                    let ReqYear = ReqDate.split(". ")[0]; //". " 기준으로 잘라서 앞의 연도 값을 변수에 저장
                    let ReqMonth = ReqDate.split(". ")[1].padStart(2,'0'); //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                    ReqDate = ReqYear + "-" + ReqMonth; //형식을 맞추어주기 위해서 연도-일자 형식으로 ReqDate 값에 저장
                }

                var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

                if(ReqNum) {aFilter.push(new Filter("request_number", FilterOperator.Contains, ReqNum))} //ReqNum값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
                if(ReqGood) {aFilter.push(new Filter("request_product", FilterOperator.Contains, ReqGood))} //ReqGood값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
                if(Requester) {aFilter.push(new Filter("requestor", FilterOperator.Contains, Requester))} //Requester값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
                if(ReqDate) {aFilter.push(new Filter("request_date", FilterOperator.Contains, ReqDate))} //ReqDate값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
                if(ReqStatus) {aFilter.push(new Filter("request_state", FilterOperator.Contains, ReqStatus))} //ReqStatus값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
                
                let oTable = this.byId("ui_table").getBinding("rows"); //ui_table이라는 id값을 가진 테이블에 존재하는 데이터를 oData에 할당
                oTable.filter(aFilter); // 테이블에 존재하는 데이터를 설정된 필터 조건으로 필터링

            },

            onClearField : function (){
                this.byId("ReqNum").setValue(""); 
                this.byId("ReqGood").setValue(""); 
                this.byId("Requester").setValue(""); 
                this.byId("ReqStatus").setSelectedKey(""); 
                this.byId("ReqDate").setValue(""); 
                //input 값 초기화
                 

            },
            //input 초기화 위한 함수
            onReset : function () {
                this.onClearField();
                this.onSearch(); // this가 onSearch를 가리키도록 함
            },

            //정렬을 위한 함수
            onSort : function () {
                // load가 되어있다면 load를 시켜주고 실행, 아니라면 그냥 open
                // 한번 실행 이후 fragment 호출 처리를 위한 조건문
                if(!this.byId("SortDialog")){
                    Fragment.load({
                        // 즉 프레그먼트 자체의 아이디가 아닌 현재 화면의 viewid를 받아서 뿌려주기 위함
                        id: this.getView().getId(), //어느 뷰에 fragment 띄울 것인지 결정
                        // (즉 현재 화면에 띄우기 위해 현재 페이지 view id 불러옴)
                        // id : application-project2-display-component---Request (npm으로 build 시)
                        // 특정값으로 지정하지 않을 시 계속 상속하기 때문에 id값을 지정해줌(즉 fragment를 가리킴)
                        name : "project2.view.fragment.SortDialog",
                        // 불러올 fragment가 존재하는 경로
                        controller : this
                        // this를 현재 함수가 아닌 전체 controller를 가리키게 함
                    }).then(function(oDialog){ // 동기처리(load가 완료된 후에 실행)
                        this.getView().addDependent(oDialog);
                        // fragment는 생명주기와 model 존재 X. 뷰가 destory 될 때 자동으로 destory됨
                        // 자식요소 즉 fragment를 부모 요소 즉 view의 생명주기 이벤트와 모델을 상속시킴
                        // 로드했던 상태를 갖고 있으려고 view에 상속시킴
                        oDialog.open("filter");
                        // filter 필요 X, 삭제해도 정상적으로 작동
                        // 프레그먼트 파일 화면에 띄우기
                    }.bind(this));//this가 함수 안의 this라 적용 X
                    //해결방안
                    //1) bind(this) : 컨트롤러를 가리키게 함
                    //2) 애초에 조건문 바깥에 this를 가리키는 변수 선언 -> 함수 안에서도 컨트롤러 전체를 의미하는 this로 사용
                } else {
                    this.byId("SortDialog").open("filter");//SortDialog라는 id값을 가진 화면에 띄우기(fragment dialog 띄우기)
                    
                }
                // this.onSearch();//화면에 보여주기 위함 -> 필요없다고 지우심

            },

            // 정렬 조건 선택 후 확인 버튼을 눌렀을 때 실행되는 함수
            onConfirmSortDialog : function(oEvent){ 
                let mParams = oEvent.getParameters(); //이벤트로 발생하는 파라미터, 즉 정렬 조건 받아 mParmas 변수에 저장
                let sPath = mParams.sortItem.getKey(); // 받은 파라미터의 키값 받기
                let bDescending = mParams.sortDescending; //오름차순, 내림차순 여부 설정을 받는 변수(true일 경우 내림차순 적용)

                let aSorters = []; // 정렬 조건들을 한번에 저장하기 위한 배열  선언(정렬 순서와 정렬 기준, 2개가 존재하기 때문)

                aSorters.push(new Sorter(sPath, bDescending)); // 배열에 정렬 조건(custom, 내림||오름차순)을 Sorter를 생성하여 push
                //bDescending 대신 true, false 직접 하드코딩해도 상관 X

                let oBinding = this.byId("ui_table").getBinding("rows"); //ui_table이라는 id값을 가진 테이블에 존재하는 데이터를 oBinding에 할당
                oBinding.sort(aSorters); // 테이블에 존재하는 데이터를 설정된 정렬 조건 적용
            },
            onCreateOrder :function (){
                let SelectedIndex = this.getView().getModel("RequestModel").oData.length-1;
                let SelectedNum = this.getView().getModel("RequestModel").oData[SelectedIndex].request_number;
                console.log(SelectedNum);
                this.getOwnerComponent().getRouter().navTo("CreateOrder", {num : SelectedNum});
                //getOwnerComponent : manifest||Component에 있는 정보 불러올 때 사용하는 메소드
                //getRouter : Router의 정보를 가져오고자 할 때 사용하는 메소드
                //navTo : navigation To의 약자, routes의 name을 통해 이동

                //주소줄에 입력해서 이동하고 싶을 시 #/CreateOrder -> # :해시 기반으로 타겟 찾아오기 때문

            },
            

            //선택한 ropw의 indices 값 불러오는 함수
            getSelectedIndices : function () {
                const rows = document.querySelector("button");
                var aIndices = this.byId("ui_table").getSelectedIndices();
                var sMsg;
                if (aIndices.length < 1) {
                    sMsg = "no item selected";
                } else {
                    sMsg = aIndices;
                }
                MessageToast.show(sMsg);
    
            },

            //선택한 ropw의 Context Index 값 불러오는 함수
            getContextByIndex: function() {
                var oTable = this.byId("ui_table");
                var iIndex = oTable.getSelectedIndex();
                var sMsg;
                if (iIndex < 0) {
                    sMsg = "no item selected";
                } else {
                    sMsg = oTable.getContextByIndex(iIndex);
                }
                MessageToast.show(sMsg);
            },

            //원하는 row값 출력
            getContext : function(){
                var oTable = this.byId("ui_table");
                var iIndex = oTable.getSelectedIndex();
                var sMsg, row_value;
                if (iIndex < 0) {
                    sMsg = "no item selected";
                } else {
                    sMsg = oTable.getContextByIndex(iIndex);
                    var row_value = sMsg.sPath;
                }
                MessageToast.show(this.getView().getModel("Request").getProperty(row_value));
                console.log(this.getView().getModel("Request").getProperty(row_value));
            },

            //table col 여러개 선택 가능
            updateMultipleSelection: function(oEvent) {
                var oMultiInput = oEvent.getSource(),
                    sTokensPath = oMultiInput.getBinding("tokens").getContext().getPath() + "/" + oMultiInput.getBindingPath("tokens"),
                    aRemovedTokensKeys = oEvent.getParameter("removedTokens").map(function(oToken) {
                        return oToken.getKey();
                    }),
                    aCurrentTokensData = oMultiInput.getTokens().map(function(oToken) {

                        return {"Key" : oToken.getKey(), "Name" : oToken.getText()};
                    });
    
                aCurrentTokensData = aCurrentTokensData.filter(function(oToken){
                    return aRemovedTokensKeys.indexOf(oToken.Key) === -1;
                });
                console.log(oMultiInput.getModel().setProperty(sTokensPath, aCurrentTokensData));

            },
            //선택 취소
            clearSelection: function(evt) {
                this.byId("ui_table").clearSelection();
            },
            onDeleteOrder : function(){
                
            },

		alert: function(oEvent) {
			
		},
            	
    
        });
        
    });
 

