import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { authUseCaseProviders } from "./application/auth-use-case.providers";
import { AuthController } from "./presentation/auth.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [...authUseCaseProviders],
  exports: [...authUseCaseProviders],
})
export class AuthModule {}
