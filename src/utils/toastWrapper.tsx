import ENV from '@/config/env.variables';
import type { ReactNode } from 'react';
import { toast, type ToastT } from 'sonner';

type titleT = (() => React.ReactNode) | React.ReactNode;
type ExternalToast = Omit<ToastT, 'id' | 'type' | 'title' | 'jsx' | 'delete' | 'promise'> & {
  id?: number | string;
  toasterId?: string;
};

const toastWrapper = {
  error: (message: titleT | React.ReactNode, data?: ExternalToast): string | number | undefined => {
    if (ENV.VITE_NODE_ENV in ['development', 'staging']) return;

    const defaultMessage = 'An unexpected error occurred.';
    const defaultOptions: ExternalToast = {
      classNames: {
        toast: 'cursor-default',
        icon: 'text-red-600',
      },
    };

    return toast.error(message || defaultMessage, {
      ...defaultOptions,
      ...data,
    });
  },

  critical: (message: string, data?: ExternalToast): string | number | undefined => {
    if (!['dev', 'stage', 'test'].includes(ENV.VITE_NODE_ENV)) return;

    const defaultMessage = 'A critical error occurred - ';
    const completeMessage = defaultMessage + message;
    const defaultOptions: ExternalToast = {
      classNames: {
        toast: 'cursor-default',
        icon: 'text-red-800',
      },
    };

    return toast.error(completeMessage, {
      ...defaultOptions,
      ...data,
    });
  },

  dev: {
    Critical: (message: string, data?: ExternalToast): string | number | undefined => {
      if (!['dev', 'stage', 'test'].includes(ENV.VITE_NODE_ENV)) return;
      const defaultMessage = 'Crit Dev error - ';
      const completeMessage = defaultMessage + message;
      const a: ReactNode = <span className=" text-pink-700">{completeMessage}</span>;

      const defaultOptions: ExternalToast = {
        description: a,
        style: {
          '--normal-bg': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
          '--normal-text': 'var(--color-white)',
          '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
        } as React.CSSProperties,
      };

      return toast.error(completeMessage, {
        ...defaultOptions,
        ...data,
        ...{
          description: a,
        },
      });
    },

    error: (message: titleT | React.ReactNode, data?: ExternalToast): string | number | undefined => {
      if (ENV.VITE_NODE_ENV in ['development', 'staging']) return;

      const defaultMessage = 'An unexpected error occurred.';
      const defaultOptions: ExternalToast = {
        classNames: {
          toast: 'cursor-default',
          icon: 'text-red-600',
        },
      };

      return toast.error(message || defaultMessage, {
        ...defaultOptions,
        ...data,
      });
    },
  },
};

export default toastWrapper;
