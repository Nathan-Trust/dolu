"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrCodes, QueryKeys } from "@/models/query";
import { PeopleService } from "@/services/people";

export const usePerson = (id?: string) => {
  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey: [QueryKeys.Get_Person, id],
    queryFn: () => PeopleService.getPerson(id as string),
    enabled: !!id,
    meta: {
      errCode: QueryErrCodes.People,
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
