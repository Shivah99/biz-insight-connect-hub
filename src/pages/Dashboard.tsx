
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "../components/PageLayout";
import BusinessCard from "../components/BusinessCard";
import MessageItem from "../components/MessageItem";
import FinancialChart from "../components/FinancialChart";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../context/BusinessContext";
import { useMessages } from "../context/MessageContext";
import { UserRole } from "../types";
import { 
  Building2, 
  MessageSquare, 
  User, 
  Calendar, 
  TrendingUp, 
  Search,
  Plus,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { businesses } = useBusiness();
  const { messages, getConversation } = useMessages();
  const navigate = useNavigate();
  
  // Get relevant data based on user role
  const userBusinesses = businesses.filter(
    (business) => business.ownerId === user?.id
  );
  
  const latestMessages = messages
    .filter(msg => msg.receiverId === user?.id || msg.senderId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get unique conversation partners
  const uniqueConversations = [...new Set(
    latestMessages.map(msg => 
      msg.senderId === user?.id ? msg.receiverId : msg.senderId
    )
  )].slice(0, 3);
  
  return (
    <PageLayout>
      <div className="bg-business-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.name}
              </p>
            </div>
            {user?.role === UserRole.GENERAL && (
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={() => navigate("/register-business")}
                  className="bg-business-primary hover:bg-business-dark"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Register a Business
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Businesses</p>
                  <p className="text-2xl font-bold">
                    {user?.role === UserRole.BUSINESS ? userBusinesses.length : businesses.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-business-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Messages</p>
                  <p className="text-2xl font-bold">
                    {messages.filter(msg => 
                      msg.receiverId === user?.id || msg.senderId === user?.id
                    ).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Type</p>
                  <p className="text-xl font-bold truncate">
                    {user?.role === UserRole.BUSINESS ? "Business" : "General User"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-xl font-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="businesses">
              <Building2 className="h-4 w-4 mr-2" />
              {user?.role === UserRole.BUSINESS ? "My Businesses" : "Businesses"}
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Recent Businesses */}
                <Card className="mb-8">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {user?.role === UserRole.BUSINESS ? "My Businesses" : "Recent Businesses"}
                      </CardTitle>
                      <Button
                        variant="link"
                        onClick={() => 
                          user?.role === UserRole.BUSINESS 
                            ? navigate("/register-business") 
                            : navigate("/businesses")
                        }
                        className="text-business-primary"
                      >
                        {user?.role === UserRole.BUSINESS ? "Add New" : "View All"}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <CardDescription>
                      {user?.role === UserRole.BUSINESS 
                        ? "Manage your registered businesses" 
                        : "Recently added businesses to the directory"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user?.role === UserRole.BUSINESS ? (
                      userBusinesses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {userBusinesses.map((business) => (
                            <BusinessCard key={business.id} business={business} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No businesses registered yet
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Register your business to showcase it in our directory.
                          </p>
                          <Button
                            onClick={() => navigate("/register-business")}
                            className="bg-business-primary hover:bg-business-dark"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Register Business
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {businesses.slice(0, 4).map((business) => (
                          <BusinessCard key={business.id} business={business} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Messages */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Messages</CardTitle>
                      <Button
                        variant="link"
                        onClick={() => navigate("/messages")}
                        className="text-business-primary"
                      >
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <CardDescription>
                      Your latest conversations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {latestMessages.length > 0 ? (
                      <div className="space-y-4">
                        {latestMessages.slice(0, 3).map((msg) => (
                          <MessageItem
                            key={msg.id}
                            message={msg}
                            isCurrentUser={msg.senderId === user?.id}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No messages yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Start a conversation with a business or user.
                        </p>
                        <Button
                          onClick={() => navigate("/businesses")}
                          className="bg-business-primary hover:bg-business-dark"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Find Businesses
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Sidebar */}
              <div>
                {user?.role === UserRole.BUSINESS && userBusinesses.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader className="pb-2">
                      <CardTitle>Business Performance</CardTitle>
                      <CardDescription>
                        Financial overview for {userBusinesses[0].name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userBusinesses[0] && (
                        <>
                          <FinancialChart
                            data={userBusinesses[0].financialStats.revenue}
                            title="Revenue"
                            type="line"
                          />
                          <div className="mt-4 p-4 bg-business-light rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">CAGR</span>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                                <span className="font-bold">{userBusinesses[0].financialStats.cagr}%</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        onClick={() => navigate("/businesses")}
                        className="w-full justify-start"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search Businesses
                      </Button>
                      <Button
                        onClick={() => navigate("/messages")}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Messages
                      </Button>
                      {user?.role === UserRole.GENERAL && (
                        <Button
                          onClick={() => navigate("/register-business")}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Register Business
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="businesses" className="animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {user?.role === UserRole.BUSINESS ? "My Businesses" : "All Businesses"}
                  </CardTitle>
                  {user?.role === UserRole.BUSINESS && (
                    <Button
                      onClick={() => navigate("/register-business")}
                      className="bg-business-primary hover:bg-business-dark"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {user?.role === UserRole.BUSINESS ? (
                  userBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userBusinesses.map((business) => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No businesses registered yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Register your business to showcase it in our directory.
                      </p>
                      <Button
                        onClick={() => navigate("/register-business")}
                        className="bg-business-primary hover:bg-business-dark"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Register Business
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {uniqueConversations.length > 0 ? (
                  <div className="space-y-8">
                    {uniqueConversations.map((partnerId) => {
                      const conversationMessages = getConversation(partnerId);
                      return (
                        <div key={partnerId} className="space-y-4">
                          <div className="pb-2 border-b border-gray-100">
                            <h3 className="font-medium">Conversation with User {partnerId}</h3>
                          </div>
                          <div className="space-y-4">
                            {conversationMessages.slice(-3).map((msg) => (
                              <MessageItem
                                key={msg.id}
                                message={msg}
                                isCurrentUser={msg.senderId === user?.id}
                              />
                            ))}
                          </div>
                          <Button
                            variant="link"
                            onClick={() => navigate("/messages")}
                            className="text-business-primary p-0"
                          >
                            View full conversation
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start a conversation with a business or user.
                    </p>
                    <Button
                      onClick={() => navigate("/businesses")}
                      className="bg-business-primary hover:bg-business-dark"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Businesses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
