import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '../components/ui/card';
import { motion } from 'motion/react';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function UnderConstructionLayout() {
  const location = useLocation();
  const title = location.pathname.substring(1).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      <motion.div variants={item}>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your {title.toLowerCase()} here.</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <Construction className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-xl">Under Construction</CardTitle>
            <CardDescription>
              This {title} module is currently being built. Check back soon!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We're working hard to bring you the best experience for tracking your {title.toLowerCase()}.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
