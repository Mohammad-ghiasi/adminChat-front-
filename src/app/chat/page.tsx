"use client"
import ChatBox from '@/components/Chat';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/services/api';

export default function ChatRoute() {
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    // Fetch the userData cookie
    const jsonUserData = Cookies.get('userData');
    const parsedUserData = jsonUserData ? JSON.parse(jsonUserData) : null;

    // Fetch the room data if userData and userId are available
    if (parsedUserData && parsedUserData.userId) {
      const fetchRoomData = async () => {
        try {
          const roomData = await api.get(`/chat/find-chatRoom/${parsedUserData.userId}`);

          // Assuming your endpoint returns room data under 'data'
          setRoomData(roomData?.data.data);
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };

      fetchRoomData();
    }
  }, []);

  return (
    <>
      <ChatBox room={roomData?.room} user={roomData?.user} />
    </>
  );
}
