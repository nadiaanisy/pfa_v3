import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';
import { motion } from 'motion/react';
import { TABS } from '../../miscellaneous/Constants';
import { useAuth } from '../../miscellaneous/Providers';

import { useAvatarSettings } from "./hooks/useAvatarSettings";
import { useProfileSettings } from "./hooks/useProfileSettings";
import { usePasswordSettings } from "./hooks/usePasswordSettings";
import { useDeleteAccount } from "./hooks/useDeleteAccount";

import ProfileTab from "./components/ProfileTab";
import AccountTab from "./components/AccountTab";
import AppearanceTab from "./components/AppearanceTab";
import NotificationTab from "./components/NotificationTab";

export default function Settings () {
  const { user, setUser, logout } = useAuth();

  const profile = useProfileSettings(user, setUser);
  const avatar = useAvatarSettings(user, setUser);
  const password = usePasswordSettings(user);
  const deleteAccount = useDeleteAccount(user, logout);
  
   const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* Tabs List */}
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4 bg-slate-200 p-1 dark:bg-slate-800 rounded-lg">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 rounded-md data-[state=active]:bg-slate-500 data-[state=active]:dark:bg-white data-[state=active]:shadow data-[state=active]:text-white dark:data-[state=active]:text-indigo-400"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <motion.div variants={motionVariants} initial="hidden" animate="show">
            <ProfileTab profile={profile} avatar={avatar} />
          </motion.div>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account" className="mt-6">
          <motion.div variants={motionVariants} initial="hidden" animate="show">
            <AccountTab password={password} deleteAccount={deleteAccount} />
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6">
          <motion.div variants={motionVariants} initial="hidden" animate="show">
            <AppearanceTab />
          </motion.div>
        </TabsContent>

        {/* Notification Tab */}
        <TabsContent value="notifications" className="mt-6">
          <motion.div variants={motionVariants} initial="hidden" animate="show">
            <NotificationTab />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}