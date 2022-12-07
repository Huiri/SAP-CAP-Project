sap.ui.define([], function(){
    "use strict";
    return {
        statusText : function(sStatus){
            switch(sStatus){
                case "A" :
                    return "승인";
                case "B" :
                    return "처리 대기";
                case "C" :
                    return "반려";
                default :
                    return sStatus;
            }
        },
        creditStatus : function (sStatus){
            switch(sStatus){
                case "trust" :
                    return "신뢰";
                case "hold" :
                    return "보류";
                case "caution" :
                    return "주의";
                default :
                    return sStatus;
            }
        },
        materialStatus : function (sStatus){
            switch(sStatus){
                case "A" :
                    return "생산";
                case "B" :
                    return "미 사용";
                case "C" :
                    return "단종 예정";
                case "D" :
                    return "단종";
                default :
                    return sStatus;
            }
        },
        numberWithCommas: function(x) {
            var regexp = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
            return String(x).replace(regexp, ",");
        }

    }
})