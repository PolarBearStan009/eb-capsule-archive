import { getSupabase } from "./supabaseClient";

export async function signIn(email: string, password: string) {
  return getSupabase().auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string) {
  return getSupabase().auth.signUp({ email, password });
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

export async function getUser() {
  const { data: { user } } = await getSupabase().auth.getUser();
  return user;
}
