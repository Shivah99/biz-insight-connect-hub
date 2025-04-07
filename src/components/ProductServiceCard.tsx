
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductService } from "../types";

interface ProductServiceCardProps {
  item: ProductService;
}

const ProductServiceCard: React.FC<ProductServiceCardProps> = ({ item }) => {
  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{item.name}</h3>
          <Badge variant={item.isAvailable ? "default" : "outline"}>
            {item.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600">{item.description}</p>
        {item.imageUrl && (
          <div className="mt-3 rounded-md overflow-hidden bg-gray-50">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-32 object-cover"
            />
          </div>
        )}
      </CardContent>
      {item.price !== undefined && (
        <CardFooter className="p-4 pt-0 text-sm font-medium">
          Price: ${item.price.toFixed(2)}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductServiceCard;
