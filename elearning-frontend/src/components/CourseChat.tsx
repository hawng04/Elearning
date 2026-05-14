'use client';

import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axiosClient from '@/lib/axiosClient'; // Giả sử bạn có file này
import { ChatMessage } from '@/types/chat';



interface CourseChatProps {
  courseId: string | number;
  currentUser: { id: number; name: string }; // Truyền user đang đăng nhập vào đây
}

export default function CourseChat({ courseId, currentUser }: CourseChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!courseId) return;

    // 1. Gọi API lấy lịch sử chat cũ từ MongoDB
    axiosClient.get(`/chat/${courseId}`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => console.error("Lỗi lấy lịch sử chat:", err));

    // 2. Thiết lập kết nối WebSocket
    // Lưu ý: Đổi URL này thành URL thật của Backend nếu bạn deploy
    const socket = new SockJS('http://localhost:8080/ws'); 
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str); // Bật lên nếu muốn xem log debug của STOMP
      },
      onConnect: () => {
        console.log('Đã kết nối WebSocket thành công!');
        
        // Đăng ký (Subscribe) vào phòng chat của khóa học này
        client.subscribe(`/topic/messages/${courseId}`, (message) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          // Cập nhật tin nhắn mới vào state
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error('Lỗi STOMP:', frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    // Cleanup khi user rời khỏi trang
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [courseId]);

  // Hàm Gửi tin nhắn
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !stompClientRef.current?.connected) return;

    const chatMessage = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: inputMessage.trim(),
    };

    // Bắn tin nhắn lên Server
    stompClientRef.current.publish({
      destination: `/app/chat/${courseId}`,
      body: JSON.stringify(chatMessage),
    });

    setInputMessage(''); // Xóa ô input
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-[#1c1d1f] border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <h3 className="text-white font-bold text-sm">Thảo luận khóa học</h3>
      </div>

      {/* Khu vực hiển thị tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-400 mb-1">{isMe ? 'Bạn' : msg.senderName}</span>
              <div className={`px-4 py-2 rounded-lg max-w-[85%] text-sm ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập tin nhắn */}
      <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-gray-900 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button 
          type="submit" 
          disabled={!inputMessage.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold disabled:opacity-50 hover:bg-purple-700 transition-colors"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}