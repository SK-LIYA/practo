import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
  recipient_name?: string;
}

interface ChatInterfaceProps {
  recipientId: string;
  recipientName?: string;
  recipientAvatar?: string;
  conversationId?: string;
}

export function ChatInterface({
  recipientId,
  recipientName = "User",
  recipientAvatar,
  conversationId: initialConversationId,
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOrCreateConversation = async () => {
    if (!user || !recipientId) return null;

    try {
      // Check if conversation exists
      const { data: existingConversations, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${recipientId},user2_id.eq.${recipientId}`)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingConversations && existingConversations.length > 0) {
        return existingConversations[0].id;
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert([
          { user1_id: user.id, user2_id: recipientId }
        ])
        .select('id')
        .single();

      if (createError) throw createError;
      return newConversation.id;
    } catch (error) {
      console.error('Error with conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load conversation",
      });
      return null;
    }
  };

  const fetchMessages = async () => {
    if (!user || !conversationId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark unread messages as read
      const unreadMessages = data?.filter(
        msg => msg.recipient_id === user.id && !msg.is_read
      ) || [];

      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: error instanceof Error ? error.message : "Failed to load messages",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setupChat = async () => {
      if (!conversationId && user && recipientId) {
        const id = await getOrCreateConversation();
        if (id) {
          setConversationId(id);
        }
      } else if (conversationId) {
        fetchMessages();
      }
    };

    setupChat();
  }, [user, recipientId, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    // Set up real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId) return;

    try {
      setIsSending(true);
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: newMessage.trim(),
        is_read: false,
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };

  const formatMessageDate = (timestamp: string, index: number) => {
    const date = new Date(timestamp);
    const formattedDate = format(date, 'MMMM d, yyyy');
    
    if (index === 0) return formattedDate;
    
    const prevDate = new Date(messages[index - 1].created_at);
    if (date.toDateString() !== prevDate.toDateString()) {
      return formattedDate;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-[600px] rounded-lg border overflow-hidden bg-white">
      {/* Chat header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-3">
          <Avatar>
            {recipientAvatar ? (
              <AvatarImage src={recipientAvatar} alt={recipientName} />
            ) : null}
            <AvatarFallback>{getInitials(recipientName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{recipientName}</h3>
            <p className="text-xs text-gray-500">
              {messages.length > 0 ? `${messages.length} messages` : "Start chatting"}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchMessages}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            {isLoading ? "Loading messages..." : "No messages yet. Start the conversation!"}
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id} className="space-y-4">
              {formatMessageDate(message.created_at, index) && (
                <div className="flex justify-center">
                  <span className="text-xs bg-gray-100 rounded-full px-3 py-1 text-gray-500">
                    {formatMessageDate(message.created_at, index)}
                  </span>
                </div>
              )}
              
              <div 
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {message.sender_id !== user?.id && (
                    <Avatar className="h-6 w-6">
                      {recipientAvatar ? (
                        <AvatarImage src={recipientAvatar} alt={recipientName} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getInitials(recipientName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`rounded-lg px-4 py-2 ${
                      message.sender_id === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p 
                      className={`text-xs mt-1 ${
                        message.sender_id === user?.id
                          ? 'text-primary-foreground/70'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                  
                  {message.sender_id === user?.id && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {user?.email?.substring(0, 2).toUpperCase() || 'Me'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form 
        onSubmit={handleSendMessage} 
        className="border-t p-4 bg-white"
      >
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isSending || !conversationId}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isSending || !newMessage.trim() || !conversationId}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
