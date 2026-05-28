import { useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { TextInput, type TextInputState } from "./text-input";

export type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  readonly inputClassName?: string;
  readonly state?: TextInputState;
};

export function PasswordInput({
  className,
  inputClassName = "",
  state = "default",
  ...props
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <TextInput
        className={cn(
          "h-[42px] rounded-[6px] px-3 pr-12 text-[14px] leading-5 placeholder:text-[#6B7280]",
          inputClassName,
        )}
        state={state}
        type={isPasswordVisible ? "text" : "password"}
        {...props}
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold leading-[17px] text-[#6B7280] hover:text-[#1F2937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        onClick={() => setIsPasswordVisible((current) => !current)}
        type="button"
      >
        {isPasswordVisible ? "숨김" : "표시"}
      </button>
    </div>
  );
}

export type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> & {
  readonly errorMessage?: string;
  readonly inputClassName?: string;
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly state?: TextInputState;
  readonly type?: "email" | "password" | "text";
};

export function FormField({
  className,
  errorMessage,
  id,
  inputClassName = "",
  label,
  onChange,
  state = "default",
  type = "text",
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `auth-${label}-${generatedId}`;
  const invalid = Boolean(errorMessage) || state === "error";
  const inputState = invalid ? "error" : state;

  return (
    <div className={cn("space-y-[6px]", className)}>
      <label className="text-[13px] font-semibold leading-[18px]" htmlFor={fieldId}>
        {label}
      </label>
      {type === "password" ? (
        <PasswordInput
          aria-invalid={invalid || props["aria-invalid"]}
          id={fieldId}
          inputClassName={inputClassName}
          onChange={(event) => onChange(event.target.value)}
          state={inputState}
          {...props}
        />
      ) : (
        <TextInput
          aria-invalid={invalid || props["aria-invalid"]}
          className={cn(
            "h-[42px] rounded-[6px] px-3 text-[14px] leading-5 placeholder:text-[#6B7280]",
            inputClassName,
          )}
          id={fieldId}
          onChange={(event) => onChange(event.target.value)}
          state={inputState}
          type={type}
          {...props}
        />
      )}
      {errorMessage ? (
        <p className="text-[12px] leading-[17px] text-[#DC2626]">{errorMessage}</p>
      ) : null}
    </div>
  );
}

export type TextActionProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function TextAction({ className, type = "button", ...props }: TextActionProps) {
  return (
    <button
      className={cn(
        "block text-left text-[13px] font-semibold leading-[18px] text-[#2563EB] hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
