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
import { cn } from "../shared/lib/cn";
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
      <AuthShell>
        <p className="text-sm text-[#6B7280]">확인 중...</p>
      </AuthShell>
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
  const subtitleByMode = {
    login: "로그인 ID로 Todo App을 시작합니다.",
    signup: "계정 정보를 입력해 Todo를 개인화합니다.",
    "find-login-id": "가입한 이메일로 인증 코드를 받습니다.",
    "reset-password": "이메일 인증 후 새 비밀번호를 설정합니다.",
  } satisfies Record<AuthMode, string>;

  function switchMode(nextMode: AuthMode) {
    setError(null);
    setMode(nextMode);
  }

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
    <AuthShell>
      <AuthHeader subtitle={subtitleByMode[mode]} title={titleByMode[mode]} />

      {mode === "find-login-id" ? <FindLoginIdForm /> : null}
      {mode === "reset-password" ? (
        <PasswordResetForm onBackToLogin={() => switchMode("login")} />
      ) : null}

      {mode === "login" || mode === "signup" ? (
        <AuthCard>
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
            <FormButton type="submit" variant="primary">
              {mode === "login" ? "로그인" : "회원가입"}
            </FormButton>
          </form>
          {mode === "login" ? (
            <div className="mt-4 space-y-2">
              <TextAction onClick={() => switchMode("signup")}>회원가입</TextAction>
              <TextAction onClick={() => switchMode("find-login-id")}>아이디 찾기</TextAction>
              <TextAction onClick={() => switchMode("reset-password")}>비밀번호 재설정</TextAction>
            </div>
          ) : (
            <div className="mt-4">
              <TextAction onClick={() => switchMode("login")}>로그인으로 돌아가기</TextAction>
            </div>
          )}
        </AuthCard>
      ) : null}
    </AuthShell>
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
    <AuthCard>
      <Field label="이메일" onChange={setEmail} type="email" value={email} />
      <FormButton onClick={() => void requestCode()} type="button" variant="default">
        인증 코드 발송
      </FormButton>
      <Field label="인증 코드" onChange={setCode} value={code} />
      {loginId ? (
        <div className="rounded-[6px] bg-[#EFF6FF] p-3">
          <p className="text-[13px] font-semibold leading-[18px] text-[#2563EB]">찾은 로그인 ID</p>
          <p className="text-[18px] font-semibold leading-[26px] text-[#1F2937]">{loginId}</p>
        </div>
      ) : null}
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <FormButton onClick={() => void verifyCode()} type="button" variant="primary">
        인증 확인
      </FormButton>
    </AuthCard>
  );
}

