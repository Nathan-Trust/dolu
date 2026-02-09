import React from "react";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useGoogleSignIn } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
// import { errorToast } from "@/utils/toast";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

// Fetch user profile after getting access token from Google
// const fetchUserProfile = (accessToken: string) => {
//   return axios
//     .get("https://www.googleapis.com/oauth2/v3/userinfo", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then((response) => response.data);
// };

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = () => {
  //   const navigate = useNavigate();
  //   const googleSignIn = useGoogleSignIn();

  //   const login = useGoogleLogin({
  //     onSuccess: async (response) => {
  //       if (response?.access_token) {
  //         try {
  //           const userProfile = await fetchUserProfile(response.access_token);
  //           const { email } = userProfile;

  //           // Await the mutation to ensure it completes before navigation
  //           await googleSignIn.mutateAsync({ email });

  //           if (onSuccess) onSuccess();

  //           // Navigate to the dashboard after the mutation is successful
  //           navigate(Drowsy_Guard_Routes.dashboard);
  //         } catch (error) {
  //           errorToast({
  //             title: "Google Sign-In Error",
  //             message:
  //               (error as Error).message ||
  //               "An error occurred during Google Sign-In.",
  //           });
  //         }
  //       } else {
  //         errorToast({
  //           title: "Google Sign-In Error",
  //           message: "No access token received from Google.",
  //         });
  //       }
  //     },
  //     onError: (error) => {
  //       errorToast({
  //         title: "Google Sign-In Error",
  //         message:
  //           (error as Error).message ||
  //           "An error occurred during Google Sign-In.",
  //       });
  //     },
  //   });

  return (
    <Button
      type="button"
      className="w-full border mt-6 flex items-center justify-center gap-2 bg-white hover:bg-white"
      //   onClick={() => login()}
    >
      <img src="/Google.svg" alt="Google icon" className="h-6" />
      <p className="text-black">Sign in with Google</p>
    </Button>
  );
};

export default GoogleSignInButton;
