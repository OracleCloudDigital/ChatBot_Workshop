Lab500 - Instant App 기능을 이용한 확장
======

이번 섹션에서는 새로운 기능인 Instant Apps에 대해서 다뤄 볼 것입니다. 사용자로 부터 대화만으로는 받아오기 힘든 정보들을 미리 만들어져 있는 form 을 보내서 손쉽게 받아 올 수 있는 기능입니다.

이 랩을 시작하기전에 필요한 항목을 확인하세요

-   아래의 버튼이 있는 최신 Bot 버전 ![Screen Shot 2018-01-15 at 3.59.56
    P](media/15159994715260/Screen%20Shot%202018-01-15%20at%203.59.56%20PM.png)
    
- labfiles/instantApp/ 

완성시 아래와 같은 화면을 보실 수 있습니다. 

![Screen Shot 2018-04-24 at 1.42.22 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.42.22%20AM.png)![Screen Shot 2018-04-24 at 1.41.34 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.41.34%20AM.png)


**Step 1. 원하는 Instant Apps 만들기**
=======

### 1. 처음부터 새로 만들어도 되고, 만들어져 있는 템플릿을 사용하거나,만들어져 있는 앱을 복제해서 만들 수 있습니다.
![Screen Shot 2018-04-24 at 1.15.20 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.15.20%20AM.png)

### 2. 생성하고 난 후, 아래 처럼 새로 생성한 instant app 을 보실 수 있습니다. 왼편에는 새로운 label, button, screen등을 추가 할 수 있으며, 컴포넌트에 이벤트를 넣을 수 있습니다. 어떤 정보가 Bot flow에 다시 넘어갈지도 이곳에서 정의 합니다. 오른편에서는 만들어진 앱을 Test하고 각 스크린을 미리 볼 수 있습니다.


![Screen Shot 2018-04-24 at 1.22.17 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.22.17%20AM.png)


### 3. App Setting에서 ID를 줍니다. 여기서 부여된 ID는 Bot Flow에서 Instant App을 식별하는 id 입니다.

![Screen Shot 2018-04-24 at 1.22.17 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.22.17%20AM.png)

### 4. Layout 정하기
몇개의 page로 이뤄질지, 어떤 컴포넌트들로 구성할지 추가 할 수 있습니다. 오른쪽의 테스트 화면에서 확인 가능합니다.

![Screen Shot 2018-04-24 at 1.30.14 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.30.14%20AM.png)

### 5. 페이지 넘기기 설정하기 

![Screen Shot 2018-04-24 at 1.34.46 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.34.46%20AM.png)

![Screen Shot 2018-04-24 at 1.34.01 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.34.01%20AM.png)

tip : 
 원하는 Action을 추가 할 수 있습니다. Action은 앱이 보내질때, Bot으로 다시 돌아갈때 혹은 버튼들이 눌러질때 등 아래의 시점들에 action을 추가 할 수 있습니다.

-   Event를 발생 시킬 수 있는 시점

![Screen Shot 2018-01-15 at 9.18.24
P](media/15159994715260/Screen%20Shot%202018-01-15%20at%209.18.24%20PM.png)\
 ![Screen Shot 2018-01-15 at 9.18.33
P](media/15159994715260/Screen%20Shot%202018-01-15%20at%209.18.33%20PM.png)

-   발생 시킬 수 있는 (지원 가능한) 이벤트

![Screen Shot 2018-01-15 at 9.19.44
P](media/15159994715260/Screen%20Shot%202018-01-15%20at%209.19.44%20PM.png)\
 ![Screen Shot 2018-01-15 at 9.19.54
P](media/15159994715260/Screen%20Shot%202018-01-15%20at%209.19.54%20PM.png)

### 6.  Instant App에서 Bot Flow에 넘겨줄 정보 설정하기
![Screen Shot 2018-04-24 at 1.33.06 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.33.06%20AM.png)

![Screen Shot 2018-04-24 at 1.33.46 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.33.46%20AM.png)

### 7.  Bot Flow에서 Instant App에 넘겨줄 정보 설정하기

![Screen Shot 2018-04-24 at 1.36.52 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.36.52%20AM.png)

![Screen Shot 2018-04-24 at 1.37.19 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.37.19%20AM.png)


**Step 2. Bot에서 Instant App 부르기**
=======

### 1.  아래와 같이 Flow에서 Intent가 resolved 된후에 어떤 Instant App을 호출 하고 싶은지 설정해 주세요. Flow 안에서 variable을 설정한후, Instant App으로 넘길 수 있고, Instant App에서도 받아올 수 있습니다.

labfiles/instantApp.yaml 을 복사 붙여넣기 해주세요.
![Screen Shot 2018-04-24 at 1.39.53 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.39.53%20AM.png)


**Step 3. Test 하기**
=======

### 1.  Botui에서 테스트 할 수 있습니다.

![Screen Shot 2018-04-24 at 1.42.38 A](media/15245004378961/Screen%20Shot%202018-04-24%20at%201.42.38%20AM.png)

### 2.  Bot UI에서 테스트 한후, Kakaotalk 연결도 가능합니다.
https://www.dropbox.com/s/vgjkw25hs0gjkxd/financial_korea_chatbox.mp4?dl=0

