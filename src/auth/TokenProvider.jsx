// TokenProvider.jsx
import { createContext, useState, useEffect, useContext } from "react";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  saveCodeVerifier,
  getAccessToken,
} from "../auth/pkceUtils";


export default function TokenProvider({ children }) {
    const [token, setToken] = useState(null);
    
    // Login → generate code_verifier + redirect
    const login = async () => {
        const verifier = generateCodeVerifier();
        saveCodeVerifier(verifier);
        
        const challenge = await generateCodeChallenge(verifier);
        
        const params = new URLSearchParams({
            response_type: "code",
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
            scope: import.meta.env.VITE_SPOTIFY_SCOPES, // 👈 must be a space-separated string
            code_challenge_method: "S256",
            code_challenge: challenge,
        });
        
        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    };
    
    // Handle callback → exchange code for token
    const handleCallback = async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        
        if (code) {
            try {
                const tokenData = await getAccessToken(code);
                
                setToken(tokenData.access_token);
                localStorage.setItem("spotify_token", tokenData.access_token);
                
                // optional: store refresh token if provided
                if (tokenData.refresh_token) {
                    localStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
                }
                
                // Clean the URL (removes ?code=... from browser)
                window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("Failed to get token:", err);
      }
    }
  };

  useEffect(() => {
      const stored = localStorage.getItem("spotify_token");
      
      if (stored) {
      setToken(stored);
    } else {
      handleCallback();
    }
  }, []);
  
  return (
      <TokenContext.Provider value={{ token, login }}>
      {children}
    </TokenContext.Provider>
  );
}

// ✅ Custom hook for easy use in components
export function useSpotifyAuth() {
  return useContext(TokenContext);
}

export const TokenContext = createContext();

