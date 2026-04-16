import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import toast from "react-hot-toast";
import api, { setUnauthorizedHandler } from "../api/axios";
import { ApiResponse } from "../types/api";
import { AuthPayload, LoginInput, RegisterInput, User } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AUTH_KEY = "expense_tracker_auth";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseStoredAuth = (): AuthState => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    return { user: null, token: null };
  }

  try {
    const parsed = JSON.parse(raw) as AuthState;
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null
    };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, token: null });
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const updateAuth = useCallback((nextState: AuthState) => {
    setAuthState(nextState);
    localStorage.setItem(AUTH_KEY, JSON.stringify(nextState));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Intentionally swallow since local logout still needed.
    }
    updateAuth({ user: null, token: null });
  }, [updateAuth]);

  useEffect(() => {
    updateAuth(parseStoredAuth());
    setIsBootstrapped(true);
  }, [updateAuth]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      updateAuth({ user: null, token: null });
      toast.error("Your session expired. Please login again.");
    });
    return () => setUnauthorizedHandler(null);
  }, [updateAuth]);

  const login = useCallback(
    async (payload: LoginInput) => {
      const response = await api.post<ApiResponse<AuthPayload>>("/auth/login", payload);
      updateAuth({
        user: response.data.data.user,
        token: response.data.data.accessToken
      });
    },
    [updateAuth]
  );

  const register = useCallback(
    async (payload: RegisterInput) => {
      const response = await api.post<ApiResponse<AuthPayload>>("/auth/register", payload);
      updateAuth({
        user: response.data.data.user,
        token: response.data.data.accessToken
      });
    },
    [updateAuth]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.token),
      isBootstrapped,
      login,
      register,
      logout,
      setUser: (user: User) => updateAuth({ user, token: authState.token })
    }),
    [authState.user, authState.token, isBootstrapped, login, logout, register, updateAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
