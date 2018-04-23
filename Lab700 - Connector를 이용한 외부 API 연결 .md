Lab700 - Connector를 이용한 외부 API 연결 
=======


**Step 1. MCS에서 Connector 만들기**
=======
### 1. MCS 화면 > Connector로 접속해서 새로운 REST Connector를 만들어 주세요.

![Screen Shot 2018-04-24 at 1.55.17 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%201.55.17%20AM.png)
![Screen Shot 2018-04-24 at 1.55.31 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%201.55.31%20AM.png)

### 2. 원하시는 이름으로 커넥터를 만듭니다.
![Screen Shot 2018-04-24 at 1.57.27 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%201.57.27%20AM.png)


### 3. 외부 url을 설정해 줍니다.

![Screen Shot 2018-04-24 at 1.58.44 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%201.58.44%20AM.png)![Screen Shot 2018-04-24 at 1.58.24 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%201.58.24%20AM.png)

        https://chat-ibkbcloud.uscom-central-1.oraclecloud.com/
        
        
### 4. test로 확인합니다. 

![Screen Shot 2018-04-24 at 2.00.31 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%202.00.31%20AM.png)
![Screen Shot 2018-04-24 at 2.00.37 A](media/15245025401386/Screen%20Shot%202018-04-24%20at%202.00.37%20AM.png)

**Step 2. API에서 Connector 연결하기**

reservation/get_hotel_list.js 파일을 참고 해주세요.

                mobileSdk.connectors.get("hotelServiceConnector", "sample").then(
                    function(result){
                    
                    },function(error){
                    
                    }
                )
                    
    
**Step 3. Message Model 사용하기**

**Step 4. Bot에서 flow에서 API 불러주기**



