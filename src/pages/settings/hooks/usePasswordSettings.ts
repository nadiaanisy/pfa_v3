import { useState } from 'react';
import { toast } from 'sonner';
import { updateUserPasswordFunction } from '../../../components/functions/settings';

export const usePasswordSettings = (user: any) => {
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fields cannot be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsPasswordLoading(true);

    try {
      const result = await updateUserPasswordFunction({
        id: user.id,
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (!result) {
        toast.error("Failed to update password");
        return;
      }

      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    isPasswordLoading,
    handlePasswordUpdate
  };
};