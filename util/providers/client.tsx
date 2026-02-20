/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LayoutProps } from "@/models/shared";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryCacheOnError, queryErrorMessage } from "../query";
import { Toaster } from "sonner";

export default function ProvidersClient({ children }: Readonly<LayoutProps>) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: "always",
        refetchOnReconnect: "always",
      },
    },
    queryCache: new QueryCache({
      onError: (err: any, query: any) => {
        const message = queryErrorMessage(err);
        console.log("message ==>", message);
        queryCacheOnError({ message, query });
      },
    }),
  });

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
      <Toaster
        position="top-right"
        theme="light"
        // theme={theme === "dark" ? "dark" : "light"}
        closeButton
        toastOptions={{
          // className: "custom-toast",
          // descriptionClassName: "custom-toast-description",
          classNames: {
            error: "error-custom-toast",
            success: "success-custom-toast",
            closeButton: "close-button",
          },
        }}
      />{" "}
    </QueryClientProvider>
  );
}
