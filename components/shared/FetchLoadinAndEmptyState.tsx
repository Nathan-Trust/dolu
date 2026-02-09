import { FetchingLoading, FetchingLoadingProps } from "./FetchLoading";
import { SingleEmptyState, SingleEmptyStateProps } from "./SingleEmptyState";

interface Props extends SingleEmptyStateProps, FetchingLoadingProps {}

export const FetchLoadingAndEmptyState = ({
  children,
  emptyState,
  data,
  isLoading,
  numberOfSkeleton,
  skeleton,
  contentClassName,
}: Props) => {
  return (
    <FetchingLoading
      isLoading={isLoading}
      numberOfSkeleton={numberOfSkeleton}
      skeleton={skeleton}
      contentClassName={contentClassName}
    >
      <SingleEmptyState emptyState={emptyState} data={data}>
        {children}
      </SingleEmptyState>
    </FetchingLoading>
  );
};
