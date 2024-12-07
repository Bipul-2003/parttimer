import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t("title")}</h3>
            <p className="text-gray-400">{t("description")}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t("quickLinks.title")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t("quickLinks.aboutUs")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t("quickLinks.faq")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t("quickLinks.termsOfService")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t("quickLinks.privacyPolicy")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t("contactUs.title")}</h3>
            <p className="text-gray-400">{t("contactUs.email")}</p>
            <p className="text-gray-400">{t("contactUs.phone")}</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy;{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
