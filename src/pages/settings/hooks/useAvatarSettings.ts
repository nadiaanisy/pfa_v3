import {
  useState,
  useEffect
} from 'react';
import { toast } from 'sonner';
import {
    updateUserAvatarFunction,
    fetchCurrentUserFunction
} from '../../../components/functions/settings';

export const useAvatarSettings = (user: any, setUser: any) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isAvatarRemovedLoading, setIsAvatarRemovedLoading] = useState(false);

  useEffect(() => {
    setAvatarUrl(user?.avatar_url || '');
  }, [user]);

  const handleUploadAvatar = async (base64: string) => {
    setIsAvatarLoading(true);
    try {
      const success = await updateUserAvatarFunction(user, base64);
      if (!success) {
        toast.error("Failed to upload avatar");
        return;
      }

      const updatedUser: any = await fetchCurrentUserFunction(user.id);
      setUser(updatedUser);
      setAvatarUrl(updatedUser.avatar_url || '');
      toast.success("Avatar updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsAvatarRemovedLoading(true);
    try {
      const success = await updateUserAvatarFunction(user, null);
      if (!success) {
        toast.error("Failed to remove avatar");
        return;
      }

      const updatedUser: any = await fetchCurrentUserFunction(user.id);
      setUser(updatedUser);
      setAvatarUrl(updatedUser.avatar_url || '');
      toast.success("Avatar removed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsAvatarRemovedLoading(false);
    }
  };

  const handleUploadAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) =>
        handleUploadAvatar(event.target.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return {
    avatarUrl,
    isAvatarLoading,
    isAvatarRemovedLoading,
    handleRemoveAvatar,
    handleUploadAvatarClick
  };
};