"use client";

import {
  FC,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useState
} from "react";

import clsx from "clsx";

import { Toast } from "./toast";
import { ToastContextType, ToastPositionType, ToastProps } from "./type";
import { positionClasses } from "./utils";

const ToastContext = createContext<ToastContextType>({
  add: () => {},
  remove: () => {},
  position: "topRight",
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: FC<{ children: ReactNode; lang: any }> = ({
  children,
  lang,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [position, setPosition] = useState<ToastPositionType>("topRight");

  const add = (toast: Omit<ToastProps, "id">) => {
    if (toast.position && toast.position !== position) {
      setPosition(toast.position);
    }

    setToasts((toasts) => [...toasts, { ...toast, id: Math.random() * 10000 }]);
  };

  const remove = (toastId: number, ref: RefObject<HTMLDivElement>) => {
    ref?.current?.classList.add("animate-toastOut");

    ref?.current?.addEventListener("animationend", () => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
    });
  };

  return (
    <div className="">
      <ToastContext.Provider value={{ add, remove, position }}>
        {children}
        <div
          className={clsx(
            positionClasses[position],
            "fixed w-screen max-w-xs z-[9999]"
          )}
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} lang={lang} />
          ))}
        </div>
      </ToastContext.Provider>
    </div>
  );
};
