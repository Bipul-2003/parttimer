import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Car,
  Leaf,
  Briefcase,
  ArrowRight,
  Clock,
  DollarSign,
  Shield,
  Award,
  CheckCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { t } = useTranslation("home");
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mx-4">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
          {t("hero.title")}
        </h1>
        <p className="text-xl text-gray-600 mb-8">{t("hero.subtitle")}</p>
        <Link to="/services" className="text-blue-600 hover:underline">
          <Button size="lg" className="animate-bounce">
            {t("hero.cta")} <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>
      </section>

      {/* Services Showcase */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("services.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <Car size={48} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("services.carWash.title")}
              </h3>
              <p className="text-gray-600">
                {t("services.carWash.description")}
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <Leaf size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("services.gardening.title")}
              </h3>
              <p className="text-gray-600">
                {t("services.gardening.description")}
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <Briefcase size={48} className="text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("services.other.title")}
              </h3>
              <p className="text-gray-600">{t("services.other.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("howItWorks.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("howItWorks.step1.title")}
              </h3>
              <p className="text-gray-600">
                {t("howItWorks.step1.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("howItWorks.step2.title")}
              </h3>
              <p className="text-gray-600">
                {t("howItWorks.step2.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("howItWorks.step3.title")}
              </h3>
              <p className="text-gray-600">
                {t("howItWorks.step3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Quality Guarantee */}
      <section id="quality" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("qualityGuarantee.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <Star
                size={24}
                className="text-yellow-500 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("qualityGuarantee.satisfaction.title")}
                </h3>
                <p className="text-gray-600">
                  {t("qualityGuarantee.satisfaction.description")}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <CheckCircle
                size={24}
                className="text-green-500 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("qualityGuarantee.qualityAssurance.title")}
                </h3>
                <p className="text-gray-600">
                  {t("qualityGuarantee.qualityAssurance.description")}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <Award
                size={24}
                className="text-blue-500 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("qualityGuarantee.topRated.title")}
                </h3>
                <p className="text-gray-600">
                  {t("qualityGuarantee.topRated.description")}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <Shield
                size={24}
                className="text-purple-500 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("qualityGuarantee.secureTransactions.title")}
                </h3>
                <p className="text-gray-600">
                  {t("qualityGuarantee.secureTransactions.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield size={48} className="text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">
                {t("features.verifiedPersonnel.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("features.verifiedPersonnel.description")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Clock size={48} className="text-green-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">
                {t("features.flexibleScheduling.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("features.flexibleScheduling.description")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <DollarSign size={48} className="text-purple-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">
                {t("features.transparentPricing.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("features.transparentPricing.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
