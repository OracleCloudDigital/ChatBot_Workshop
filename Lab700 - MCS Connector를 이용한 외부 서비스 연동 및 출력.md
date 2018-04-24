Lab700 - MCS Connector를 이용한 외부 서비스 연동 및 출력
======

이 랩에서는 MCS Connector를 이용해 외부 서비스와 쉽고 안전하게 연동하는 법을 배워보겠습니다. 

이 랩을 시작하기전에 필요한 항목을 확인하세요.
- mobile-API/bankingcc
 

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

### 1. registry에 새로운 서비스를 등록해 주세요.
![Screen Shot 2018-04-24 at 12.10.33 P](media/15245392094784/Screen%20Shot%202018-04-24%20at%2012.10.33%20PM.png)

 
### 2. reservation/get_hotel_list.js 파일을 참고 해주세요.


                mobileSdk.connectors.get("hotelServiceConnector", "sample").then(
                    function(result){
                    
                    },function(error){
                    
                    }
                )
                    
    
**Step 3. Message Model 사용하기**

MessagModel.js 라는 파일을 추가해서, 여러가지 메세지 포멧을 자유롭게 사용할 수 있는 sdk를 추가합니다. 
reservation/get_hotel_list.js 파일을 참고 해주세요.

**Step 4. Bot에서 flow에서 API 불러주기**

### 1. 해당 서비스를 부를 인텐트를 생성 해 줍니다.
![Screen Shot 2018-04-24 at 12.22.31 P](media/15245392094784/Screen%20Shot%202018-04-24%20at%2012.22.31%20PM.png)


### 2. Component 탭으로 들어가서 Reload를 눌러줌으로 새롭게 등록한 HotelList라는 서비스가 새로 생긴것을 확인합니다. 

![Screen Shot 2018-04-24 at 12.16.28 P](media/15245392094784/Screen%20Shot%202018-04-24%20at%2012.16.28%20PM.png)


### 3. Flow에서 불러줍니다.

![Screen Shot 2018-04-24 at 12.22.09 P](media/15245392094784/Screen%20Shot%202018-04-24%20at%2012.22.09%20PM.png)


### 4. Facebook에서도 확인가능 한 것을 보실 수 있습니다.

![Screen Shot 2018-04-24 at 12.26.49 P](media/15245392094784/Screen%20Shot%202018-04-24%20at%2012.26.49%20PM.png)

