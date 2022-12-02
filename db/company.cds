namespace Huiri_Head.company;

entity Company{
    key comcode             : String @title : '업체코드';  //@title : 컬럼의 용도를 작성해줌 / key는 중복 데이터 불가 
        comname             : String  @title : '업체명';
        comaddress          : String @title : '주소';
        comperson           : String  @title : '담당자';
        comcontact          : String  @title : '담당자연락처';
        comgood             : String  @title : '거래품목';
        comdate             : String  @title : '업체등록일';
        comstate            : String @title : '신용상태';

};


entity Company_State {
    key state_key           : String  @title : '신용상태 키워드';
        state_name          : String  @title : '신용상태 한국어';

};