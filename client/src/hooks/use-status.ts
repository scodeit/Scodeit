import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStatus() {
  return useQuery({
    queryKey: [api.status.get.path],
    queryFn: async () => {
      // In a real scenario, we fetch from the API
      // const res = await fetch(api.status.get.path);
      // if (!res.ok) throw new Error("Failed to fetch status");
      // return api.status.get.responses[200].parse(await res.json());
      
      // For this specific landing page requirement without a running backend logic for status:
      // We simulate the success response as requested in implementation notes "Status indicator: Running"
      return { status: "Running" }; 
    },
    // Refresh status every 30 seconds
    refetchInterval: 30000, 
  });
}
