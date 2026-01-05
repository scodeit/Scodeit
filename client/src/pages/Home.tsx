import { motion } from "framer-motion";
import { useStatus } from "@/hooks/use-status";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Bot, ExternalLink, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { data, isLoading } = useStatus();
  
  const status = data?.status === "Running" ? "active" : "loading";
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 pb-6 flex flex-col items-center text-center space-y-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-2"
            >
              <Bot className="w-8 h-8 text-white" />
            </motion.div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Telegram yt-dlp Bot
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Video Downloader Service
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
              <StatusIndicator status={isLoading ? "loading" : "active"} />
              <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                {isLoading ? "Checking Status..." : "System Operational"}
              </span>
            </div>
          </div>

          {/* Divider with abstract connection */}
          <div className="relative h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-2" />

          {/* Content Section */}
          <div className="p-8 pt-6 space-y-6">
            <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Ready to Process
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The bot is currently running and listening for commands.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-center text-muted-foreground uppercase tracking-widest font-semibold">
                How to start
              </p>
              <div className="relative group cursor-default">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative flex items-center justify-between bg-card px-4 py-3 rounded-lg border border-border shadow-sm">
                  <code className="text-sm font-mono text-primary font-bold">
                    /start
                  </code>
                  <span className="text-xs text-muted-foreground">Send to bot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 p-4 border-t border-border/50 text-center">
            <a 
              href="https://telegram.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Open Telegram <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>
      </motion.div>
      
      {/* Bottom attribution */}
      <div className="absolute bottom-6 left-0 w-full text-center">
        <p className="text-[10px] text-muted-foreground/40 font-mono">
          SERVER STATUS: ONLINE • v1.0.0
        </p>
      </div>
    </div>
  );
}
