import { useEffect, useState } from "react";
import {
  changePassword,
  deleteAccount,
  getAccessToken,
  login,
  logout,
  refreshAccessToken,
  requestFindLoginIdCode,
  requestPasswordResetCode,
  resetPassword,
  signup,
  verifyFindLoginIdCode,
} from "../shared/api";
import { Button, ErrorMessage, TextInput } from "../shared/ui";
import { TodoPage } from "./todo-page";

type AuthMode = "login" | "signup" | "find-login-id" | "reset-password";
type AuthenticatedView = "todo" | "account";

export function AuthGate() {
  const [authenticated, setAuthenticated] = useState(Boolean(getAccessToken()));
  const [checkingSession, setCheckingSession] = useState(!getAccessToken());
  const [view, setView] = useState<AuthenticatedView>("todo");

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
    setView("todo");
  }

  function endSession() {
    setAuthenticated(false);
    setView("todo");
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
        <div className="mx-auto max-w-[390px] text-sm text-[#6B7280]">확인 중...</div>
      </main>
    );
  }

  if (authenticated && view === "account") {
    return <AccountManagement onBack={() => setView("todo")} onSessionEnded={endSession} />;
  }

  return authenticated ? (
    <TodoPage onLogout={handleLogout} onManageAccount={() => setView("account")} />
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
  const titleByMode = {
    login: "로그인",
    signup: "회원가입",
    "find-login-id": "아이디 찾기",
    "reset-password": "비밀번호 재설정",
  } satisfies Record<AuthMode, string>;
  const title = titleByMode[mode];

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
    } catch (error) {
      setError(
        toErrorMessage(
          error,
          mode === "login" ? "로그인하지 못했습니다." : "회원가입하지 못했습니다.",
        ),
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
      <div className="mx-auto max-w-[390px] space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-[#6B7280]">Todo를 계정별로 관리하세요.</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["login", "로그인"],
              ["signup", "회원가입"],
              ["find-login-id", "아이디 찾기"],
              ["reset-password", "비밀번호 재설정"],
            ] as const
          ).map(([nextMode, label]) => (
            <Button
              aria-pressed={mode === nextMode}
              key={nextMode}
              onClick={() => {
                setError(null);
                setMode(nextMode);
              }}
              size="sm"
              variant={mode === nextMode ? "primary" : "default"}
            >
              {label}
            </Button>
          ))}
        </div>

        {mode === "find-login-id" ? <FindLoginIdForm /> : null}
        {mode === "reset-password" ? <PasswordResetForm /> : null}

        {mode === "login" || mode === "signup" ? (
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
        ) : null}
      </div>
    </main>
  );
}

function FindLoginIdForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loginId, setLoginId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestCode() {
    setError(null);

    try {
      await requestFindLoginIdCode({ email });
    } catch (error) {
      setError(toErrorMessage(error, "인증 코드를 발송하지 못했습니다."));
    }
  }

  async function verifyCode() {
    setError(null);

    try {
      const result = await verifyFindLoginIdCode({ email, code });
      setLoginId(result.loginId);
    } catch (error) {
      setError(toErrorMessage(error, "로그인 ID를 확인하지 못했습니다."));
    }
  }

  return (
    <div className="space-y-3">
      <Field label="이메일" onChange={setEmail} type="email" value={email} />
      <Button className="w-full" onClick={() => void requestCode()} type="button">
        인증 코드 발송
      </Button>
      <Field label="인증 코드" onChange={setCode} value={code} />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      {loginId ? (
        <p className="text-sm font-semibold text-[#1F2937]">로그인 ID: {loginId}</p>
      ) : null}
      <Button className="w-full" onClick={() => void verifyCode()} type="button" variant="primary">
        로그인 ID 확인
      </Button>
    </div>
  );
}

function PasswordResetForm() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    passwordConfirm: "",
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function requestCode() {
    setError(null);

    try {
      await requestPasswordResetCode({ email: form.email });
    } catch (error) {
      setError(toErrorMessage(error, "인증 코드를 발송하지 못했습니다."));
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDone(false);

    try {
      await resetPassword(form);
      setDone(true);
    } catch (error) {
      setError(toErrorMessage(error, "비밀번호를 변경하지 못했습니다."));
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <Field
        label="이메일"
        onChange={(value) => updateField("email", value)}
        type="email"
        value={form.email}
      />
      <Button className="w-full" onClick={() => void requestCode()} type="button">
        인증 코드 발송
      </Button>
      <Field label="인증 코드" onChange={(value) => updateField("code", value)} value={form.code} />
      <Field
        label="새 비밀번호"
        onChange={(value) => updateField("password", value)}
        type="password"
        value={form.password}
      />
      <Field
        label="새 비밀번호 확인"
        onChange={(value) => updateField("passwordConfirm", value)}
        type="password"
        value={form.passwordConfirm}
      />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      {done ? (
        <p className="text-sm font-semibold text-[#1F2937]">비밀번호가 변경되었습니다.</p>
      ) : null}
      <Button className="w-full" type="submit" variant="primary">
        비밀번호 변경
      </Button>
    </form>
  );
}

function AccountManagement({
  onBack,
  onSessionEnded,
}: {
  readonly onBack: () => void;
  readonly onSessionEnded: () => void;
}) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function updatePasswordField(field: keyof typeof passwordForm, value: string) {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await changePassword(passwordForm);
      onSessionEnded();
    } catch (error) {
      setError(toErrorMessage(error, "비밀번호를 변경하지 못했습니다."));
    }
  }

  async function submitDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await deleteAccount({ password: deletePassword });
      onSessionEnded();
    } catch (error) {
      setError(toErrorMessage(error, "회원탈퇴를 완료하지 못했습니다."));
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
      <div className="mx-auto max-w-[390px] space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">계정 관리</h1>
            <p className="text-sm text-[#6B7280]">비밀번호와 계정 상태를 관리합니다.</p>
          </div>
          <Button onClick={onBack} size="sm">
            돌아가기
          </Button>
        </header>

        <form className="space-y-3" onSubmit={submitPassword}>
          <Field
            label="현재 비밀번호"
            onChange={(value) => updatePasswordField("currentPassword", value)}
            type="password"
            value={passwordForm.currentPassword}
          />
          <Field
            label="새 비밀번호"
            onChange={(value) => updatePasswordField("password", value)}
            type="password"
            value={passwordForm.password}
          />
          <Field
            label="새 비밀번호 확인"
            onChange={(value) => updatePasswordField("passwordConfirm", value)}
            type="password"
            value={passwordForm.passwordConfirm}
          />
          <Button className="w-full" type="submit" variant="primary">
            비밀번호 변경
          </Button>
        </form>

        <form className="space-y-3" onSubmit={submitDelete}>
          <Field
            label="탈퇴 확인 비밀번호"
            onChange={setDeletePassword}
            type="password"
            value={deletePassword}
          />
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <Button className="w-full" type="submit">
            회원탈퇴
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

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
