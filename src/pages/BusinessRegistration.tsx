
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../context/BusinessContext";
import { Business, BusinessType, ProductService, FinancialStats, TimeSeriesData } from "../types";

const BusinessRegistration = () => {
  const { user } = useAuth();
  const { addBusiness } = useBusiness();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: BusinessType.PRIVATE,
    description: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    address: "",
    website: "",
    industry: "",
    foundedYear: new Date().getFullYear(),
    logoUrl: "/placeholder.svg",
  });
  
  // Products and services state
  const [products, setProducts] = useState<Omit<ProductService, "id">[]>([
    {
      name: "",
      description: "",
      price: undefined,
      isAvailable: true,
      imageUrl: "/placeholder.svg",
    },
  ]);
  
  // Financial data state
  const [financialData, setFinancialData] = useState({
    cagr: 0,
    profitMargin: 0,
    roi: 0,
    customerRetentionRate: 0,
    revenue: [
      { year: new Date().getFullYear() - 4, value: 0 },
      { year: new Date().getFullYear() - 3, value: 0 },
      { year: new Date().getFullYear() - 2, value: 0 },
      { year: new Date().getFullYear() - 1, value: 0 },
      { year: new Date().getFullYear(), value: 0 },
    ],
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleProductChange = (index: number, field: keyof ProductService, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setProducts(updatedProducts);
  };
  
  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        description: "",
        price: undefined,
        isAvailable: true,
        imageUrl: "/placeholder.svg",
      },
    ]);
  };
  
  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };
  
  const handleFinancialChange = (field: keyof typeof financialData, value: any) => {
    if (field !== "revenue") {
      setFinancialData({
        ...financialData,
        [field]: Number(value),
      });
    }
  };
  
  const handleRevenueChange = (index: number, value: string) => {
    const updatedRevenue = [...financialData.revenue];
    updatedRevenue[index] = {
      ...updatedRevenue[index],
      value: Number(value),
    };
    setFinancialData({
      ...financialData,
      revenue: updatedRevenue,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to register a business.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create business object
      const businessData: Omit<Business, "id"> = {
        ...formData,
        foundedYear: Number(formData.foundedYear),
        productsAndServices: products.map((product, index) => ({
          ...product,
          id: `p${index + 1}`,
        })),
        financialStats: {
          cagr: Number(financialData.cagr),
          profitMargin: Number(financialData.profitMargin),
          roi: Number(financialData.roi),
          customerRetentionRate: Number(financialData.customerRetentionRate),
          revenue: financialData.revenue,
        },
        ownerId: user.id,
      };
      
      // Add business
      const newBusiness = await addBusiness(businessData);
      
      toast({
        title: "Business registered successfully",
        description: `${newBusiness.name} has been added to the directory.`,
      });
      
      navigate(`/business/${newBusiness.id}`);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error registering your business.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Register Your Business</CardTitle>
            <CardDescription>
              Add your business information to the directory
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Business Type*</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BusinessType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry*</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year*</Label>
                    <Input
                      id="foundedYear"
                      name="foundedYear"
                      type="number"
                      value={formData.foundedYear}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email*</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone*</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address*</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Products and Services */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Products & Services</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProduct}
                    className="text-business-primary border-business-primary"
                  >
                    Add Product/Service
                  </Button>
                </div>
                
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg mb-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">
                        Product/Service #{index + 1}
                      </h3>
                      {products.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name*</Label>
                        <Input
                          value={product.name}
                          onChange={(e) =>
                            handleProductChange(index, "name", e.target.value)
                          }
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Price (USD)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={product.price || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "price",
                              e.target.value ? Number(e.target.value) : undefined
                            )
                          }
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description*</Label>
                        <Textarea
                          value={product.description}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={product.imageUrl || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "imageUrl",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Availability</Label>
                        <Select
                          value={product.isAvailable ? "true" : "false"}
                          onValueChange={(value) =>
                            handleProductChange(
                              index,
                              "isAvailable",
                              value === "true"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Available</SelectItem>
                            <SelectItem value="false">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Financial Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cagr">CAGR (%)*</Label>
                    <Input
                      id="cagr"
                      type="number"
                      step="0.1"
                      value={financialData.cagr}
                      onChange={(e) =>
                        handleFinancialChange("cagr", e.target.value)
                      }
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profitMargin">Profit Margin (%)*</Label>
                    <Input
                      id="profitMargin"
                      type="number"
                      step="0.1"
                      value={financialData.profitMargin}
                      onChange={(e) =>
                        handleFinancialChange("profitMargin", e.target.value)
                      }
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="roi">ROI (%)*</Label>
                    <Input
                      id="roi"
                      type="number"
                      step="0.1"
                      value={financialData.roi}
                      onChange={(e) =>
                        handleFinancialChange("roi", e.target.value)
                      }
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerRetentionRate">
                      Customer Retention Rate (%)*
                    </Label>
                    <Input
                      id="customerRetentionRate"
                      type="number"
                      step="0.1"
                      value={financialData.customerRetentionRate}
                      onChange={(e) =>
                        handleFinancialChange(
                          "customerRetentionRate",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label className="mb-2 block">Annual Revenue (USD)*</Label>
                  <div className="space-y-4">
                    {financialData.revenue.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-20">
                          <Label>Year:</Label>
                          <Input value={item.year} disabled />
                        </div>
                        <div className="flex-grow">
                          <Label>Revenue (USD):</Label>
                          <Input
                            type="number"
                            value={item.value}
                            onChange={(e) =>
                              handleRevenueChange(index, e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-business-primary hover:bg-business-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Business"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BusinessRegistration;
