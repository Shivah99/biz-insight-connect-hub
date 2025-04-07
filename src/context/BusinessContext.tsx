
import React, { createContext, useContext, useState } from 'react';
import { Business, BusinessType, ProductService, FinancialStats } from '../types';

interface BusinessContextType {
  businesses: Business[];
  addBusiness: (business: Omit<Business, 'id'>) => Promise<Business>;
  getBusiness: (id: string) => Business | undefined;
  updateBusiness: (id: string, data: Partial<Business>) => Promise<Business>;
  searchBusinesses: (query: string, filters?: any) => Business[];
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// Mock data for our demo
const MOCK_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Acme Corporation",
    type: BusinessType.CORPORATION,
    description: "A global leader in innovative solutions and technology products",
    contactEmail: "contact@acme.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Business Ave, Tech City, CA 94103",
    website: "https://acme.example.com",
    industry: "Technology",
    foundedYear: 2005,
    logoUrl: "/placeholder.svg",
    productsAndServices: [
      {
        id: "p1",
        name: "Enterprise Software Suite",
        description: "Comprehensive business management solution",
        price: 1999.99,
        isAvailable: true,
        imageUrl: "/placeholder.svg"
      },
      {
        id: "p2",
        name: "Cloud Services",
        description: "Scalable cloud infrastructure for businesses",
        price: 299.99,
        isAvailable: true,
        imageUrl: "/placeholder.svg"
      }
    ],
    financialStats: {
      revenue: [
        { year: 2018, value: 1500000 },
        { year: 2019, value: 2200000 },
        { year: 2020, value: 2700000 },
        { year: 2021, value: 3500000 },
        { year: 2022, value: 4200000 }
      ],
      cagr: 29.4,
      profitMargin: 22.5,
      roi: 18.7,
      customerRetentionRate: 92
    },
    ownerId: "2"
  },
  {
    id: "2",
    name: "GreenGrow Farms",
    type: BusinessType.LLC,
    description: "Sustainable farming and organic produce supplier",
    contactEmail: "info@greengrow.com",
    contactPhone: "+1 (555) 987-6543",
    address: "456 Harvest Rd, Rural County, OR 97123",
    website: "https://greengrow.example.com",
    industry: "Agriculture",
    foundedYear: 2010,
    logoUrl: "/placeholder.svg",
    productsAndServices: [
      {
        id: "p3",
        name: "Organic Vegetable Box",
        description: "Weekly subscription of fresh organic vegetables",
        price: 49.99,
        isAvailable: true,
        imageUrl: "/placeholder.svg"
      },
      {
        id: "p4",
        name: "Farm Tours",
        description: "Educational tours of our sustainable farming practices",
        price: 25,
        isAvailable: true,
        imageUrl: "/placeholder.svg"
      }
    ],
    financialStats: {
      revenue: [
        { year: 2018, value: 800000 },
        { year: 2019, value: 950000 },
        { year: 2020, value: 1200000 },
        { year: 2021, value: 1450000 },
        { year: 2022, value: 1800000 }
      ],
      cagr: 22.5,
      profitMargin: 18.3,
      roi: 15.2,
      customerRetentionRate: 88
    },
    ownerId: "3"
  },
  {
    id: "3",
    name: "BuildRight Construction",
    type: BusinessType.PARTNERSHIP,
    description: "Premium construction and renovation services for residential and commercial projects",
    contactEmail: "projects@buildright.com",
    contactPhone: "+1 (555) 234-5678",
    address: "789 Builder Blvd, Metro City, NY 10001",
    website: "https://buildright.example.com",
    industry: "Construction",
    foundedYear: 2008,
    logoUrl: "/placeholder.svg",
    productsAndServices: [
      {
        id: "p5",
        name: "Commercial Construction",
        description: "Full-service construction for commercial properties",
        isAvailable: true,
        imageUrl: "/placeholder.svg"
      },
      {
        id: "p6",
        name: "Home Renovation",
        description: "Expert renovation services for residential properties",
        isAvailable: true,
        imageUrl: "/placeholder.svg"
      }
    ],
    financialStats: {
      revenue: [
        { year: 2018, value: 3200000 },
        { year: 2019, value: 3800000 },
        { year: 2020, value: 3500000 },
        { year: 2021, value: 4200000 },
        { year: 2022, value: 5100000 }
      ],
      cagr: 12.4,
      profitMargin: 15.8,
      roi: 14.2,
      customerRetentionRate: 75
    },
    ownerId: "4"
  }
];

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);

  const addBusiness = async (businessData: Omit<Business, 'id'>): Promise<Business> => {
    // In a real app, this would be an API call
    const newBusiness: Business = {
      ...businessData,
      id: Math.random().toString(36).substring(2, 11),
    };
    
    setBusinesses([...businesses, newBusiness]);
    return newBusiness;
  };

  const getBusiness = (id: string): Business | undefined => {
    return businesses.find(b => b.id === id);
  };

  const updateBusiness = async (id: string, data: Partial<Business>): Promise<Business> => {
    // In a real app, this would be an API call
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error("Business not found");
    }
    
    const updatedBusiness = { ...businesses[index], ...data };
    const updatedBusinesses = [...businesses];
    updatedBusinesses[index] = updatedBusiness;
    
    setBusinesses(updatedBusinesses);
    return updatedBusiness;
  };

  const searchBusinesses = (query: string, filters?: any): Business[] => {
    // Simple search implementation - would be more sophisticated in a real app
    const normalizedQuery = query.toLowerCase();
    
    return businesses.filter(business => {
      // Search by name, description, or industry
      return (
        business.name.toLowerCase().includes(normalizedQuery) ||
        business.description.toLowerCase().includes(normalizedQuery) ||
        business.industry.toLowerCase().includes(normalizedQuery)
      );
    });
  };

  return (
    <BusinessContext.Provider 
      value={{ 
        businesses, 
        addBusiness, 
        getBusiness, 
        updateBusiness, 
        searchBusinesses 
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
