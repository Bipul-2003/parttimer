import { useState, useCallback, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CreditCard, Gift, ShoppingCart, Users, Copy, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import config from "@/config/config";

const stripePromise = loadStripe(
  "pk_test_51QRCSY2KrknwI1uDyRSnqfdAtXtXA4kSYLluzjV0WJ1Qqp3DHoh77RqBfE0sYFJ5RpJaVRhXuUbN2ejSyC5Kv6t200BA6PxhXr"
);

export default function PointsManagement() {
  const [referralLink, setReferralLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { user, fetchUser } = useAuth();

  const gemCount = user?.user_type === "USER" ? user.points : 0;

  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const amount = params.get("amount");

    if (status === "success" && amount) {
      toast({
        title: "Purchase Successful",
        description: `${amount} gems have been added to your account!`,
      });
      if (user?.user_type === "USER") {
        fetchUser();
      }
    } else if (status === "error") {
      toast({
        title: "Purchase Failed",
        description:
          "There was an error processing your payment. Please try again.",
      });
    }
  }, [location, toast, user]);

  const generateReferralLink = useCallback(() => {
    if (user?.user_type === "USER") {
      const uniqueCode = Math.random().toString(36).substring(2, 8);
      const newLink = `https://yourdomain.com/refer/${uniqueCode}`;
      setReferralLink(newLink);
    } else {
      toast({
        title: "Error",
        description: "Only regular users can generate referral links.",
      });
    }
  }, [user, toast]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [referralLink, toast]);

  if (user?.user_type !== "USER") {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Only regular users can access the Points Management system.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-purple-50 to-indigo-100 min-h-screen">
      <Card className="w-full max-w-8xl mx-auto shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white pb-20 sm:pb-16 relative">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-center">
            Gem Vault
          </CardTitle>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-white text-indigo-600 rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg flex items-center justify-center space-x-3 sm:space-x-4">
              <span className="text-4xl sm:text-4xl" aria-hidden="true">
                ⚜️
              </span>
              <div className="text-center">
                <span className="text-3xl sm:text-3xl font-bold block">
                  {gemCount}
                </span>
                <span className="text-base sm:text-xl sr-only">Gems</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-16 sm:pt-16">
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-muted h-14">
              <TabsTrigger
                value="add"
                className="text-base sm:text-lg data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-200 flex items-center justify-center gap-2 h-full">
                <Sparkles className="h-5 w-5" />
                Add Gems
              </TabsTrigger>
              <TabsTrigger
                value="use"
                className="text-base sm:text-lg data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-200 flex items-center justify-center gap-2 h-full">
                <ShoppingCart className="h-5 w-5" />
                Use Gems
              </TabsTrigger>
              <TabsTrigger
                value="refer"
                className="text-base sm:text-lg data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-200 flex items-center justify-center gap-2 h-full">
                <Users className="h-5 w-5" />
                Refer & Earn
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <GemPackage amount={500} price={2.99} discount={0} />
                <GemPackage amount={1000} price={5.99} discount={0} />
                <GemPackage amount={2000} price={9.99} discount={17} />
                <GemPackage amount={5000} price={24.99} discount={20} />
                <GemPackage amount={10000} price={49.99} discount={25} />
                <GemPackage
                  amount={20000}
                  price={99.99}
                  discount={30}
                  special={true}
                />
              </div>
            </TabsContent>
            <TabsContent value="use">
              <Card className="mt-4 bg-gradient-to-r from-emerald-100 to-teal-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl sm:text-2xl text-emerald-800">
                    <Gift className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Redeem Gems for Subscription
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    Unlock premium features with your hard-earned gems!
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    asChild>
                    <Link to="/subscriptions">
                      View All Subscription Options
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="refer">
              <Card className="mt-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl sm:text-2xl text-blue-800">
                    <Users className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Refer Friends, Earn Gems!
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Share the joy of gems with your friends and earn rewards!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-700">
                    For every new friend you refer:
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-center">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <p className="text-2xl font-bold text-blue-600">1000</p>
                      <p className="text-sm text-blue-700">Gems for you</p>
                    </div>
                    <div className="text-2xl text-blue-600">+</div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <p className="text-2xl font-bold text-blue-600">1000</p>
                      <p className="text-sm text-blue-700">
                        Gems for your friend
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={generateReferralLink}
                      className="w-full bg-blue-600 hover:bg-blue-700">
                      Generate Referral Link
                    </Button>
                    {referralLink && (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={referralLink}
                          readOnly
                          className="flex-grow bg-muted"
                        />
                        <Button
                          onClick={copyToClipboard}
                          className="bg-blue-600 hover:bg-blue-700">
                          {isCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-blue-50 rounded-b-lg">
                  <p className="text-sm text-center w-full text-blue-600">
                    Start referring now and watch your gem collection grow!
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <p className="text-sm text-center w-full text-gray-600">
            <span className="font-semibold">Coming Soon:</span> Marketplace -
            Exchange your gems for exclusive items and perks!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

interface GemPackageProps {
  amount: number;
  price: number;
  discount: number;
  special?: boolean;
}

function GemPackage({
  amount,
  price,
  discount,
  special = false,
}: GemPackageProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePurchase = async () => {
    if (user?.user_type !== "USER") {
      toast({
        title: "Error",
        description: "Only regular users can purchase gems.",
      });
      return;
    }

    try {
      const response = await fetch(
        config.apiURI+"/stripe/product/v1/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            gems: amount,
            price: Math.round(price * 100),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const session = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (error) {
          console.error("Stripe Redirect Error:", error);
          toast({
            title: "Error",
            description:
              "There was a problem initiating the payment. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          "There was a problem processing your request. Please try again.",
      });
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        special
          ? "bg-gradient-to-r from-yellow-100 to-amber-100 shadow-amber-200/50"
          : "hover:shadow-lg"
      }`}>
      {discount > 0 && (
        <Badge className="absolute top-2 right-2 bg-red-500">
          {discount}% OFF
        </Badge>
      )}
      {special && (
        <Badge className="absolute top-2 left-2 bg-yellow-500">
          Best Value
        </Badge>
      )}
      <CardHeader className="p-6">
        <CardTitle
          className={`text-xl sm:text-2xl ${
            special ? "text-amber-800" : "text-gray-800"
          }`}>
          {amount.toLocaleString()} Gems
        </CardTitle>
        <CardDescription
          className={`text-base sm:text-lg font-semibold ${
            special ? "text-amber-700" : "text-gray-600"
          }`}>
          ${price.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handlePurchase}
          className={`w-full ${
            special ? "bg-amber-500 hover:bg-amber-600" : ""
          }`}>
          <CreditCard className="mr-2 h-4 w-4" />
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}

