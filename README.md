# Instructions

Starter template for 😻 [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/).

> Checkout [NestJS Prisma Schematics](https://github.com/marcjulian/nestjs-prisma) to automatically add Prisma support
> to your Nest application.

## 특징

- GraphQL w/ [playground](https://github.com/prisma/graphql-playground)
- Code-First w/ [decorators](https://docs.nestjs.com/graphql/quick-start#code-first)
- [Prisma](https://www.prisma.io/) for database modelling, migration and type-safe access (Postgres, MySQL & MongoDB)
- 🔐 JWT authentication w/ [passport-jwt](https://github.com/mikenicholson/passport-jwt)
- REST API docs w/ [Swagger](https://swagger.io/)

## 개요

- [Instructions](#instructions)
    - [Features](#features)
    - [Overview](#overview)
    - [Prisma Setup](#prisma-setup)
        - [1. Install Dependencies](#1-install-dependencies)
        - [2. PostgreSQL with Docker](#2-PostgreSQL-with-docker)
        - [3. Prisma: Prisma Migrate](#3-prisma-prisma-migrate)
        - [4. Prisma: Prisma Client JS](#4-prisma-client-js)
        - [5. Seed the database data with this script](#5-seed-the-database-data-with-this-script)
        - [6. Start NestJS Server](#6-start-nestjs-server)
    - [GraphQL Playground](#graphql-playground)
    - [Rest Api](#rest-api)
    - [Docker](#docker)
    - [Schema Development](#schema-development)
    - [NestJS - Api Schema](#nestjs---api-schema)
        - [Resolver](#resolver)
    - [GraphQL Client](#graphql-client)
        - [Angular](#angular)
            - [Setup](#setup)
            - [Queries](#queries)
            - [Mutations](#mutations)
            - [Subscriptions](#subscriptions)
            - [Authentication](#authentication)

## 1. 의존성 설치

NestJS CLI를 설치하여 프로젝트를 시작하고 CRUD 리소스를 생성합니다.

```bash
# npm
npm i -g @nestjs/cli
# yarn
yarn add -g @nestjs/cli
```

Nest 애플리케이션에 필요한 의존성을 설치합니다.

```bash
# npm
npm install
# yarn
yarn install
```

## 2. Docker를 이용한 PostgreSQL 설정

Docker를 이용해 개발용 PostgreSQL 데이터베이스를 설정합니다. `.env.example` 파일을 복사하여 `.env`로 이름을 변경합니다(cp .env.example .env).

PostgreSQL 데이터베이스를 시작합니다.

```bash
docker-compose -f docker-compose.db.yml up -d
# or
npm run docker:db
```

## 3. Prisma 마이그레이션

Prisma 마이그레이션은 데이터베이스의 스키마와 마이그레이션을 관리하는 데 사용됩니다. Prisma 데이터 소스는 PostgreSQL 데이터베이스 연결을 위해 DATABASE_URL 환경 변수를 요구합니다.
Prisma는 루트 .env 파일에서 DATABASE_URL을 읽습니다.

개발 환경에서 Prisma 마이그레이션을 사용하여 다음을 수행합니다.

1. migration.sql 파일을 생성합니다.
2. 데이터베이스 스키마를 업데이트합니다.
3. Prisma 클라이언트를 생성합니다.

```bash
npx prisma migrate dev
```

If you like to customize your `migration.sql` file run the following command. After making your customizations
run `npx prisma migrate dev` to apply it.

```bash
npx prisma migrate dev --create-only
```

If you are happy with your database changes you want to deploy those changes to
your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments).
Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without
prompts.

```bash
npx prisma migrate deploy
```

Prisma 클라이언트 JS는 데이터 모델을 기반으로 자동 생성되는 타입-안전 데이터베이스 클라이언트입니다.

Prisma 클라이언트 JS를 생성하려면 다음 명령어를 실행합니다.

```bash
npx prisma generate
```

### 4. 데이터베이스 데이터 시드

다음 명령어로 스크립트를 실행하여 데이터베이스에 데이터를 시드합니다.

```bash
npm run seed
```

### 5. NestJS 서버 시작하기

개발 모드에서 Nest 서버를 실행합니다.

```bash
npm run start
```

프로덕션 모드에서 Nest 서버를 실행합니다.

```bash
npm run start:prod
```

## GraphQL Playground

NestJS 서버의 GraphQL Playground는 다음 주소에서 접근할 수 있습니다:

> http://localhost:3000/graphql

[example GraphQL queries](graphql/auth.graphql)를 열고 내용을 GraphQL Playground에 복사하세요. 일부 쿼리와 뮤테이션은 인증 가드에 의해 보호됩니다. 다음과 같이
accessToken을 HTTP HEADERS에 추가하고 여기에서 YOURTOKEN을 교체하세요:

```json
{
  "Authorization": "Bearer YOURTOKEN"
}
```

## Rest Api

[RESTful API](http://localhost:3000/api) 문서는 Swagger로 제공됩니다.

## Docker

Nest 서버는 Node.js 애플리케이션이며, 쉽게 [dockerized](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)할 수 있습니다.

Nest 서버의 Docker 이미지를 구축하는 방법은 [Dockerfile](./Dockerfile)을 참조하세요.

이제 자신의 Nest 서버의 Docker 이미지를 구축하려면 간단히 다음 명령어를 실행하세요:

```bash
# docker 이미지에 이름을 지정
docker build -t <your username>/nest-prisma-server .
# 예시
docker build -t nest-prisma-server .
```

Docker로 이미지를 구축한 후, docker 컨테이너를 시작하여 Nest 서버를 실행할 준비가 되었습니다:

```bash
docker run -d -t -p 3000:3000 --env-file .env nest-prisma-server
```

### Docker Compose

데이터베이스와 Nest 애플리케이션을 docker-compose로 설정할 수도 있습니다:

```bash
# building new NestJS docker image
docker-compose build
# or
npm run docker:build

# start docker-compose
docker-compose up -d
# or
npm run docker
```

## Schema 수정

Prisma 스키마 prisma/schema.prisma를 수정한 후, 다음 명령어를 실행하세요:

```bash
npx prisma generate --watch
```

## NestJS - Api Schema

[schema.graphql](./src/schema.graphql)은 모델, 리졸버, 입력
클래스로부터 [code first approach](https://docs.nestjs.com/graphql/quick-start#code-first) 방식을 사용하여 생성됩니다.

입력과 인자를 검증하기 위해 [class-validator](https://docs.nestjs.com/techniques/validation)를 사용할 수 있습니다.

### Resolver

새 쿼리를 구현하기 위해, users.resolver.ts에 새로운 리졸버 함수를 추가해야 합니다.

```ts
@Query(returns => User)
async
getUser(@Args()
args
):
Promise < User > {
  return await this.prisma.client.user(args);
}
```

NestJS 서버를 재시작하면 이번에는 user를 가져오는 쿼리가 작동해야 합니다.