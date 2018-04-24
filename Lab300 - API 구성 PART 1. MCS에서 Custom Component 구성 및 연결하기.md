Lab300 - PART 1. MCS에서 Custom Component 구성하기
=======

이 랩에서는 MCS를 이용해서 Custom Component를 수정하고 간편하게 deploy까지 해 볼 것입니다.
아래의 폴더가 labfiles 에 있는지 확인 해 주세요. 

-   mobile-API
-   omce-tools

**Step 1: 만들어져 있는 API TEST하기**
=======
### 1. 접속 
원하시는 봇에 접속해서 합니다. MasterBot_APIDeploy가 없을경우, MasterBot을 그대로 사용 하시거나, MasterBot을 아래처럼 clone하셔도 됩니다.

![Screen Shot 2018-04-24 at 1.46.55 P](media/15245452829241/Screen%20Shot%202018-04-24%20at%201.46.55%20PM.png)


### 2. TEST 
원하시는 봇에 접속해서 연결 되어있는 서비스 메세지를 확인해 봅니다. 버그를 확인했습니다.

![Screen Shot 2018-04-24 at 1.50.21 P](media/15245452829241/Screen%20Shot%202018-04-24%20at%201.50.21%20PM.png)


**Step 2: OMCe Tool을 이용해 Local의 변경사항 바로 deploy 및 Test 하기**
=======


### 1.  mobile-API/bankingcc 폴더로 이동해서 사용하실 MCS Backend와 configuration 정보가 모두 일치하는지 확인합니다. toolsConfig.js 파일과 사용하시려는 MCS MBE setting과 대조하시면 됩니다. 

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

### 2.  mobile-API/bankingcc 폴더에서 node_modules 폴더가 보이지 않는다면 이동해서, 아래 커맨드를 쳐주세요. 

		npm install 
	
### 3.  mobile-API/bankingcc에 필요한 package가 모두 설치 되었으므로, api implementation을 수정합니다. banking/balance_retrieval.js을 열어 아래처럼 수정 해 줍니다.

            if (accountType === 'credit card') {
                conversation.reply({ text: '신용카드의 한도 잔여액은 $' + String(account.remainingLimit()) + '입니다.'});
            }else{
              conversation.reply({ text:  accountType + '의 (' + account.id + ') 잔액은 $' + String(account.balance()) + '입니다' });
            }

 

### 4. omce-tools/omce-tools에서 아래의 커맨드로 수정사항을 deploy합니다. 

	node omce-deploy ../../mobile-API/oraclemobileapi/toolsConfig.json -u {mcs_user_name} -p {mcs_password}


아래와 같은 메세지가 나오면 성공적으로 deploy 한 것입니다. 

Warning: Configuration property "proxy" is undefined

To display help and examples associated with warnings, use the --verbose option
Requesting OAuth token...
Packaging implementation for BankingCC v1.0 from /Users/sunghyejeon/Documents/ChatBot_Handson/labfiles/mobile-API/bankingcc/
Deploying implementation to OMCe
Deployment completed successfully


### 5.  Test하기 

response가 바뀐 것을 확인 하실 수 있습니다.

![Screen Shot 2018-04-24 at 1.56.36 P](media/15245452829241/Screen%20Shot%202018-04-24%20at%201.56.36%20PM.png)


