import {
  useEffect,
  useState
} from 'react';
import { toast } from 'sonner';
import {
  updateUserProfileFunction,
  fetchCurrentUserFunction
} from '../../../components/functions/settings';

export const useProfileSettings = (user: any, setUser: any) => {
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("MYR");

  useEffect(() => {
    if (!user) return;
    setFullname(user.fullname || "");
    setUsername(user.username || "");
    setEmail(user.email || "");
    setCurrency(user.currency || "MYR");
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);

    try {
      const success = await updateUserProfileFunction({
        id: user.id,
        fullname,
        username,
        email,
        currency
      });

      if (!success) {
        toast.error("Failed to update profile");
        return;
      }

      const updatedUser = await fetchCurrentUserFunction(user.id);
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsProfileLoading(false);
    }
  };

  return {
    fullname,
    username,
    email,
    currency,
    setFullname,
    setUsername,
    setEmail,
    setCurrency,
    isProfileLoading,
    handleProfileUpdate
  };
};