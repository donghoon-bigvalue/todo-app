import { Module } from "@nestjs/common";
import { todoUseCaseProviders } from "./application/todo-use-case.providers";
import { todoDatabaseProviders } from "./infrastructure/todo-database.providers";
import { TodosController } from "./presentation/todos.controller";

@Module({
  controllers: [TodosController],
  providers: [...todoDatabaseProviders, ...todoUseCaseProviders],
  exports: [...todoUseCaseProviders],
})
export class TodosModule {}
