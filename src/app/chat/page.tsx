import ChatBox from '@/components/Chat';
import { Text } from '@chakra-ui/react';
import { cookies } from 'next/headers';
import axios from 'axios';
import React from 'react';

export default async function ChatRoute() {
  // Fetch the cookies
  const cookiesStore = cookies();
  const jsonUserData: string | undefined = await cookiesStore.get('userData')?.value;
  const userData = jsonUserData ? JSON.parse(jsonUserData) : null;

  // Fetch the room data if userData and userId are available
  let roomData = null;
  if (userData && userData.userId) {
    try {
      await axios.post('https://adminchat-back-3ohq.vercel.app/chat/add-chatRoom', {data: userData.userId})
      const response = await axios.get(`https://adminchat-back-3ohq-6veaoukx0-mohammad-ghiasis-projects.vercel.app/?vercelToolbarCode=6Mv3PnPyOwcwkkz/chat/find-chatRoom/${userData.userId}`)

      // Assuming your endpoint returns room data under 'data'
      roomData = response?.data.data;
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  }

  return (
    <>
      <ChatBox room={roomData.room} user={roomData.user}/>
      {userData && (<Text>I have userData cookie!</Text>)}
      {/* chatbutton */}
    </>
  );
}
