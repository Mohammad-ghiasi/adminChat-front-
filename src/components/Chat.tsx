// ChatBox.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Text,
    Box,
    Avatar,
} from '@chakra-ui/react';
import { io } from 'socket.io-client';
import ChatInput from './ChatInput'; // Import the ChatInput component
import ChatButton from './ChatButton'; // Import the ChatButton component

interface Message {
    message: string;
    creator: 'user' | 'admin';
}

interface ChatBoxProps {
    room: any; // Define more specific type if possible
    user: any; // Define more specific type if possible
}

const socket = io('https://adminchat-back-3ohq.vercel.app'); // Adjust the URL to your backend

export default function ChatBox({ room, user }: ChatBoxProps) {
    console.log('room =>', room);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { message: 'Welcome! How can I help you today?', creator: 'admin' },
    ]);

    // Fetch user data from cookie on component mount
    useEffect(() => {
        if (user) {
            setMessages((prevMessages) => [
                ...prevMessages,
                ...room.messages.filter(
                    (fetchedMsg: Message) =>
                        !prevMessages.some(
                            (msg) =>
                                msg.message === fetchedMsg.message &&
                                msg.creator === fetchedMsg.creator
                        )
                ),
            ]);
        }

        // Listen for incoming messages
        socket.on('messageAdded', (response) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { message: response.finalNewMessage.message, creator: response.finalNewMessage.creator }
            ]);
        });

        // Listen for error messages
        socket.on('error', (error) => {
            console.error(error.message);
        });

        return () => {
            // Cleanup the listeners when the component unmounts
            socket.off('messageAdded');
            socket.off('error');
        };
    }, []);

    // Toggle the modal open/close
    const toggleModal = () => {
        setIsOpen(!isOpen);
        socket.emit('setNewMessageFlags', { userId: user._id, ATU: false });
    };

    // Handle message submission
    const handleSendMessage = (message: string) => {
        // Add the new message to the state
        const newMessage: Message = { message, creator: 'user' };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Send the message through the socket
        socket.emit('addMessage', { message, creator: user.role, forUser: user._id });
        socket.emit('setNewMessageFlags', {userId: user._id, UTA: true });
    };

    return (
        <>
            {/* Use the ChatButton component */}
            <ChatButton onClick={toggleModal} newMessage={room?.newMessageAdminToUser} />

            <Modal isOpen={isOpen} onClose={toggleModal} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" alignItems="center" fontSize={{ base: 'lg', md: 'xl' }}>
                        {user && (
                            <>
                                <Avatar
                                    name={user.username}
                                    size={{ base: 'sm', md: 'md' }}
                                    mr={2}
                                />
                                <Text className="text-sm" fontSize={{ base: 'sm', md: 'md' }}>
                                    {user.username}
                                </Text>
                            </>
                        )}
                    </ModalHeader>
                    <ModalCloseButton className="mt-2 md:mt-4" />
                    <ModalBody fontSize={{ base: 'sm', md: 'md' }}>
                        <VStack align="stretch" spacing={4}>
                            <VStack className="shadow-md pb-3 pe-1" align="stretch" maxH="300px" overflowY="auto" spacing={2}>
                                {messages.map((msg, index) => (
                                    <Box
                                        key={index}
                                        p={2}
                                        borderRadius="md"
                                        alignSelf={msg.creator === 'user' ? 'flex-end' : 'flex-start'}
                                        bg={msg.creator === 'user' ? 'blue.500' : 'gray.200'}
                                        color={msg.creator === 'user' ? 'white' : 'black'}
                                        maxW="70%"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                    >
                                        {msg.message}
                                    </Box>
                                ))}
                            </VStack>

                            {/* Message Input */}
                            <ChatInput onSendMessage={handleSendMessage} />
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
