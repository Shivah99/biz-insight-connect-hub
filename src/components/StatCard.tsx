
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, PercentCircle, CandlestickChart, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  type: "cagr" | "profit" | "roi" | "retention";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type }) => {
  const getIcon = () => {
    switch (type) {
      case "cagr":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "profit":
        return <PercentCircle className="h-5 w-5 text-blue-600" />;
      case "roi":
        return <CandlestickChart className="h-5 w-5 text-purple-600" />;
      case "retention":
        return <Users className="h-5 w-5 text-amber-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-business-primary" />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case "cagr":
        return "text-green-600";
      case "profit":
        return "text-blue-600";
      case "roi":
        return "text-purple-600";
      case "retention":
        return "text-amber-600";
      default:
        return "text-business-primary";
    }
  };

  return (
    <Card className="stat-card">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="p-4 bg-gray-50 rounded-l-lg">
            {getIcon()}
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className={`text-xl font-bold ${getColorClass()}`}>
              {value}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
