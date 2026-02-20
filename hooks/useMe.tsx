"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/models/query";
import { AuthService } from "@/services/auth";

export const useMe = () => {
  const { isLoading, data, error, refetch, isFetching } = useQuery({
    queryKey: [QueryKeys.Get_User],
    queryFn: () => AuthService.me(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    isFetching,
    data: data?.data ?? null,
    error,
    refetch,
  };
};

export default useMe;
