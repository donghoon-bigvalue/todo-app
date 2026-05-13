import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { TodosModule } from "./todos/todos.module";

@Module({
  imports: [TodosModule],
  controllers: [HealthController],
})
export class AppModule {}
