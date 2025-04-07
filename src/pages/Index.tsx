
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLayout from "../components/PageLayout";
import BusinessCard from "../components/BusinessCard";
import { useBusiness } from "../context/BusinessContext";
import { Search, Building2, TrendingUp, Users, Briefcase } from "lucide-react";

const Index = () => {
  const { businesses } = useBusiness();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get top 3 businesses by CAGR for showcase
  const topBusinesses = [...businesses]
    .sort((a, b) => b.financialStats.cagr - a.financialStats.cagr)
    .slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/businesses?q=${encodeURIComponent(searchQuery)}`);
  };
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-business-light to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Connect with Top-Performing Businesses
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover verified businesses, explore financial insights, and build valuable connections all in one place.
            </p>
            
            <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto mb-8">
              <Input
                type="text"
                placeholder="Search businesses by name, industry..."
                className="flex-grow rounded-r-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none bg-business-primary hover:bg-business-dark">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate("/businesses")}
                className="bg-business-primary hover:bg-business-dark"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Browse Businesses
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/register")}
                className="border-business-primary text-business-primary hover:bg-business-light"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BizInsight?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most comprehensive business directory platform with financial insights and networking capabilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center p-3 bg-business-light rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-business-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Analytics</h3>
              <p className="text-gray-600">
                Access detailed financial metrics including CAGR, profit margins, and more.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center p-3 bg-business-light rounded-full mb-4">
                <Briefcase className="h-6 w-6 text-business-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Businesses</h3>
              <p className="text-gray-600">
                All businesses are verified to ensure quality and legitimacy.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center p-3 bg-business-light rounded-full mb-4">
                <Users className="h-6 w-6 text-business-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Networking</h3>
              <p className="text-gray-600">
                Connect directly with businesses and other professionals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Businesses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Performing Businesses
            </h2>
            <Link
              to="/businesses"
              className="text-business-primary hover:text-business-dark font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {topBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-business-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Showcase Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform to increase visibility, connect with potential clients, and grow your business network.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/register")}
              className="bg-white text-business-primary hover:bg-gray-100"
            >
              Sign Up Now
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/businesses")}
              className="border-white text-white hover:bg-business-dark"
            >
              Explore Businesses
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
