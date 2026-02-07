import {
  useEffect,
  useState
} from 'react';
import { 
  User, 
  Lock, 
  Palette, 
  Bell, 
  Shield, 
  Save, 
  Trash2, 
  Mail, 
  Smartphone,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';
import {
  Avatar,
  AvatarImage
} from '../../components/ui/avatar';
import { motion } from 'motion/react';
import {
  DEFAULT_AVATAR,
  INTERFACE_DENSITY,
  TABS
} from '../../miscellaneous/Constants';
import {
  fetchCurrentUserFunction,
  updateUserAvatarFunction,
  updateUserPasswordFunction,
  updateUserProfileFunction
} from '../../components/functions/settings';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { useAuth } from '../../miscellaneous/Providers';
import { Separator } from '../../components/ui/separator';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function Settings() {
  const { setUser, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile State
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Appearance State
  const [selectedDensity, setSelectedDensity] = useState<string>(
    user?.preferences?.interfaceDensity || INTERFACE_DENSITY[1]
  );

  // Notification State
  // const [emailNotifs, setEmailNotifs] = useState(true);
  // const [marketingEmails, setMarketingEmails] = useState(false);
  // const [pushNotifs, setPushNotifs] = useState(true);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  const handleRemoveAvatar = async () => {
    setIsLoading(true);
    try {
      const success = await updateUserAvatarFunction(user, null);

      if (!success) {
        toast.error("Failed to remove avatar");
        return;
      }

      const updatedUser = await fetchCurrentUserFunction(user.id);
      setUser(updatedUser);

      toast.success("Avatar removed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatar = async (base64: string) => {
    setIsLoading(true);
    try {
      const success = await updateUserAvatarFunction(user, base64);

      if (!success) {
        toast.error("Failed to upload avatar");
        return;
      }
      
      const updatedUser = await fetchCurrentUserFunction(user.id);
      setUser(updatedUser);

      toast.success("Avatar updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          handleUploadAvatar(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      id: user.id,
      fullname,
      username,
      email
    }

    setIsLoading(true);
    try {
      const success = await updateUserProfileFunction(payload);

      if (!success) {
        toast.error("Failed to update profile");
        return;
      }
      const updatedUser = await fetchCurrentUserFunction(user.id);
      setUser(updatedUser);

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fields cannot be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    
    const payload = {
      id: user.id,
      currentPassword,
      newPassword,
      confirmPassword
    }

    setIsLoading(true);
    try {
      const result = await updateUserPasswordFunction(payload);
      if (!result) {
        toast.error("Failed to update password");
        return;
      }
      toast.success("Password updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
     setIsLoading(false); 
     setCurrentPassword("");
     setNewPassword("");
     setConfirmPassword("");
    }
  };

  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* Tabs List */}
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4 bg-slate-100 p-1 dark:bg-slate-800 rounded-lg">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900/50 data-[state=active]:shadow data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <motion.div
            key="profile"
            initial="hidden"
            animate="show"
            variants={motionVariants}
          >
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-800">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} />
                    ) : (
                      <AvatarImage src={DEFAULT_AVATAR} />
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">Profile Picture</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      We support PNGs, JPGs and GIFs under 2MB
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadAvatarClick}
                        disabled={isLoading}
                      >
                        Upload new
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleRemoveAvatar}
                        disabled={!avatarUrl || isLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 border-t-2 border-slate-300 dark:border-slate-700" />

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="John Doe"
                        className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                        className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="mt-6">
          <motion.div
            key="account"
            initial="hidden"
            animate="show"
            variants={motionVariants}
          >
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handlePasswordUpdate}
                    >
                      <Save className="mr-2 h-4 w-4" /> Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6">
          <motion.div
            key="appearance"
            initial="hidden"
            animate="show"
            variants={motionVariants}
          >
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Theme Preference</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select your preferred color theme.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                {/* <Separator className="my-4 border-t-2 border-slate-300 dark:border-slate-700" />

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Interface Density</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {INTERFACE_DENSITY.map((density) => (
                      <div
                        key={density}
                        className={`cursor-pointer rounded-lg border p-4 text-center
                          ${selectedDensity === density 
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          }`}
                        onClick={() => setSelectedDensity(density)}
                      >
                        <div className="mb-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="mb-2 h-2 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-sm font-medium">{density}</span>
                      </div>
                    ))}
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <motion.div
            key="appearance"
            initial="hidden"
            animate="show"
            variants={motionVariants}
          >
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive alerts and updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-start space-x-4">
                  COMING SOON
                  {/* <Mail className="mt-1 h-5 w-5 text-indigo-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifs" className="font-medium">Email Notifications</Label>
                      <Switch 
                        id="email-notifs" 
                        checked={user.preferences?.emailNotifs ?? true} 
                        onCheckedChange={() => togglePreference('emailNotifs')} 
                      />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Receive daily summaries and important alerts via email.
                    </p>
                  </div>*/}
                </div>
                
                {/*<Separator />
                
                <div className="flex items-start space-x-4">
                  <Smartphone className="mt-1 h-5 w-5 text-purple-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifs" className="font-medium">Push Notifications</Label>
                      <Switch 
                        id="push-notifs" 
                        checked={user.preferences?.pushNotifs ?? true} 
                        onCheckedChange={() => togglePreference('pushNotifs')} 
                      />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Receive real-time alerts on your mobile device.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <span className="text-xs font-bold">%</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                      <Switch 
                        id="marketing-emails" 
                        checked={user.preferences?.marketingEmails ?? false} 
                        onCheckedChange={() => togglePreference('marketingEmails')} 
                      />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Receive news, special offers, and product updates.
                    </p>
                  </div>
                </div> */}
              </CardContent>
              {/*<CardFooter className="bg-slate-50 px-6 py-4 dark:bg-slate-900/50">
                <Button variant="outline" className="w-full sm:w-auto">
                  Manage Devices
                </Button>
              </CardFooter> */}
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}