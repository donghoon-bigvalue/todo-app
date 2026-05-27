import { useEffect, useState } from "react";
import { getAccessToken, login, logout, refreshAccessToken, signup } from "../shared/api";
import { Button, ErrorMessage, TextInput } from "../shared/ui";
import { TodoPage } from "./todo-page";

type AuthMode = "login" | "signup";

export function AuthGate() {
  const [authenticated, setAuthenticated] = useState(Boolean(getAccessToken()));
  const [checkingSession, setCheckingSession] = useState(!getAccessToken());

  useEffect(() => {
    if (authenticated) {
      setCheckingSession(false);
      return;
    }

    refreshAccessToken()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, [authenticated]);

  async function handleLogout() {
    await logout();
    setAuthenticated(false);
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
        <div className="mx-auto max-w-[390px] text-sm text-[#6B7280]">확인 중...</div>
      </main>
    );
  }

  return authenticated ? (
    <TodoPage onLogout={handleLogout} />
  ) : (
    <AuthForm onAuthenticated={() => setAuthenticated(true)} />
  );
}

function AuthForm({ onAuthenticated }: { readonly onAuthenticated: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState({
    loginId: "",
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const title = mode === "login" ? "로그인" : "회원가입";

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (mode === "signup") {
        await signup(form);
      }

      await login({
        loginId: form.loginId,
        password: form.password,
      });
      onAuthenticated();
    } catch {
      setError(mode === "login" ? "로그인하지 못했습니다." : "회원가입하지 못했습니다.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
      <div className="mx-auto max-w-[390px] space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-[#6B7280]">Todo를 계정별로 관리하세요.</p>
        </header>

        <div className="flex gap-2">
          <Button
            aria-pressed={mode === "login"}
            onClick={() => setMode("login")}
            size="sm"
            variant={mode === "login" ? "primary" : "default"}
          >
            로그인
          </Button>
          <Button
            aria-pressed={mode === "signup"}
            onClick={() => setMode("signup")}
            size="sm"
            variant={mode === "signup" ? "primary" : "default"}
          >
            회원가입
          </Button>
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <Field
            label="로그인 ID"
            onChange={(value) => updateField("loginId", value)}
            value={form.loginId}
          />
          {mode === "signup" ? (
            <>
              <Field
                label="닉네임"
                onChange={(value) => updateField("nickname", value)}
                value={form.nickname}
              />
              <Field
                label="이메일"
                onChange={(value) => updateField("email", value)}
                type="email"
                value={form.email}
              />
            </>
          ) : null}
          <Field
            label="비밀번호"
            onChange={(value) => updateField("password", value)}
            type="password"
            value={form.password}
          />
          {mode === "signup" ? (
            <Field
              label="비밀번호 확인"
              onChange={(value) => updateField("passwordConfirm", value)}
              type="password"
              value={form.passwordConfirm}
            />
          ) : null}
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <Button className="w-full" type="submit" variant="primary">
            {mode === "login" ? "로그인" : "계정 만들기"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value,
}: {
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly type?: string;
  readonly value: string;
}) {
  const id = `auth-${label}`;

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold" htmlFor={id}>
        {label}
      </label>
      <TextInput
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </div>
  );
}
