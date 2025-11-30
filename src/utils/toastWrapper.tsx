import ENV from "@/config/env.variables";
import { toast, type ToastT } from "sonner";


type titleT = (() => React.ReactNode) | React.ReactNode;
type ExternalToast = Omit<ToastT, 'id' | 'type' | 'title' | 'jsx' | 'delete' | 'promise'> & {
    id?: number | string;
    toasterId?: string;
};

const toastWrapper = {


    error: (message: titleT | React.ReactNode, data?: ExternalToast): string | number | undefined => {

        if (ENV.VITE_NODE_ENV in ['development', 'staging']) return
        
        const defaultMessage = "An unexpected error occurred.";
        const defaultOptions: ExternalToast = {
            classNames: {
                toast: "cursor-default",
                icon: "text-red-600",
            }
        }

        return toast.error(
            message || defaultMessage,
            {
                ...defaultOptions,
                ...data,
            }
        );
    }
}


export default toastWrapper;