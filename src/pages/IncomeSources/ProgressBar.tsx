import { motion } from 'motion/react';

interface Props {
  value: number;
  max: number;
}

export default function ProgressBar({
  value,
  max
}: Props) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  let gradient = "from-red-500 to-pink-500";
  if (percentage > 50) gradient = "from-amber-500 to-orange-500";
  if (percentage > 80) gradient = "from-emerald-500 to-teal-500";

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 mt-2">
      <motion.div
        className={`h-full bg-gradient-to-r ${gradient}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}