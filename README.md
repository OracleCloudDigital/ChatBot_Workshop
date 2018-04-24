# ChatBot_Handson

이 실습에서는 금융 뱅킹 봇을 개발 해 보고, 테스트 할 것입니다. 만드실 이 챗봇은 대화를 통해서 은행 계좌에서 잔액을 찾고, 은행 계좌간에 돈을 송금하고, 다른 사람과 계좌로 송금 할 수 있는 봇입니다. 

# Prerequisite 

이 핸즈온을 완료하려면 Oracle Mobile Cloud, Enterprise (OMCe)에 액세스해야합니다. 챗봇을 만드는 것을 수월하게 해줄 코드가 포함되어이 있는 zip파일을 instructor를 통해 받으세요. labfiles.zip라는 이름으로 되어 있습니다. 이 코스 전반에 걸쳐 언급 될것이므로 편리한 장소에 저장하십시오.

# Chatbot-Workshop Lab 자료

* Lab 100 : [Chatbot Overview](Lab100%20-%20Chatbot%20Overview.md)
* Lab 200 : [Training Data를 사용해 Chatbot을 Train](Lab200%20-%20Training%20Data를%20사용해%20Chatbot을%20Train.md)
* Lab 300 : [API 구성 PART 1. MCS에서 Custom Component 구성 및 연결하기](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab300%20-%20API%20%EA%B5%AC%EC%84%B1%20PART%201.%20MCS%EC%97%90%EC%84%9C%20Custom%20Component%20%EA%B5%AC%EC%84%B1%20%EB%B0%8F%20%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0.md)
* Lab 301 : [API 구성 PART 2. Local에서 Custom Component 구성 및 연결하기](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab301%20-%20API%20%EA%B5%AC%EC%84%B1%20PART%202.%20Local%EC%97%90%EC%84%9C%20Custom%20Component%20%EA%B5%AC%EC%84%B1%20%EB%B0%8F%20%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0.md)
* Lab 400 : [채널 연결 PART 1. Facebook 연결 및 메세지 포멧 활용하기](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab400%20-%20%EC%B1%84%EB%84%90%20%EC%97%B0%EA%B2%B0%20PART%201.%20Facebook%20%EC%97%B0%EA%B2%B0%20%EB%B0%8F%20%EB%A9%94%EC%84%B8%EC%A7%80%20%ED%8F%AC%EB%A9%A7%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0.md)
* Lab 401 : [채널 연결 PART 2. 카카오톡을 통해서 Chatbot 테스트하기](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab401%20-%20%EC%B1%84%EB%84%90%20%EC%97%B0%EA%B2%B0%20PART%202.%20%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1%EC%9D%84%20%ED%86%B5%ED%95%B4%EC%84%9C%20Chatbot%20%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0.md)
* Lab 402 : [채널 연결 PART 3. 카카오톡의 다양한 Response 타입 사용하기](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab402%20-%20%EC%B1%84%EB%84%90%20%EC%97%B0%EA%B2%B0%20PART%203.%20%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1%EC%9D%98%20%EB%8B%A4%EC%96%91%ED%95%9C%20Response%20%ED%83%80%EC%9E%85%20%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0.md)
* Lab 500 : [Instant App 기능을 이용한 확장](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab500%20-%20Instant%20App%20%EA%B8%B0%EB%8A%A5%EC%9D%84%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20%ED%99%95%EC%9E%A5.md)
* Lab 600 : [Sample Web Client 실행하기](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab600%20-%20Sample%20Web%20Client%20%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0.md)
* Lab 700 : [MCS Connector를 이용한 외부 서비스 연동 및 출력](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab700%20-%20MCS%20Connector%EB%A5%BC%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20%EC%99%B8%EB%B6%80%20%EC%84%9C%EB%B9%84%EC%8A%A4%20%EC%97%B0%EB%8F%99%20%EB%B0%8F%20%EC%B6%9C%EB%A0%A5.md)
* Lab 800 : [Custom Component를 사용한 다수 입력 처리](https://github.com/OracleCloudKr/ChatBot_Workshop/blob/master/Lab800%20-%20Custom%20Component%20%ED%99%9C%EC%9A%A9%20-%20%EB%8B%A4%EC%88%98%EC%9D%98%20Input%20%EC%B2%98%EB%A6%AC.md)
