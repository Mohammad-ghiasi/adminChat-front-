"use client"
import ChatBox from '@/components/Chat';
import { Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ChatRoute() {
  const [userData, setUserData] = useState<any>(null);
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    // Fetch the userData cookie
    const jsonUserData = Cookies.get('userData');
    const parsedUserData = jsonUserData ? JSON.parse(jsonUserData) : null;
    setUserData(parsedUserData);

    // Fetch the room data if userData and userId are available
    if (parsedUserData && parsedUserData.userId) {
      const fetchRoomData = async () => {
        try {
          await axios.post('https://adminchat-back-3ohq.vercel.app/chat/add-chatRoom', {
            data: parsedUserData.userId,
          });

          const response = await axios.get(
            `https://adminchat-back-3ohq.vercel.app/chat/find-chatRoom/${parsedUserData.userId}`
          );

          // Assuming your endpoint returns room data under 'data'
          setRoomData(response?.data?.data);
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
      {userData && <Text>I have userData cookie!</Text>}
      {/* chatbutton */}
    </>
  );
}
