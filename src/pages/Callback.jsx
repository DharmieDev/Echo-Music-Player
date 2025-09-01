import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../auth/pkceUtils";

export default function Callback() {
  const navigate = useNavigate();
  const handledRef = useRef(false); // prevent double-fetch in StrictMode

  useEffect(() => {
    const fetchToken = async () => {
      if (handledRef.current) return; // already handled once
      handledRef.current = true;

      // Get authorization code from query params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      if (error) {
        console.error("Spotify returned an error:", error);
        return;
      }

      if (!code) {
        console.error("No authorization code found in callback URL");
        return;
      }

      try {
        // Exchange code for access + refresh tokens
        const tokenData = await getAccessToken(code);

        if (tokenData?.access_token) {
          localStorage.setItem("access_token", tokenData.access_token);

          if (tokenData.refresh_token) {
            localStorage.setItem("refresh_token", tokenData.refresh_token);
          }

          // Redirect to home after successful login
          navigate("/", { replace: true });
        } else {
          console.error("No access token received:", tokenData);
        }
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <p className="text-lg">Logging you in...</p>
    </div>
  );
}

