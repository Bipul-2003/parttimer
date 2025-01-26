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

import { useState } from 'react';

const CookieBanner = () => {
    const [consent, setConsent] = useState(false);

    const handleAccept = () => {
        setConsent(true);
        document.cookie = "cookie_consent=true; path=/; secure; sameSite=Strict; max-age=" + 60 * 60 * 24 * 365;
    };

    return (
        !consent && (
            <div className="cookie-banner">
                <p>This site uses essential third-party cookies to function properly. By accepting, you agree to their use.</p>
                <button onClick={handleAccept}>Accept</button>
            </div>
        )
    );
};

export default CookieBanner;
