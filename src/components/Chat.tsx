import { useState, useEffect, useRef } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Text, Box, Avatar,
} from '@chakra-ui/react';
import ChatInput from './ChatInput';
import ChatButton from './ChatButton';
import socket from '@/services/soketIo';
import { ChatBoxProps, Message } from '@/types';

export default function ChatBox({ room, user }: ChatBoxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [haveMessage, setHaveMessage] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        { message: 'Welcome! How can I help you today?', creator: 'admin' },
    ]);

    // Ref to the end of the messages for auto-scrolling
    const messageEndRef = useRef<HTMLDivElement>(null);

    // Function to handle new messages
    const handleNewMessage = (response: any) => {
        const addedMessage = response?.finalNewMessage?.message;
        if (addedMessage && addedMessage.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { message: addedMessage, creator: response.finalNewMessage.creator },
            ]);
        }
    };

    useEffect(() => {
        if (user && room && room.messages) {
            setMessages((prevMessages) => [
                ...prevMessages,
                ...room.messages
                    .filter((fetchedMsg: Message) =>
                        fetchedMsg.message.trim() &&
                        !prevMessages.some(
                            (msg) =>
                                msg.message === fetchedMsg.message &&
                                msg.creator === fetchedMsg.creator
                        )
                    ),
            ]);
            setHaveMessage(room.newMessageAdminToUser);
        }

        socket.on('error', (error) => {
            console.error(error.message);
        });

        // Clean up socket listeners
        return () => {
            socket.off('messageAdded');
            socket.off('error');
        };
    }, [room, user]);

    // Toggle modal and reset new message flags
    const toggleModal = () => {
        setIsOpen(!isOpen);
        socket.emit('setNewMessageFlags', { userId: user._id, ATU: false });
        setHaveMessage(false);
    };

    // socket.on('messageAdded', handleNewMessage);
    socket.on('messageAdded', (response) => {
        if (response.finalNewMessage.isForUser === user._id) {
            setMessages(response.finalNewMessage.messages);
            console.log('we have a message');
        }
        
    });


    // Send message and set new message flags
    const handleSendMessage = (message: string) => {
        if (message.trim()) {
            const newMessage: Message = { message, creator: 'user' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            socket.emit('addMessage', { message, creator: user.role, forUser: user._id });
            // socket.on('messageAdded', handleNewMessage);
            socket.on('messageAdded', () => {
                console.log('Have a new message for user!');
                
            });
            socket.emit('setNewMessageFlags', { userId: user._id, UTA: true });
        }
    };

    // Scroll to the bottom of the message container
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Use effect to auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <>
            <ChatButton onClick={toggleModal} newMessage={haveMessage} />

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
                                {/* This div helps in auto-scrolling */}
                                <div ref={messageEndRef} />
                            </VStack>

                            <ChatInput onSendMessage={handleSendMessage} />
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
