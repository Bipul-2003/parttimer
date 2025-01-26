// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { checkThirdPartyCookies } from "@/lib/cookieCheck"

// export default function CookieBanner() {
//   const [showBanner, setShowBanner] = useState(false)

//   useEffect(() => {
//     const checkCookies = async () => {
//       const hasSeenBanner = localStorage.getItem("hasSeenCookieBanner")
//       if (!hasSeenBanner) {
//         const thirdPartyCookiesEnabled = await checkThirdPartyCookies()
//         setShowBanner(!thirdPartyCookiesEnabled)
//       }
//     }

//     checkCookies()
//   }, [])

//   const handleAccept = () => {
//     localStorage.setItem("hasSeenCookieBanner", "true")
//     setShowBanner(false)
//   }

//   if (!showBanner) return null

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
//       <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
//         <p className="text-center sm:text-left sm:mr-4 text-sm sm:text-base">
//           This site requires third-party cookies to function properly. Please enable them in your browser settings to
//           continue.
//         </p>
//         <Button
//           onClick={handleAccept}
//           variant="outline"
//           className="w-full sm:w-auto text-gray-800 border-white hover:bg-white"
//         >
//           I understand
//         </Button>
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CookieConsent = () => {
  const [consent, setConsent] = useState(false);

  // Function to check if cookie_consent exists
  const checkConsent = () => {
    return document.cookie
      .split("; ")
      .some((item) => item.trim().startsWith("cookie_consent="));
  };

  useEffect(() => {
    // Set consent state based on the cookie
    setConsent(checkConsent());
  }, [checkConsent]); // Added checkConsent to dependencies

  const handleAccept = () => {
    // Set the consent cookie and update state
    document.cookie =
      "cookie_consent=true; path=/; secure; sameSite=Strict; max-age=" +
      60 * 60 * 24 * 365; // 1 year
    setConsent(true);
  };

  if (consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-center sm:text-left">
          This site requires third-party cookies to function properly. Please
          enable them to continue.
        </p>
        <Button
          onClick={handleAccept}
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-gray-800 w-full sm:w-auto">
          Accept
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
