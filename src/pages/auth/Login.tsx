import {
  Loader2,
  Lock,
  User
} from 'lucide-react';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LoginFormData,
  LoginSchema
} from '../../miscellaneous/validation/auth';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFunction } from '../../components/functions/auth';

export default function Login () {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const user = await LoginFunction(data);
      if (!user) return;

      toast.success("Welcome back!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please enter your details to log in
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier" className="sr-only">Email or Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="identifier"
                  placeholder="Email or Username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
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

            <div className="grid gap-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 dark:border-slate-600" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-400"
                >
                  Remember me
                </label>
              </div> */}
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              disabled={isLoading} 
              className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25 dark:shadow-indigo-900/20"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

          </div>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}