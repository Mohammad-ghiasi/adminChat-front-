"use client"
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import Cookies from 'js-cookie'; // Import js-cookie

export default function Getusers() {
    const getData = async () => {
        try {
            let userId = null;
            const userData = Cookies.get('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                userId = parsedData.userId._id;
            } else {
                console.log('No userData cookie found');
                return;
            }
            console.log(userId);
            
    
            const response = await axios.get(`http://localhost:3001/chat/find-chatRoom?roomId=670a22aca447c7392d23b52e`);
            console.log(response.data);
    
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
            if (error.response) {
                console.log('Response data:', error.response.data);
            }
        }
    }
    

    return (
        <Button onClick={(): Promise<void> => getData()}>Get Users</Button>
    )
}
