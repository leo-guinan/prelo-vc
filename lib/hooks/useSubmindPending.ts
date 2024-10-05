'use client'
import { getSubmindPending } from '@/app/actions/interview';
import useSWR from 'swr';


export function useSubmindPending(userId: string) {
  const { data: submindPending, error, mutate } = useSWR(`/api/user/${userId}/submind-pending`, getSubmindPending);

  console.log("Submind pending", submindPending)

  return {
    submindPending: submindPending,
    isLoading: !error && !submindPending,
    isError: error,
    mutate,
  };
}