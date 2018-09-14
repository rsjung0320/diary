# Mean Setting
1. nodejs 설치
2. npm install -g @angular/cli
3. git clone project
4. npm install

# Design
1. angular material은 grobal로 설치 하지 말고, 프로젝트 마다로 설치 할 것.
Angular 6부터는 npm install --save @angular/material 만 실행하면 된다.
2. npm install @angular/flex-layout --save


# @angular/flex-layout issue
1. ng update @angular/cli
2. ng update @angular/core
3. update @angular/flex-layout version to "^6.0.0-beta.18"
4. npm install
5. npm run build:ssr

#deploy
npm i -g firebase-tools
firebase login => 화면에서 로그인하기
firebase init
firebase deploy
