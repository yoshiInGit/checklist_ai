import { useState } from "react";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom";



interface SignUpResult {
  user:    User | null;
  error:   string | null;
  loading: boolean;
  signUp:  (email: string, password: string) => void;
}

export const useSignUp = (): SignUpResult => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("User signed up:", userCredential.user);

        navigate("/");

    } catch (err : unknown) {
        if (err instanceof Error) {
            setError(err.message);
            console.error("Error signing up:", err.message);
          } else {
            setError("An unknown error occurred");
            console.error("Unknown error signing up:", err);
          }
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, signUp };
};


interface LoginResult {
    user:    User | null;
    error:   string | null;
    loading: boolean;
    login:  (email: string, password: string) => void;
}

export const useLogin = (): LoginResult => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
  
    const login = async (email: string, password: string) => {
      setLoading(true);
      setError(null);
  
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        console.log("User Login:", userCredential.user);

        navigate("/");

      } catch (err : unknown) {
          if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred");
            }
      } finally {
        setLoading(false);
      }
    };
  
    return { user, error, loading, login };
  };


  interface LogoutResult {
    user:    User | null;
    error:   string | null;
    loading: boolean;
    logout:  () => void;
  }

  export const useLogout = (): LogoutResult => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
  
    const logout = async () => {
      setLoading(true);
      setError(null);
  
      try {
        await signOut(auth);
        setUser(null);
        console.log("User signed out:",);
  
          navigate("/auth");
  
      } catch (err : unknown) {
          if (err instanceof Error) {
              setError(err.message);
              console.error("Error signout:", err.message);
            } else {
              setError("An unknown error occurred");
              console.error("Unknown error signing up:", err);
            }
      } finally {
        setLoading(false);
      }
    };
  
    return { user, error, loading, logout };
  };
  