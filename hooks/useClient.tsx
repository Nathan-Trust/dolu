"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrCodes, QueryKeys } from "@/models/query";
import { ClientService } from "@/services/clients";

export const useClient = (id?: string) => {
  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey: [QueryKeys.Get_Client, id],
    queryFn: () => ClientService.getClient(id as string),
    enabled: !!id,
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