function PasswordResetForm({ onBackToLogin }: { readonly onBackToLogin: () => void }) {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    passwordConfirm: "",
  });
  const [verified, setVerified] = useState(false);
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

  function confirmCode() {
    setError(null);

    if (!form.email || !form.code) {
      setError("이메일과 인증 코드를 입력해주세요.");
      return;
    }

    setVerified(true);
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

  if (!verified) {
    return (
      <AuthCard>
        <Field
          label="이메일"
          onChange={(value) => updateField("email", value)}
          type="email"
          value={form.email}
        />
        <FormButton onClick={() => void requestCode()} type="button" variant="default">
          인증 코드 발송
        </FormButton>
        <Field
          label="인증 코드"
          onChange={(value) => updateField("code", value)}
          value={form.code}
        />
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        <FormButton onClick={confirmCode} type="button" variant="primary">
          인증 확인
        </FormButton>
      </AuthCard>
    );
  }

  return (
    <>
      <AuthHeader subtitle="이메일 인증이 완료되었습니다." title="새 비밀번호 설정" />
      <AuthCard>
        <form className="space-y-3" onSubmit={submit}>
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
          <FormButton type="submit" variant="primary">
            비밀번호 재설정
          </FormButton>
        </form>
        <div className="mt-4">
          <TextAction onClick={onBackToLogin}>로그인으로 돌아가기</TextAction>
        </div>
      </AuthCard>
    </>
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
  const [confirmingWithdrawal, setConfirmingWithdrawal] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function updatePasswordField(field: keyof typeof passwordForm, value: string) {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);

    try {
      await changePassword(passwordForm);
      onSessionEnded();
    } catch (error) {
      setPasswordError(toErrorMessage(error, "비밀번호를 변경하지 못했습니다."));
    }
  }

  async function submitDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeleteError(null);

    try {
      await deleteAccount({ password: deletePassword });
      onSessionEnded();
    } catch (error) {
      setDeleteError(toErrorMessage(error, "회원탈퇴를 완료하지 못했습니다."));
    }
  }

  if (confirmingWithdrawal) {
    return (
      <AuthShell>
        <AuthHeader
          subtitle="비밀번호를 입력하면 계정과 Todo가 삭제됩니다."
          title="회원탈퇴 확인"
        />
        <AuthCard>
          <form className="space-y-3" onSubmit={submitDelete}>
            <Field
              label="탈퇴 확인 비밀번호"
              onChange={setDeletePassword}
              type="password"
              value={deletePassword}
            />
            {deleteError ? <ErrorMessage>{deleteError}</ErrorMessage> : null}
            <FormButton type="submit" variant="primary">
              회원탈퇴
            </FormButton>
          </form>
          <div className="mt-4">
            <TextAction onClick={() => setConfirmingWithdrawal(false)}>
              취소하고 돌아가기
            </TextAction>
          </div>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <header className="flex items-start justify-between gap-4">
        <AuthHeader
          className="min-w-0 flex-1"
          subtitle="비밀번호 변경과 회원탈퇴를 진행합니다."
          title="계정 관리"
        />
        <Button className="h-7 rounded-[6px] text-[12px] leading-[17px]" onClick={onBack} size="sm">
          돌아가기
        </Button>
      </header>

      <AuthCard>
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
          {passwordError ? <ErrorMessage>{passwordError}</ErrorMessage> : null}
          <FormButton type="submit" variant="primary">
            비밀번호 변경
          </FormButton>
        </form>
      </AuthCard>

      <AuthCard>
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-[16px] font-semibold leading-[23px] text-[#DC2626]">회원탈퇴</h2>
            <p className="text-[13px] leading-[18px] text-[#6B7280]">
              계정과 Todo가 hard delete로 삭제됩니다.
            </p>
          </div>
          <FormButton
            onClick={() => setConfirmingWithdrawal(true)}
            type="button"
            variant="dangerSoft"
          >
            회원탈퇴
          </FormButton>
        </div>
      </AuthCard>
    </AuthShell>
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
    <div className="space-y-[6px]">
      <label className="text-[13px] font-semibold leading-[18px]" htmlFor={id}>
        {label}
      </label>
      <TextInput
        className="h-[42px] rounded-[6px] px-3 text-[14px] leading-5"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </div>
  );
}

function AuthShell({ children }: { readonly children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-6 text-[#1F2937]">
      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-5">{children}</div>
    </main>
  );
}

function AuthHeader({
  className,
  subtitle,
  title,
}: {
  readonly className?: string;
  readonly subtitle: string;
  readonly title: string;
}) {
  return (
    <header className={cn("space-y-1", className)}>
      <h1 className="text-[24px] font-semibold leading-[35px]">{title}</h1>
      <p className="text-[14px] leading-5 text-[#6B7280]">{subtitle}</p>
    </header>
  );
}

function AuthCard({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <section className={cn("w-full rounded-[8px] border border-[#E5E7EB] bg-white p-4", className)}>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FormButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("h-7 w-full rounded-[6px] text-[12px] leading-[17px]", className)}
      size="sm"
      {...props}
    />
  );
}

function TextAction({
  children,
  onClick,
}: {
  readonly children: React.ReactNode;
  readonly onClick: () => void;
}) {
  return (
    <button
      className="block text-left text-[13px] font-semibold leading-[18px] text-[#2563EB] hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
