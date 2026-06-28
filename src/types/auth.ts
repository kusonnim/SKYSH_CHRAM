export type AuthMode = "login" | "signup";

export type AuthFormState = {
  email: string;
  password: string;
  errorMessage: string | null;
};

