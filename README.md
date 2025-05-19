[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 체크리스트

- 프로덕션에서 사용할 수 있는가?

## 시나리오

- 현실 : 유저 대상 이벤트 시행 시 조건 확인, 조건 달성 여부, 보상 지급 등을 수작업으로 진행하고 있는 상황
- 이상 : 운영자는 이벤트 생성, 보상 등 관리에 집중하고, 보상은 유저가 직접 요청하도록 하여 자동화할 것

## 1. 요구사항

Gateway Server

- 요청의 진입점
- 라우팅
- JWT 토큰 검증 및 역할 검사
- Nest.js `@nestjs/passport`, `AuthGuard`, `RoleGuard` 사용 할 것

Auth Service

- 유저 등록
- 유저 로그인
- 유저 역할 관리
- JWT 관리

역할 유형

- USER : 보상 요청
- OPERATOR : 이벤트 등록 + 보상 등록
- AUDITOR : 보상 이력 조회
- ADMIN : 모든 기능

User Service

1. 이벤트 등록 / 조회

- 이벤트 생성 가능. 운영자 또는 관리자
- 이벤트는 조건(로그인 3일, 친구 초대), 기간, 상태(활성/비활성) 정보를 가진다.
- 등록 이벤트는 목록 또는 상세 조회 가능

기술 스택

- Node.js : 18
- Nest.js : 최신
- DB : MongoDB
- 인증 : JWT
- 배포/실행 : Docker + Docker Compose
- 언어 : TypeScript

## 2. 시스템 설계

```
[Client]
  ↓
[Gateway Server] (게이트웨이, JWT 검증, 라우팅)
  ├─> [Auth Server] (회원가입, 로그인, JWT 발급, 역할관리)
  └─> [Event Server] (이벤트 등록, 보상 등록, 요청 처리)
```

ERD

## Project setup

## Thought

dto validation은 어디서 해야하나

- dto validation 파이프를 gateway에 둬야하나 아니면 Auth에 둬야하나? gateway 두면 검증된 데이터만 네트워크 전송을 쓰기 때문에 트래픽 부담이 줄지만, 그렇게되면 auth의 dto가 gateway에 존재함에 따라 관심사 분리 원칙에 위배된다.
  하지만 gateway은 라우팅도 하지만 불필요한 요청을 방지하는 관문 역할 한다는 점에서 validation하는 것이 적절하다.

passport

- Strategy에서 validate의 반환값은 객체인데, 이는 req.user의 값에 할당된다. 왜 하필 req.user인 이유는 Authentication 성공 시 req.user에 사용자 정보를 넣으라는Passport.js의 표준이며 내부 규약이다.

```typescript
// apps/gateway/src/common/strategies/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    return {
      userId: payload.sub,
      email: payload.email,
      loginType: payload.loginType,
    };
  }
}
```

역할 제어가 중요한 시스템이기 때문에 역할 제어를 분산시키지 않고 한 곳에 두어 검증 비용을 줄일 수 있다

## Event

이벤트 7일 연속 로그인

조건은 보상 조건 뿐만 아니라 생성 조건도 필요하다. 생성 조건의 경우, 만약 7일 연속 로그인 이벤트라면 이벤트 기간이 최소 7일 이상이어야 한다.

연속 로그인 이벤트를 기록하기 위해선 login_history를 생성해야 한다.

login_history DB는 auth 데이터이고, event는 event 데이터다. 두 유형의 데이터를 같은 DB의 다른 테이블로 구성할 것인지, 아니면 애초에 다른 DB로 구성할 것인가?

같은 DB를 쓴다면, 같은 DB 인스턴스를 사용하면 된다. 그러니 다른 DB를 사용할 경우, 해당 데이터를 얻기 위해 다른 서버에 요청을 하는 방식으로 처리해야 한다.

MSA는 다른 서비스들 간 데이터를 하나의 DB에서 공유하는 직접 DB 접근 방식 보다는 이벤트 기반 통신으로 데이터를 요청해서 처리하는 것이 서비스 결합도를 낮추는데 도움이 될 것이다. 물론, 따로 DB를 두면 성능이 상대적으로 느리거나, 데이터 동기화의 필요성 등 단점도 있다.
API 방식이 업계 표준.

Auth 서버에서는
로그인을 할 경우, 해당 로직을 수행하되 병렬적으로 로그인 이벤트를 발생(emit)시켜 해당 이벤트를 적재하는 방식을 취한다. 그리고 해당 이벤트를 받은 이벤트 리스너는 로그인 히스토리에 이벤트를 적재한다.

로그인과 로그인 정보 저장은 별도의 이벤트다. 따라서 signin api에서는 로그인 정보 저장 로직을 디커플링 시켜야 하며 이를 위해 event emitter를 사용할 것이다.

이벤트 유형
다양한 유형의 이벤트를 여러개 등록하고 싶은데 표준화를 어떻게 해야하지?

## test

테스트 방법

```
# Swagger api
http://localhost:3000/api
```

```
# MongoDB
localhost:27017
```


