import { toast } from "vue-sonner";

interface ToastOptions {
  type: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
}

export const useToast = ({
  type,
  title,
  description,
}: ToastOptions) => {
  const toastOptions = {
    description,
    class: `toast-${type}`,
    duration: type === "error" ? 5000 : 4000,
    style: {
      "--toast-icon-color": getIconColor(type),
    } as Record<string, string>,
  };

  toast[type](title, toastOptions);
};

function getIconColor(type: "success" | "info" | "warning" | "error"): string {
  const colors = {
    success: "hsl(var(--success))",
    error: "hsl(var(--destructive))",
    warning: "hsl(var(--warning))",
    info: "hsl(var(--primary))",
  };
  return colors[type];
}