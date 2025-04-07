
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "../components/PageLayout";
import FinancialChart from "../components/FinancialChart";
import StatCard from "../components/StatCard";
import ProductServiceCard from "../components/ProductServiceCard";
import { useBusiness } from "../context/BusinessContext";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { MapPin, Globe, Mail, Phone, Calendar, BarChart3, MessageSquare } from "lucide-react";

const BusinessProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBusiness } = useBusiness();
  const { user } = useAuth();
  const { sendMessage } = useMessages();
  const { toast } = useToast();
  
  const [messageContent, setMessageContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const business = getBusiness(id || "");
  
  if (!business) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
          <p className="mb-6">The business you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => navigate("/businesses")}
            className="bg-business-primary hover:bg-business-dark"
          >
            Back to Directory
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to send messages to businesses.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!messageContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await sendMessage(business.ownerId, messageContent);
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${business.name}.`,
      });
      setMessageContent("");
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <PageLayout>
      {/* Business Header */}
      <div className="bg-business-light py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-white p-2 shadow-md flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  <p className="text-gray-600 mb-4">{business.industry} · {business.type}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-business-primary hover:bg-business-dark">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Business
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to {business.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-[120px]"
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="w-full bg-business-primary hover:bg-business-dark"
                          disabled={isSending}
                        >
                          {isSending ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-500" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-business-primary hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <a
                    href={`mailto:${business.contactEmail}`}
                    className="text-business-primary hover:underline"
                  >
                    {business.contactEmail}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <a
                    href={`tel:${business.contactPhone}`}
                    className="text-business-primary hover:underline"
                  >
                    {business.contactPhone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Founded in {business.foundedYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">
              <BarChart3 className="h-4 w-4 mr-2" />
              Financial Statistics
            </TabsTrigger>
            <TabsTrigger value="products">Products & Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Products & Services Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.productsAndServices.slice(0, 2).map((item) => (
                      <ProductServiceCard key={item.id} item={item} />
                    ))}
                  </div>
                  {business.productsAndServices.length > 2 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="link"
                        onClick={() => document.querySelector('[data-value="products"]')?.click()}
                        className="text-business-primary hover:text-business-dark"
                      >
                        View All Products & Services
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Financial Highlights</h2>
                  <div className="space-y-4">
                    <StatCard
                      title="Compound Annual Growth Rate"
                      value={business.financialStats.cagr}
                      type="cagr"
                    />
                    <StatCard
                      title="Profit Margin"
                      value={business.financialStats.profitMargin}
                      type="profit"
                    />
                    <StatCard
                      title="Return on Investment"
                      value={business.financialStats.roi}
                      type="roi"
                    />
                    <Button
                      variant="link"
                      onClick={() => document.querySelector('[data-value="financials"]')?.click()}
                      className="w-full text-business-primary hover:text-business-dark"
                    >
                      View Detailed Financials
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financials" className="animate-fade-in">
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Revenue Overview</h2>
                <FinancialChart
                  data={business.financialStats.revenue}
                  title="Annual Revenue"
                  type="bar"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Revenue Trend</h2>
                <FinancialChart
                  data={business.financialStats.revenue}
                  title="Revenue Growth Trend"
                  type="line"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Key Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="CAGR"
                    value={business.financialStats.cagr}
                    type="cagr"
                  />
                  <StatCard
                    title="Profit Margin"
                    value={business.financialStats.profitMargin}
                    type="profit"
                  />
                  <StatCard
                    title="ROI"
                    value={business.financialStats.roi}
                    type="roi"
                  />
                  <StatCard
                    title="Customer Retention"
                    value={business.financialStats.customerRetentionRate}
                    type="retention"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Products & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.productsAndServices.map((item) => (
                  <ProductServiceCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BusinessProfile;
