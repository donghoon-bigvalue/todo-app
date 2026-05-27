import { Module } from "@nestjs/common";
import { authUseCaseProviders } from "./application/auth-use-case.providers";
import { authDatabaseProviders } from "./infrastructure/auth-database.providers";
import { AuthController } from "./presentation/auth.controller";

@Module({
  controllers: [AuthController],
  providers: [...authDatabaseProviders, ...authUseCaseProviders],
  exports: [...authUseCaseProviders],
})
export class AuthModule {}
