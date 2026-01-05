import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "active" | "inactive" | "loading";
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const colors = {
    active: "bg-emerald-500 shadow-emerald-500/50",
    inactive: "bg-rose-500 shadow-rose-500/50",
    loading: "bg-amber-500 shadow-amber-500/50",
  };

  return (
    <div className={cn("relative flex items-center justify-center w-3 h-3", className)}>
      <motion.div
        className={cn("absolute w-full h-full rounded-full opacity-75", colors[status === "active" ? "active" : "loading"])}
        animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className={cn("relative w-2.5 h-2.5 rounded-full shadow-sm", colors[status === "active" ? "active" : "loading"])} />
    </div>
  );
}
