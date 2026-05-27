import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { todoUseCaseProviders } from "./application/todo-use-case.providers";
import { TodosController } from "./presentation/todos.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [TodosController],
  providers: [...todoUseCaseProviders],
  exports: [...todoUseCaseProviders],
})
export class TodosModule {}
