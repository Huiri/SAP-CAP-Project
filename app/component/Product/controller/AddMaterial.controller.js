sap.ui.define([
    "sap/ui/core/mvc/Controller"
], // 사용할 모듈 선언
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    
    function ( Controller) {//불러온 모듈의 별칭 선언
        "use strict";

        return Controller.extend("project4.controller.AddMaterial", { // 소괄호 안의 경로 파일을 컨트롤러로 사용하겠다는 선언
            onInit: function () {
                
            },

            //이전 페이지로 돌아가고 싶을 때 사용(정확히는 Request 페이지로 돌아가고 싶을 때 사용)
            onBack : function(){
                this.getOwnerComponent().getRouter().navTo("GridMaterial");
                //getOwnerComponent : manifest||Component에 있는 정보 불러올 때 사용하는 메소드
                //getRouter : Router의 정보를 가져오고자 할 때 사용하는 메소드
                //navTo : navigation To의 약자, routes의 name을 통해 이동
                //Request페이지로 이동
            }
        });
      }
    );
    