import {
  Loader2,
  Mail,
  ArrowLeft,
  ArrowRight,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ChangePasswordFormData,
  ChangePasswordSchema,
  FindAccountFormData,
  FindAccountSchema
} from '../../miscellaneous/validation/auth';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFunction, FindAccountFunction } from '../../components/functions/auth';

export default function ChangePassword () {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FindAccountFormData>({
    resolver: zodResolver(FindAccountSchema),
  });

  const { register: registerNew, handleSubmit: handleSubmitNew, reset: resetNew, formState: { errors: errorsNew } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmitCheckAccount = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await FindAccountFunction(data);
      if (!result) {
        return;
      }

      setUser(result);
      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      toast.error(error.message || "Account lookup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await ChangePasswordFunction(user, data);
      reset();
      toast.success("Password changed successfully! Redirecting to login...");

      setIsRedirecting(true);

      setTimeout(() => {
        navigate("/");
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Password change failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Forgot Password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSubmitted 
            ? "Account Found! Please prepare to change your password." 
            : "Enter your email address / username. We will find your account"}
        </p>
      </div>

      {isSubmitted ? (
         <div className="grid gap-6">
          <form onSubmit={handleSubmitNew(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    placeholder="New Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading || isRedirecting}
                    className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    {...registerNew("password")}
                  />
                </div>
                {errorsNew.password && (
                  <p className="text-xs text-red-500">{errorsNew.password.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="sr-only">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm New Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading || isRedirecting}
                    className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    {...registerNew("confirmPassword")}
                  />
                </div>
                {errorsNew.confirmPassword && (
                  <p className="text-xs text-red-500">{errorsNew.confirmPassword.message}</p>
                )}
              </div>

              <Button
                disabled={isLoading || isRedirecting}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25 dark:shadow-indigo-900/20"
              >
                {(isLoading || isRedirecting) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRedirecting ? "Redirecting..." : "Change Password"}
                {!isLoading && !isRedirecting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t border-slate-200 dark:border-slate-700/50" />
             </div>
           </div>

          <Button variant="ghost" asChild className="h-11 w-full rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmitCheckAccount)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="identifier" className="sr-only">Email/Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="identifier"
                    placeholder="Your Email/Username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="identifier"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    {...register("identifier")}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-red-500">{errors.identifier.message}</p>
                )}
              </div>

              <Button disabled={isLoading} className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25 dark:shadow-indigo-900/20">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Account
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t border-slate-200 dark:border-slate-700/50" />
             </div>
           </div>

          <Button variant="ghost" asChild className="h-11 w-full rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}