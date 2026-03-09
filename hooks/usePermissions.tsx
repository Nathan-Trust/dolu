"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/models/query";
import { SettingsService } from "@/services/settings";

export const usePermissions = () => {
  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey: [QueryKeys.Get_Permission_List],
    queryFn: () => SettingsService.getPermissions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    isFetching,
    data: data?.data ?? null,
    refetch,
    error,
  };
};
