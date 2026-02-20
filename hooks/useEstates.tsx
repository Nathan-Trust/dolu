"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrCodes, QueryKeys } from "@/models/query";
import { EstateService } from "@/services/estates";

export const useEstates = (params?: Record<string, any>) => {
  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey: [QueryKeys.Get_Estates, params ?? {}],
    queryFn: () => EstateService.getAllEstates(params),
    meta: {
      errCode: QueryErrCodes.Estates,
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    isLoading,
    isFetching,
    data: data?.data ?? null,
    refetch,
    error,
  };
};
