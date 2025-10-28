// hooks/useSupabase.ts
import { useAuth } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabase/supabase";
import { useMemo } from "react";

export function useSupabase() {
  const { getToken } = useAuth();

  // ✅ Memoize only the function that creates the client
  const supabase = useMemo(() => {
    return createClerkSupabaseClient(() => getToken({ template: "supabase" }));
  }, []); // remove getToken from dependencies

  return supabase;
}
