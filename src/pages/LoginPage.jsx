import { useContext } from "react";
import { TokenContext } from "../auth/TokenProvider";

export default function LoginPage() {
  const { login } = useContext(TokenContext);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Echo</h1>
      <p className="mb-4 text-lg">Sign in with your Spotify account</p>
      <button
        onClick={login}
        className="bg-green-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-600 transition"
      >
        Login with Spotify
      </button>
    </div>
  );
}

