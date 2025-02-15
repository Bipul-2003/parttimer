import { useState, useEffect, startTransition } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "./user-nav";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FlagIcon from "./FlagIcon";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation(["navbar", "common"]);
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const CurrencyBadge = () => {
    if (user?.user_type === "USER") {
      return (
        <Link to="/points">
          <Badge variant="secondary" className="ml-2">
            <span className="mr-1">⚜️</span>
            {user.points}
          </Badge>
        </Link>
      );
    }
    return null;
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const languageOptions = [
    { value: "en", label: t("english", { ns: "common" }) },
    { value: "es", label: t("spanish", { ns: "common" }) },
  ];

  const navItems = [
    { to: "/services", label: t("services", { ns: "navbar" }) },
    { to: "/how-it-works", label: t("howItWorks", { ns: "navbar" }) },
    { to: "/post-request", label: t("postRequest", { ns: "navbar" }) },
    { to: "/book-laborers", label: t("bookLaborers", { ns: "navbar" }) },
    { to: "/advertisement", label: t("Advertisement", { ns: "navbar" }) },
  ];

  const renderAuthButton = () => {
    if (isAuthenticated) {
      return (
        <>
          <CurrencyBadge />
          <UserNav />
        </>
      );
    }

    return (
      <Button
        size="sm"
        variant="default"
        className="h-9"
        onClick={() => navigate("/login")}>
        {t("signIn", { ns: "navbar" })}
      </Button>
    );
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            startTransition(() => {
              navigate("/");
            });
          }}
          className="text-2xl font-bold text-blue-600">
          PartTimer
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-600 hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Select onValueChange={handleLanguageChange} value={language}>
            <SelectTrigger className="w-[116px] h-9">
              <SelectValue
                placeholder={t("languageSelector", { ns: "common" })}>
                <div className="flex items-center">
                  <FlagIcon country={language} className="mr-2" />
                  {languageOptions.find((opt) => opt.value === language)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <FlagIcon country={option.value} className="mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderAuthButton()}
        </div>
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-2 flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={toggleMenu}>
              {item.label}
            </Link>
          ))}
          <Select onValueChange={handleLanguageChange} value={language}>
            <SelectTrigger className="w-full h-9">
              <SelectValue
                placeholder={t("languageSelector", { ns: "common" })}>
                <div className="flex items-center">
                  <FlagIcon country={language} className="mr-2" />
                  {languageOptions.find((opt) => opt.value === language)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <FlagIcon country={option.value} className="mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            {renderAuthButton()}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
