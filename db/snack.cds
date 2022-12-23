namespace Huiri_Head.snack;
using{
    cuid,
    managed,
    Currency,
    Country
} from '@sap/cds/common';
entity Snack {
    key snack_code : String @title : '간식코드';
        snack_category : String @title : '간식카테고리';
        snack_name : String @title : '간식이름';
        snack_price : Integer @title : '간식가격';
        snack_stock : Integer @title : '재고';
        snack_status : String @title : '재고상태';
        snack_date : String @title : '재고신청일';
        snack_prefer : Integer @title : '선호점수';
};