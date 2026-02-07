import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  AtSign
} from 'lucide-react';
import {
  useForm,
  Controller
} from 'react-hook-form';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  RegistrationFormData,
  RegistrationSchema
} from '../../miscellaneous/validation/auth';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { CURRENCIES } from '../../miscellaneous/Constants';
import { RegistrationFunction } from '../../components/functions/auth';

export default function Registration () {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      currency: "",
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const user = await RegistrationFunction(data);
      if (!user) return;

      toast.success("Registration successful! Redirecting to login...");
      reset();

      setIsRedirecting(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your details below to create your account
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname" className="sr-only">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-900 dark:text-slate-400" />
                <Input
                  id="fullname"
                  placeholder="Your Full Name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="fullname"
                  autoCorrect="off"
                  disabled={isLoading || isRedirecting}
                  className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  {...register("fullname")}
                />
              </div>
              {errors.fullname && (
                <p className="text-xs text-red-500">{errors.fullname.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username" className="sr-only">Username</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-5 w-5 text-slate-900 dark:text-slate-400" />
                <Input
                  id="username"
                  placeholder="Your Username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  disabled={isLoading || isRedirecting}
                  className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency" className="sr-only">Preferred Currency</Label>
              <Controller
                name="currency"
                control={control}
                rules={{ required: "Please select a currency" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="currency"
                      className="h-11 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    >
                      <SelectValue placeholder="Select Preferred Currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-black/80">
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency && (
                <p className="text-xs text-red-500">{errors.currency.message as string}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-900 dark:text-slate-400" />
                <Input
                  id="email"
                  placeholder="Your Email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading || isRedirecting}
                  className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-900 dark:text-slate-400" />
                <Input
                  id="password"
                  placeholder="Your Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading || isRedirecting}
                  className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="sr-only">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-900 dark:text-slate-400" />
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Your Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading || isRedirecting}
                  className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              disabled={isLoading || isRedirecting}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25 dark:shadow-indigo-900/20"
            >
              {(isLoading || isRedirecting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRedirecting ? "Redirecting..." : "Create Account"}
              {!isLoading && !isRedirecting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}