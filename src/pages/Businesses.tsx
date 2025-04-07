
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageLayout from "../components/PageLayout";
import BusinessCard from "../components/BusinessCard";
import { useBusiness } from "../context/BusinessContext";
import { Business, BusinessType } from "../types";
import { Search, Filter, Building } from "lucide-react";

const Businesses = () => {
  const { businesses } = useBusiness();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [industryFilter, setIndustryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  // Get unique industries for filter
  const uniqueIndustries = Array.from(
    new Set(businesses.map((b) => b.industry))
  );
  
  // Apply filters and sorting
  useEffect(() => {
    let results = [...businesses];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (business) =>
          business.name.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.industry.toLowerCase().includes(query)
      );
    }
    
    // Apply industry filter
    if (industryFilter) {
      results = results.filter(
        (business) => business.industry === industryFilter
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      results = results.filter(
        (business) => business.type === typeFilter
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "revenue":
          const aRevenue = a.financialStats.revenue.slice(-1)[0]?.value || 0;
          const bRevenue = b.financialStats.revenue.slice(-1)[0]?.value || 0;
          return bRevenue - aRevenue;
        case "cagr":
          return b.financialStats.cagr - a.financialStats.cagr;
        case "foundedYear":
          return b.foundedYear - a.foundedYear;
        default:
          return 0;
      }
    });
    
    setFilteredBusinesses(results);
  }, [businesses, searchQuery, industryFilter, typeFilter, sortBy]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };
  
  const resetFilters = () => {
    setSearchQuery("");
    setIndustryFilter("");
    setTypeFilter("");
    setSortBy("name");
    setSearchParams({});
  };
  
  return (
    <PageLayout>
      <div className="bg-business-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Business Directory
              </h1>
              <p className="text-gray-600">
                Discover and connect with verified businesses
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="text-business-primary border-business-primary hover:bg-business-light"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h2>
              
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Search businesses..."
                    className="rounded-r-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="rounded-l-none bg-business-primary hover:bg-business-dark">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Industry
                  </label>
                  <Select
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      {uniqueIndustries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Business Type
                  </label>
                  <Select
                    value={typeFilter}
                    onValueChange={setTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {Object.values(BusinessType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="revenue">Highest Revenue</SelectItem>
                      <SelectItem value="cagr">Highest CAGR</SelectItem>
                      <SelectItem value="foundedYear">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Business Listings */}
          <div className="lg:col-span-3">
            {filteredBusinesses.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {filteredBusinesses.length} business{filteredBusinesses.length !== 1 && "es"}
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No businesses found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find businesses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Businesses;
