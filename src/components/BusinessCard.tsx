
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Business } from "../types";
import { MapPin, Globe, TrendingUp } from "lucide-react";

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Link to={`/business/${business.id}`} className="block group">
      <Card className="business-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-business-light">
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold group-hover:text-business-primary transition-colors">
                {business.name}
              </h3>
              <Badge variant="outline" className="text-xs font-normal">
                {business.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {business.description}
          </p>
          <div className="flex flex-col space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{business.address}</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              <span className="truncate">{business.website}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 border-t border-gray-100">
          <div className="flex justify-between items-center w-full text-sm">
            <span className="text-gray-500">Founded: {business.foundedYear}</span>
            <div className="flex items-center text-business-primary font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>CAGR: {business.financialStats.cagr}%</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BusinessCard;
