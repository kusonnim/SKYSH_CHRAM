export const authRedirects = {
  afterLogin: "/dashboard",
  afterLogout: "/login",
  afterSignupWithConfirmation: "/login",
  afterAuthCallback: "/dashboard",
} as const;

