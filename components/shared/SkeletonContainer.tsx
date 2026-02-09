import { Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LayoutProps } from "@/models/shared";

export interface SkeletonProps extends LayoutProps {
  numberOfSkeleton: number;
  isLoading: boolean;
  skeleton: ReactNode | ((isLast: boolean) => ReactNode);
  contentClassName?: string;
}

export const SkeletonContainer = ({
  isLoading,
  numberOfSkeleton,
  children,
  skeleton,
  contentClassName,
}: SkeletonProps) => {
  if (!isLoading) return <>{children}</>;

  const renderSkeletons = Array.from(
    { length: numberOfSkeleton },
    (_, i) => i + 1,
  ).map((item, i, arr) => {
    const isLast = i === arr.length - 1;
    return (
      <Fragment key={item}>
        {typeof skeleton === "function" ? skeleton(isLast) : skeleton}
      </Fragment>
    );
  });

  return (
    <div
      className={cn(
        "grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full items-start",
        contentClassName,
      )}
    >
      {renderSkeletons}
    </div>
  );
};
