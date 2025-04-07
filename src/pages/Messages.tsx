
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "../components/PageLayout";
import MessageItem from "../components/MessageItem";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { User, UserRole } from "../types";
import { Send, User as UserIcon } from "lucide-react";

const Messages = () => {
  const { user } = useAuth();
  const { messages, sendMessage, getConversation, markAsRead } = useMessages();
  const { toast } = useToast();
  
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get all unique conversation partners
  const conversationPartners = [...new Set(
    messages
      .filter(msg => msg.senderId === user?.id || msg.receiverId === user?.id)
      .map(msg => msg.senderId === user?.id ? msg.receiverId : msg.senderId)
  )];
  
  // Get messages for active conversation
  const conversationMessages = activeConversation
    ? getConversation(activeConversation)
    : [];
  
  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (activeConversation) {
      // Mark unread messages in active conversation as read
      conversationMessages
        .filter(msg => msg.receiverId === user?.id && !msg.isRead)
        .forEach(msg => markAsRead(msg.id));
    }
  }, [activeConversation, conversationMessages, user?.id, markAsRead]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);
  
  const handleSendMessage = async () => {
    if (!activeConversation || !newMessage.trim()) return;
    
    setIsSending(true);
    
    try {
      await sendMessage(activeConversation, newMessage);
      setNewMessage("");
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
  
  // Get unread count for a conversation
  const getUnreadCount = (partnerId: string) => {
    return messages.filter(
      msg => msg.senderId === partnerId && msg.receiverId === user?.id && !msg.isRead
    ).length;
  };
  
  // Format user name (in a real app, you'd get this from a user service)
  const formatUserName = (userId: string) => {
    return userId === "1" 
      ? "John Doe" 
      : userId === "2" 
        ? "Acme Corp" 
        : `User ${userId}`;
  };
  
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Conversations list */}
          <div className="md:col-span-1">
            <Card className="shadow-sm h-[calc(100vh-13rem)] flex flex-col">
              <CardContent className="flex-grow p-0 overflow-y-auto">
                {conversationPartners.length > 0 ? (
                  <div className="divide-y">
                    {conversationPartners.map((partnerId) => {
                      const unreadCount = getUnreadCount(partnerId);
                      const lastMessage = getConversation(partnerId).slice(-1)[0];
                      
                      return (
                        <button
                          key={partnerId}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            activeConversation === partnerId ? "bg-business-light" : ""
                          }`}
                          onClick={() => setActiveConversation(partnerId)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">
                                  {formatUserName(partnerId)}
                                </h3>
                                {unreadCount > 0 && (
                                  <span className="ml-2 bg-business-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                              {lastMessage && (
                                <p className="text-sm text-gray-500 truncate">
                                  {lastMessage.senderId === user?.id ? "You: " : ""}
                                  {lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    <div>
                      <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p>No conversations yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Conversation */}
          <div className="md:col-span-3">
            <Card className="shadow-sm h-[calc(100vh-13rem)] flex flex-col">
              {activeConversation ? (
                <>
                  {/* Conversation header */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h2 className="font-medium">
                          {formatUserName(activeConversation)}
                        </h2>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-grow p-6 overflow-y-auto">
                    {conversationMessages.length > 0 ? (
                      <div className="space-y-4">
                        {conversationMessages.map((message) => (
                          <MessageItem
                            key={message.id}
                            message={message}
                            isCurrentUser={message.senderId === user?.id}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <div className="p-4 border-t border-gray-100">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex"
                    >
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow rounded-r-none"
                      />
                      <Button
                        type="submit"
                        className="rounded-l-none bg-business-primary"
                        disabled={!newMessage.trim() || isSending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                  {conversationPartners.length > 0 ? (
                    <div>
                      <p className="mb-2">Select a conversation to start messaging</p>
                      <UserIcon className="h-12 w-12 mx-auto text-gray-300 mt-4" />
                    </div>
                  ) : (
                    <div>
                      <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="mb-2">No messages yet</p>
                      <p className="text-sm">Send a message to a business to start a conversation</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Messages;
