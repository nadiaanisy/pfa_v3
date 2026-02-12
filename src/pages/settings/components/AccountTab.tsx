import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';

export default function AccountTab({ password, deleteAccount }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={password.handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="current-password"
                type="password"
                value={password.currentPassword}
                onChange={(e) => password.setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="New password"
                  value={password.newPassword}
                  onChange={(e) => password.setNewPassword(e.target.value)}
                  className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={password.confirmPassword}
                  onChange={(e) => password.setConfirmPassword(e.target.value)}
                  className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={password.isPasswordLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={password.handlePasswordUpdate}
              >
                {password.isPasswordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10 mt-5">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-red-600/80 dark:text-red-400/80">
            Irreversible actions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Delete Account</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Permanently remove your account and all data.
              </p>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteAccount.isDeleteLoading}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={deleteAccount.handleDeleteAccount}
                    disabled={deleteAccount.isDeleteLoading}
                  >
                    {deleteAccount.isDeleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
