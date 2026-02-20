"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrCodes, QueryKeys } from "@/models/query";
import { PropertyService } from "@/services/properties";

export const useProperties = (params?: Record<string, any>) => {
  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey: [QueryKeys.Get_Properties, params ?? {}],
    queryFn: () => PropertyService.getAllProperties(params),
    meta: {
      errCode: QueryErrCodes.Properties,
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
