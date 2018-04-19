Lab300 - PART 1. MCS에서 Custom Component 구성 및 연결하기
=======

이 랩에서는 MCS를 이용해서 Custom Component를 수정하고 간편하게 deploy까지 해 볼 것입니다.
아래의 폴더가 labfiles 에 있는지 확인 해 주세요. 

-   mobile-API
-   omce-tools

**Step 1: 만들어져 있는 API TEST하기**
=======
### 1. 접속
OMCe에 접속해, 원하시는 API로 접속한 후 상단의 TEST를 눌러 주세요. 

![Screen Shot 2018-04-19 at 1.48.31 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%201.48.31%20PM.png)

### 2. TEST
현재 어떤식으로 Response가 오는지 확인합니다. 

![Screen Shot 2018-04-19 at 1.50.24 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%201.50.24%20PM.png)
![Screen Shot 2018-04-19 at 1.50.33 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%201.50.33%20PM.png)


**Step 2: OMCe Tool을 이용해 Local의 변경사항 바로 deploy 및 Test 하기**
=======


### 1.  mobile-API/oraclemobileapi 폴더로 이동해서 사용하실 MCS Backend와 configuration 정보가 모두 일치하는지 확인합니다. toolsConfig.js 파일과 사용하시려는 MCS MBE setting과 대조하시면 됩니다. 

![Screen Shot 2018-04-19 at 12.46.23 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%2012.46.23%20PM.png)


    "apiName":"OracleMobileAPI",
    "apiVersion":"1.0",
    "apiId":"7a578d0f-1bec-4c27-8df7-c911839fe0a2",
    "baseUrl":"https://16549B19877743C598F5AB62809C7D72.uscom-central-1.oraclecloud.com:443",
    "tokenEndpoint":"https://idcs-f39015c6dacf4d658daeac06bb39e471.identity.oraclecloud.com/oauth2/v1/token",
    "backend":{
        "backendId":"5247baa8-e677-411a-8e45-b45e83303dfa",
        "backendName":"chatbot",
        "backendVersion":"1.0",
        "authorization":{
					"anonymousKey":"MTY1NDlCMTk4Nzc3NDNDNTk4RjVBQjYyODA5QzdENzJfTW9iaWxlQW5vbnltb3VzX0FQUElEOmUxMmUzNDVlLTJjMmUtNGI5Ni1hNzM2LThjODNkZjkxNGIxZA==",
            	"clientId":"6bb8a968f8154d929dcfacffdf378b6f",
            	"clientSecret":"b5e39ef7-d932-4c46-b568-0fc6c065450c"
        }
    }

### 2.  omce-tools/omce-tools 폴더로 이동해서, 아래 커맨드를 쳐주세요. 

		npm install 
	
### 3.  omce-tools/omce-tools 에 필요한 package가 모두 설치 되었으므로, api implementation을 수정합니다. 

mobile-API/oraclemobileapi/oraclemobileapi.js을 열어서 response를 수정해 줍니다.  

![Screen Shot 2018-04-19 at 1.37.17 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%201.37.17%20PM.png)

 

### 4. omce-tools/omce-tools에서 아래의 커맨드로 수정사항을 deploy합니다. 

	node omce-deploy ../../mobile-API/oraclemobileapi/toolsConfig.json -u {mcs_user_name} -p {mcs_password}


아래와 같은 메세지가 나오면 성공적으로 deploy 한 것입니다. 

Warning: Configuration property "proxy" is undefined

To display help and examples associated with warnings, use the --verbose option
Requesting OAuth token...
Packaging implementation for OracleMobileAPI v1.0 from /Users/sunghyejeon/Documents/ChatBot_Handson/labfiles/mobile-API/oraclemobileapi/
Deploying implementation to OMCe
Deployment completed successfully


### 5.  Test하기 

response가 바뀐 것을 확인 하니다.수 있습닏

![Screen Shot 2018-04-19 at 1.53.45 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%201.53.45%20PM.png)
![Screen Shot 2018-04-19 at 1.53.55 P](media/15159994715262/Screen%20Shot%202018-04-19%20at%201.53.55%20PM.png)



