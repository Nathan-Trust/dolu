"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrCodes, QueryKeys } from "@/models/query";
import { ClientService } from "@/services/clients";

export const useClients = (params?: Record<string, any>) => {
  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey: [QueryKeys.Get_Clients, params ?? {}],
    queryFn: () => ClientService.getAllClients(params),
    meta: {
      errCode: QueryErrCodes.Clients,
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
