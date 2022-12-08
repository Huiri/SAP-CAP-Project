sap.ui.define([], function(){
    "use strict";
    return {
        creditStatus : function (sStatus){
            switch(sStatus){
                case "trust" :
                    return "신용";
                case "hold" :
                    return "보류";
                case "caution" :
                    return "주의";
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