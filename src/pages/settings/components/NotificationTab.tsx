import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';

export default function NotificationTab () {
  return (
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
  )
}