import "reflect-metadata";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const DEFAULT_PORT = 3000;

async function bootstrap(): Promise<void> {
  loadLocalEnv();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? DEFAULT_PORT);

  await app.listen(port);
}

function loadLocalEnv(): void {
  if (existsSync(".env")) {
    loadEnvFile(".env");
  }
}

void bootstrap();
