import "reflect-metadata";
import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
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
  const envPath = findEnvFile(process.cwd());

  if (envPath) {
    loadEnvFile(envPath);
  }
}

function findEnvFile(startDir: string): string | null {
  let currentDir = startDir;
  const root = parse(startDir).root;

  while (true) {
    const envPath = join(currentDir, ".env");

    if (existsSync(envPath)) {
      return envPath;
    }

    if (currentDir === root) {
      return null;
    }

    currentDir = dirname(currentDir);
  }
}

void bootstrap();
