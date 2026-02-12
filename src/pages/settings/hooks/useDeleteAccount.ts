import { toast } from 'sonner';
import { useState } from 'react';
import { deleteAccountFunction } from '../../../components/functions/settings';

export const useDeleteAccount = (user: any, logout: any) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleteLoading(true);

    const result = await deleteAccountFunction(user.id);

    if (!result) {
      toast.error("Failed to delete account");
      setIsDeleteLoading(false);
      return;
    }

    toast.success("Account deleted. We're sorry to see you go.");

    setTimeout(() => logout(), 2000);
  };

  return { isDeleteLoading, handleDeleteAccount };
};
