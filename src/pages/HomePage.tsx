import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
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
// import Link from 'next/link'

export default function HomePage() {
  // const [serviceRequest, setServiceRequest] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mx-4">
      {/* Header */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
          Find Skilled Part-Time Workers for Any Task
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with reliable personnel for car wash, gardening, and more!
        </p>
        <Link to="/services" className="text-blue-600 hover:underline">
          <Button size="lg" className="animate-bounce">
            Get Started <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>
      </section>

      {/* Services Showcase */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <Car size={48} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Car Wash</h3>
              <p className="text-gray-600">
                Car cleaning services at your doorstep.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <Leaf size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gardening</h3>
              <p className="text-gray-600">
                Gardeners to maintain and beautify your outdoor spaces.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <Briefcase size={48} className="text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Other Services</h3>
              <p className="text-gray-600">
                From home repairs to pet sitting, find help for any task.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4  ">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post a Request</h3>
              <p className="text-gray-600">
                Describe your task and set your budget.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Offers</h3>
              <p className="text-gray-600">Receive responses from Hubs.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get It Done</h3>
              <p className="text-gray-600">
                Choose an offer and get your task completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Quality Guarantee */}
      <section id="quality" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Quality Guarantee
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <Star
                size={24}
                className="text-yellow-500 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Satisfaction Guaranteed
                </h3>
                <p className="text-gray-600">
                  If you're not happy with the service, we'll make it right or
                  refund your money.
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
                  Quality Assurance
                </h3>
                <p className="text-gray-600">
                  Our team regularly checks the quality of work to ensure high
                  standards.
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
                  Top-Rated Personnel
                </h3>
                <p className="text-gray-600">
                  We only work with the best-rated service providers in each
                  category.
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
                  Secure Transactions
                </h3>
                <p className="text-gray-600">
                  Your payments are secure and only released when you're
                  satisfied with the work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Unique Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield size={48} className="text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">
                Verified Personnel
              </h3>
              <p className="text-gray-600 text-center">
                All our service providers undergo thorough background checks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Clock size={48} className="text-green-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600 text-center">
                Book services at your convenience, even on short notice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <DollarSign size={48} className="text-purple-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">
                Transparent Pricing
              </h3>
              <p className="text-gray-600 text-center">
                No hidden fees. See exact costs before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Post a Service Request */}
      {/* <section id="post-request" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Post a Service Request</h2>
          <form onSubmit={handleServiceRequest} className="max-w-lg mx-auto">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Service Title"
                required
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <Textarea
                placeholder="Describe the service you need..."
                required
                className="w-full h-32"
                value={serviceRequest}
                onChange={(e) => setServiceRequest(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </div>
      </section> */}

     
    </div>
  );
}
