// import axios, { AxiosError } from "axios";

// const API_URL = "/oauth2/authorize";

// export const signInwithGoogle = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/google`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Google OAuth failed");
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };

import axios from "axios";

const API_URL = "http://localhost:8080/oauth2/authorize/google"; // Update this to the exact endpoint

export const signInwithGoogle = async () => {
  try {
    // Redirect to the backend OAuth2 authorization endpoint
    window.location.href = API_URL;

    // This will redirect the user to Google's OAuth consent screen
    // The backend will handle the actual OAuth flow
    return new Promise(() => {}); // This prevents the function from resolving
  } catch (error) {
    throw new Error("Google OAuth initiation failed");
  }
};
