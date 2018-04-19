Lab401 - 카카오톡을 통해서 Chatbot 테스트하기
=======

이제까지 만들었던 Bot을 카카오 톡에 연결하는 랩입니다.

**Step 1. Bot에서 카카오톡 커넥터 등록하기**
=======

### 1.  connectors 탭으로 이동합니다.

![Screen Shot 2018-01-09 at 3.15.18P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.15.18%20PM.png)

### 2.  아래 처럼 원하시는 버튼을 넣고 세팅을 해 주세요.

![Screen Shot 2018-01-09 at 3.16.33P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.16.33%20PM.png)

### 3. 만들어진 Webhook URL을 복사 해 두세요. 
카카오톡에 연결 할 때 써야 합니다.
![Screen Shot 2018-01-09 at 3.16.46P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.16.46%20PM.png)

**Step 2: 카카오톡 플러스 친구 계정 만들기 및 연결 하기**
=======

### 1.  카카오톡에 연결 하기 위해서는 플러스 친구가 필요합니다.
[https://center-pf.kakao.com/](https://center-pf.kakao.com/) 로 들어가서 계정을 만들어 주세요.

![Screen Shot 2018-01-09 at 3.01.29P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.01.29%20PM.png)

### 2.  카카오톡이 없다면, 만들어 주시고 있다면 로그인 해주세요. 
필요한 가입 절차를 마쳐 주세요.

![Screen Shot 2018-01-09 at 3.01.39P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.01.39%20PM.png)

### 3.  새 플러스 친구를 만들어 주세요.

![Screen Shot 2018-01-09 at 3.01.57
P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.01.57%20PM.png)

![Screen Shot 2018-01-09 at 3.07.53
P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.07.53%20PM.png)

### 4.  만든 플러스 친구를 공개 해 주세요.

![Screen Shot 2018-01-09 at 3.10.38P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.10.38%20PM.png)

### 5.  만들어진 봇을 등록합니다.

![Screen Shot 2018-01-09 at 3.09.05P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.09.05%20PM.png)

### 6.  url을 알맞게 바꿔 주세요.
Step 1에서 복사 해 두었던 url에서 앞부분을 host의 8080 포트로 바꿔 주세요. 
http://bots-connectors:8000/connectors/v1/tenants/chatbot-tenant/listeners/kakaotalk/channels/E98FFE3E-9E16-4E9B-A147-1F5EA0C528C1

앱 url을 등록 한 후에, API 테스트 버튼을 눌러주세요. 호출하는데 잠시 시간이 걸릴 수도 있습니다. 앱 이름, 앱 설정, 그리고 알림 받을 전화번호 또한 채워주세요.

![Screen Shot 2018-01-09 at 3.26.16P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.26.16%20PM.png)

![Screen Shot 2018-01-09 at 3.27.24P](media/15154775261285/Screen%20Shot%202018-01-09%20at%203.27.24%20PM.png)

### 7.  카카오톡으로 연결 된 Bot을 테스트 해 보세요.

![KakaoTalk\_2018-01-09-15-46-53\_Photo\_24](media/15154775261285/KakaoTalk_2018-01-09-15-46-53_Photo_24.jpeg)

![KakaoTalk\_2018-01-09-15-44-57\_Photo\_96](media/15154775261285/KakaoTalk_2018-01-09-15-44-57_Photo_96.jpeg)

