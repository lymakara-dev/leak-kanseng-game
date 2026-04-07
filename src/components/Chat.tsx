import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, X, User } from 'lucide-react';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { AVATARS } from '../lib/avatars';

interface Message {
  id: string;
  text: string;
  senderName: string;
  senderAvatar: number;
  createdAt: any;
  uid: string;
}

interface ChatProps {
  playerData: { name: string; avatarIndex: number } | null;
}

export const Chat: React.FC<ChatProps> = ({ playerData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only subscribe to messages if authenticated
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(50)
      ),
      { includeMetadataChanges: true },
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.docs.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as Message);
        });
        setMessages(msgs);
      },
      (error) => {
        // Only report if it's not a "missing permissions" error during initial load before auth
        if (!error.message.includes('insufficient permissions')) {
          handleFirestoreError(error, OperationType.LIST, 'messages');
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !playerData || isSending || !auth.currentUser) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        senderName: playerData.name,
        senderAvatar: playerData.avatarIndex,
        createdAt: serverTimestamp(),
        uid: auth.currentUser.uid,
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-yellow-500 text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[350px] h-[500px] bg-[#001C30]/95 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-yellow-500/20 flex items-center justify-between bg-yellow-500/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-headline font-bold text-yellow-500 tracking-tight">ការសន្ទនាបេសកកម្ម</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-yellow-500/50 hover:text-yellow-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-yellow-500/20">
              {messages.map((msg) => {
                const AvatarIcon = AVATARS[msg.senderAvatar]?.icon || User;
                const isMe = msg.senderName === playerData?.name;
                
                return (
                  <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                      <AvatarIcon className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className={cn(
                      "max-w-[75%] p-3 rounded-2xl text-sm font-body",
                      isMe 
                        ? "bg-yellow-500 text-black rounded-br-none" 
                        : "bg-surface-container-highest text-on-surface rounded-bl-none border border-yellow-500/10"
                    )}>
                      {!isMe && <div className="text-[10px] font-bold text-yellow-500/70 mb-1">{msg.senderName}</div>}
                      <div className="leading-relaxed break-words">{msg.text}</div>
                      <div className={cn(
                        "text-[9px] mt-1.5 font-mono tracking-wider opacity-60 flex items-center gap-1",
                        isMe ? "text-black/70" : "text-on-surface-variant/70"
                      )}>
                        {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'HH:mm') : '...'}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-yellow-500/20 bg-yellow-500/5">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="វាយសារនៅទីនេះ..."
                  className="w-full bg-surface-container-low border border-yellow-500/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-all font-body text-on-surface"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="bg-yellow-500 text-black p-2.5 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
