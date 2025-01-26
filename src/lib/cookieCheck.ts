export async function checkThirdPartyCookies(): Promise<boolean> {
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      document.body.appendChild(iframe)
  
      iframe.onload = () => {
        try {
          const iframeWindow = iframe.contentWindow
          if (iframeWindow && iframeWindow.document) {
            iframeWindow.document.cookie = "testThirdPartyCookie=1"
            const isCookieSet = iframeWindow.document.cookie.indexOf("testThirdPartyCookie=") !== -1
            resolve(isCookieSet)
          } else {
            resolve(false)
          }
        } catch (e) {
          resolve(false)
        } finally {
          document.body.removeChild(iframe)
        }
      }
  
      iframe.src = "about:blank"
    })
  }
  
  