import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();

  console.log('Seeding...');

  // 비밀번호 해시 생성
  const passwordHash = await hash('1234', 10); // 10은 saltRounds를 의미합니다.

  // 관리자 User 생성
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@runners.im',
      password: passwordHash, // 암호화된 비밀번호 사용
      role: Role.ADMIN,
    },
  });

  console.log('Admin User:', adminUser);

  // 기본 Service 생성
  const defaultService = await prisma.project.create({
    data: {
      name: 'Default Service',
    },
  });

  console.log('Default Service:', defaultService);

  // 서비스별로 테스트 유저들 생성
  const testUserEmails = [
    'test1@runners.im',
    'test2@runners.im',
    'test3@runners.im',
  ];
  const testUsers = await Promise.all(
    testUserEmails.map((email) =>
      prisma.user.create({
        data: {
          email,
          password: passwordHash, // 같은 암호화된 비밀번호 사용
          role: Role.USER,
          projectUsers: {
            create: [{ projectId: defaultService.id }],
          },
        },
      }),
    ),
  );

  console.log('Test Users:', testUsers);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
