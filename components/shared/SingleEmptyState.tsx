import { LayoutProps } from "@/models/shared";
import { ReactNode } from "react";

export interface SingleEmptyStateProps extends LayoutProps {
  emptyState: ReactNode;
  data: number | undefined;
}

export const SingleEmptyState = ({
  children,
  emptyState,
  data,
}: SingleEmptyStateProps) => {
  if (data) return <>{children}</>;

  return <>{emptyState}</>; // Wrap it in a fragment to ensure it's always valid JSX
};
