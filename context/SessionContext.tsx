import React, { useState, useContext, useEffect, createContext } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

type SessionContextType = {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  //1. Check if there's already a session
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
  
    loadSession();
  
    //2. Subscribe to futre auth evens (login, logout, refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    //3. Cleanup: unsubscribe when componet unmounts
    return () => subscription?.subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("SessionContext was used outside of the Session Provider");
  }
  // console.log(context);
  return context;
};

export { SessionProvider, useSession };
