import AXIOS_CONFIG from "@/config/axiosConfig";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const login = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await AXIOS_CONFIG.post("auth/login/", {
      email: e.target.email.value,
      password: e.target.password.value,
    })
      .then((response) => {
        setIsLoading(false);
        setIsAuthenticated(true);
        navigate("/");
      })
      .catch((error) => {
        setIsAuthenticated(false);
        setIsLoading(false);
        if (error.response?.status === 401 || error.response?.status === 400) {
          toast("Wrong Credentials!", {
            description: "Invalid email or password.",
            icon: "❌",
          });
        } else {
          toast("Something went wrong !!!");
        }
      });
  };

  let verifyToken = async () => {
    try {
      const response = await AXIOS_CONFIG.get("auth/me");
      if (response.status === 200) {
        setProfile(response.data);
        setIsAuthenticated(true);
      } else {
        setProfile(null)
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
      verifyToken();
  }, []);
  

  let logout = async () => {
    //send a request to api/auth/logout
    await AXIOS_CONFIG.post("auth/logout/", null).then((response) => {
      if (response.status === 200) {
        setIsAuthenticated(false);
        setTimeout(() => {
          window.location.href = "/auth/login"; // Hard refresh ensures cookies are cleared
        }, 500); // Wait 500ms before redirecting
      }
    });
  };

    
  

  let contextData = {
    login: login,
    isLoading: isLoading,
    isAuthenticated: isAuthenticated,
    logout: logout,
    verifyToken : verifyToken,
    profile : profile
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
