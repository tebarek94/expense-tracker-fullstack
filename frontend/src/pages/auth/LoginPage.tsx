import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { LoginSchema, loginSchema } from "../../validations/auth.schema";
import { getApiErrorMessage } from "../../utils/apiError";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Login to manage your expenses
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              await login(values);
              toast.success("Login successful");
              navigate("/dashboard");
            } catch (error) {
              const message = getApiErrorMessage(error, "Login failed");
              toast.error(message);
            }
          })}
        >
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <LogIn size={16} className="mr-2" />
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
};
