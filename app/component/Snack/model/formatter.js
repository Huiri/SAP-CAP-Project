sap.ui.define([], function(){
    "use strict";
    return {
        quantStatus : function (sStatus){
            switch(sStatus){
                case "A" :
                    return "많음";
                case "B" :
                    return "보통";
                case "C" :
                    return "적음";
                default :
                    return sStatus;
            }
        },
        categoryFormat : function (sStatus){
            switch(sStatus){
                case "B" :
                    return "음료";
                case "S" :
                    return "과자";
                case "X" :
                    return "기타";
                default :
                    return sStatus;
            }
        },
    

    }
})