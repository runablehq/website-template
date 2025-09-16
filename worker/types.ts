import type { auth } from "./auth";

type AppUser = typeof auth.$Infer.Session.user & {
  role?: string;
  provider?: string;
};

export type HonoContext = {
  Variables: {
    user: AppUser | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
