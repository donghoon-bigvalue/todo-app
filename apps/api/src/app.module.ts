import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health.controller";
import { TodosModule } from "./todos/todos.module";

@Module({
  imports: [AuthModule, TodosModule],
  controllers: [HealthController],
})
export class AppModule {}
