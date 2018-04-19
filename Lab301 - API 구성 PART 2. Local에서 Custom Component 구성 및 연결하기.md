Lab300 - Custom Component 구현, 수정 및 연결
=======

이 랩에서 기존에 만들어둔 FirstBot에서 서비스를 연결 하고 수정하는 것을
배울 것입니다. 이 랩을 완성하기 위해서는 아래의 파일이 필요합니다.
labfiles\samples-service-balances에서 확인 해 주세요. 

-   samples-service-balances

**Step 1: Banking Bot에서 Get Balance 서비스 연결하기**
=======

### 1.  sample-service-balances의 디렉토리로 이동 해 주세요.
### 2.  npm install을 command 창에 쳐 주세요. node\_modules이라는 폴더가 생길 것 입니다.
### 3.  node index.js 로 index 파일을 실행 시켜 주세요. 아래와 같은 화면이 나오면 성공적으로 실행 시키신 것입니다.

        components.js create console logger
        shell.js create console logger
        Express server: component server created at context path=/components

### 4.  로컬에서 실행 중인 서비스를 Bot에서 연결 합니다. 
![Screen Shot 2018-01-09 at 11.59.42A](media/15154655408142/Screen%20Shot%202018-01-09%20at%2011.59.42%20AM.png)

        이 과정에서 ngrok을 통해 서버에 온라인으로 접근 가능하도록 합니다.
                ex) ngrok.exe 내에 창에 ngrok http 3000
                =>3000은 로컬 내에서 실행한 index.js의 포트여야 합니다.
        이때 url+ /components 를 Metadata URL에 넣습니다.

### 5.  서비스 등록 후에는 이렇게 나옵니다.
![Screen Shot 2018-01-09 at 1.38.40P](media/15154655408142/Screen%20Shot%202018-01-09%20at%201.38.40%20PM.png)

### 6.  Flow를 수정해서 연결 된 서비스를 부를수 있도록 합니다.

        # printBalance:
        #   component: "System.Output"
        #   properties:
        #     text: "${accountType.value}의 잔고는 $500 입니다."
        #   transitions:
        #     return: "printBalance"

        printBalance:
            component: "BalanceRetrieval"
            properties:
            accountType: "${accountType.value}"
            transitions:
            return: "printBalance" 

![Screen Shot 2018-01-09 at 2.15.15P](media/15154655408142/Screen%20Shot%202018-01-09%20at%202.15.15%20PM.png)

### 7.  서비스를 이용해서 대답하는 Bot을 테스트 해 보세요. 
![Screen Shot2018-01-09 at 2.16.02P](media/15154655408142/Screen%20Shot%202018-01-09%20at%202.16.02%20PM.png)


**Step 2: 연결한 Get Balance 서비스 수정하기**
=======

### 1.  가장 편한 Editor 에서 balance\_retrieval을 열어주세요.

![Screen Shot 2018-01-09 at 2.44.12P](media/15154655408142/Screen%20Shot%202018-01-09%20at%202.44.12%20PM.png)

### 2.  신용카드 선택시 대답 하는 말을 수정 해 보겠습니다.

        //날짜를 받아와 월급날까지를 계산     
        var today = new Date();
        var dd = today.getDate();
        var daysLeft = 25-dd;
        if (daysLeft < 0) daysLeft += 30;  

        //대답 하는 부분 수정
        conversation.reply({ text: '월급 날인 25일까지는 (' +  daysLeft + ")일 이 남았습니다. 힘내세요!"});

![Screen Shot 2018-01-09 at 2.46.52P](media/15154655408142/Screen%20Shot%202018-01-09%20at%202.46.52%20PM.png)

### 3.  다시 node index.js 로 구동 시켜 주세요.
### 4.  테스트를 해 주세요.

![Screen Shot 2018-01-09 at 2.48.51P](media/15154655408142/Screen%20Shot%202018-01-09%20at%202.48.51%20PM.png)

