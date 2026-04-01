generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Profiles {
  id        Int      @id @default(autoincrement())
  name      String
  title     String
  email     String   @unique
  bio       String
  image_url String
  createAt  DateTime @default(now())
  updateAt  DateTime @updatedAt
}