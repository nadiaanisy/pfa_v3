import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import {
  Avatar,
  AvatarImage
} from '../../../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { Loader2 } from 'lucide-react';
import {
  CURRENCIES,
  DEFAULT_AVATAR
} from '../../../miscellaneous/Constants';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

export default function ProfileTab({ profile, avatar }: any) {
  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-800">
              <AvatarImage src={avatar.avatarUrl || DEFAULT_AVATAR} />
            </Avatar>

            <div className="space-y-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Profile Picture</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">We support PNGs, JPGs and GIFs under 2MB</p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={avatar.handleUploadAvatarClick}
                  disabled={avatar.isAvatarLoading}
                >
                  {avatar.isAvatarLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Upload New
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={avatar.handleRemoveAvatar}
                  disabled={avatar.isAvatarRemovedLoading}
                >
                  {avatar.isAvatarRemovedLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-4 border-t-2 border-slate-300 dark:border-slate-700" />

          <form onSubmit={profile.handleProfileUpdate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  value={profile.fullname}
                  onChange={(e) => profile.setFullname(e.target.value)}
                  placeholder="Full name"
                  className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => profile.setUsername(e.target.value)}
                  placeholder="Username"
                  className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={profile.email}
                  onChange={(e) => profile.setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  onValueChange={profile.setCurrency}
                  value={profile.currency}
                >
                  <SelectTrigger
                    id="currency"
                    className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  >
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={profile.isProfileLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {profile.isProfileLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}