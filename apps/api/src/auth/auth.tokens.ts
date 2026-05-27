export const AUTH_PGLITE_CLIENT = Symbol("AUTH_PGLITE_CLIENT");
export const AUTH_DRIZZLE_CLIENT = Symbol("AUTH_DRIZZLE_CLIENT");
export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
export const REFRESH_TOKEN_REPOSITORY = Symbol("REFRESH_TOKEN_REPOSITORY");
export const EMAIL_VERIFICATION_REPOSITORY = Symbol("EMAIL_VERIFICATION_REPOSITORY");
export const AUTH_USE_CASE_DEPENDENCIES = Symbol("AUTH_USE_CASE_DEPENDENCIES");
export const SIGNUP_USE_CASE = Symbol("SIGNUP_USE_CASE");
export const LOGIN_USE_CASE = Symbol("LOGIN_USE_CASE");
export const REFRESH_ACCESS_TOKEN_USE_CASE = Symbol("REFRESH_ACCESS_TOKEN_USE_CASE");
export const LOGOUT_USE_CASE = Symbol("LOGOUT_USE_CASE");
export const REQUEST_FIND_LOGIN_ID_CODE_USE_CASE = Symbol("REQUEST_FIND_LOGIN_ID_CODE_USE_CASE");
export const VERIFY_FIND_LOGIN_ID_CODE_USE_CASE = Symbol("VERIFY_FIND_LOGIN_ID_CODE_USE_CASE");
export const REQUEST_PASSWORD_RESET_CODE_USE_CASE = Symbol("REQUEST_PASSWORD_RESET_CODE_USE_CASE");
export const RESET_PASSWORD_USE_CASE = Symbol("RESET_PASSWORD_USE_CASE");

export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

export type CookieResponse = {
  cookie(name: string, value: string, options: CookieOptions): void;
  clearCookie(
    name: string,
    options?: Pick<CookieOptions, "httpOnly" | "sameSite" | "secure" | "path">,
  ): void;
};

export type CookieOptions = {
  readonly httpOnly: boolean;
  readonly sameSite: "strict";
  readonly secure: boolean;
  readonly path: string;
  readonly expires?: Date;
};
