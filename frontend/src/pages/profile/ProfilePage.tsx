import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { ApiResponse } from "../../types/api";
import { User } from "../../types/auth";
import { getApiErrorMessage } from "../../utils/apiError";
import { profileSchema, ProfileSchema } from "../../validations/profile.schema";
import { useState } from "react";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, password: "" });
    }
  }, [user, reset]);

  const submitProfile = async (values: ProfileSchema) => {
    try {
      const payload: Record<string, string> = {
        name: values.name,
        email: values.email
      };
      if (values.password) {
        payload.password = values.password;
      }

      const response = await api.put<ApiResponse<User>>("/profile", payload);
      setUser(response.data.data);
      reset({
        name: response.data.data.name,
        email: response.data.data.email,
        password: ""
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Profile update failed"));
    }
  };

  const deleteProfile = async () => {
    try {
      setIsDeleteLoading(true);
      await api.delete("/profile");
      await logout();
      toast.success("Profile deleted");
      setIsDeleteDialogOpen(false);
      navigate("/register");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Profile deletion failed"));
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">My Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your account settings and password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(submitProfile)}>
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input
            label="New Password (Optional)"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="submit" isLoading={isSubmitting}>
              Update Profile
            </Button>
            <Button type="button" variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete Profile
            </Button>
          </div>
        </form>
      </Card>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Profile"
        description="This will permanently delete your profile and all expenses. This action cannot be undone."
        confirmLabel="Delete Profile"
        isLoading={isDeleteLoading}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteProfile}
      />
    </div>
  );
};
