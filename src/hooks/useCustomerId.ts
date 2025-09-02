import { useGetCustomerByUserIdQuery } from "@/features/profile/customerApi";
import useAuth from "./useAuth";

export default function useCustomerId() {
  const auth = useAuth();
  const userId = auth.user?.id;

  const { data: profile, isLoading, error } = useGetCustomerByUserIdQuery(userId!, {
    skip: !userId,
  });

  return {
    customerId: profile?.profileId ?? undefined,
    isLoading,
    error
  }
}
