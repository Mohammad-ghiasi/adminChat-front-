import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Avatar,
    Text,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoIosSend } from 'react-icons/io';
import Cookies from 'js-cookie';
import { ChatFormValues, ChatModalProps } from '@/types';
import socket from '@/services/soketIo';

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, userId }) => {
    const [messages, setMessages] = useState<any>([]);
    const { register, handleSubmit, reset } = useForm<ChatFormValues>();
    const [userData, setUserData] = useState<any>(null);
    const [thisUserData, setThisUserData] = useState<any>(null);

    useEffect(() => {
        const thisUserString = Cookies.get('userData');
        if (thisUserString) {
            const parsedData = JSON.parse(thisUserString);
            setThisUserData(parsedData);
        }

        if (userId) {

            socket.emit('findRoomByUserId', userId); // Emit event to find the room
            socket.on('roomFound', (data) => {
 
                setUserData(data.data.user);
                setMessages(data.data.room.messages);
            });

            socket.emit('setNewMessageFlags', { userId: userId, UTA: false });

            socket.on('error', (error) => {
                console.error(error);
            });
        }

        return () => {
            // Clean up listeners to prevent memory leaks
            socket.off('roomFound');
            socket.off('error');
        };
    }, [userId]); // Include userId in the dependency array

    socket.on('messageAdded', (response) => {
        setMessages(response.finalNewMessage.messages);
        console.log('we have a message');
        
    });

    // Handle message submission
    const onSubmit: SubmitHandler<ChatFormValues> = ({ message }) => {
        if (message.trim() !== '') {
            // Emit the message event to the backend
            socket.emit('addMessage', { message, creator: thisUserData?.role, forUser: userData?._id });

            // Listen for the 'messageAdded' event to handle success
            socket.on('messageAdded', (response) => {
                setMessages(response.finalNewMessage.messages);
                reset();
                console.log('we have a message');
                
            });

            socket.emit('setNewMessageFlags', { userId: userId, ATU: true });

            // Listen for the 'error' event to handle errors
            socket.once('error', (error) => {
                console.error(error.message);
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader display="flex" alignItems="center">
                    {userData && (
                        <>
                            <Avatar name={userData.username} size="md" mr={2} />
                            <Text>{userData.username}</Text>
                        </>
                    )}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="stretch" spacing={4}>
                        <VStack align="stretch" maxH="300px" overflowY="auto" spacing={2}>
                            {messages?.map((msg: any) => (
                                <Box
                                    key={msg._id}
                                    p={2}
                                    borderRadius="md"
                                    alignSelf={msg.creator === 'user' ? 'flex-end' : 'flex-start'}
                                    bg={msg.creator === 'user' ? 'blue.500' : 'gray.200'}
                                    color={msg.creator === 'user' ? 'white' : 'black'}
                                    maxW="70%"
                                >
                                    {msg.message}
                                </Box>
                            ))}
                        </VStack>

                        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
                            <InputGroup>
                                <Input
                                    placeholder="Type your message..."
                                    {...register('message', { required: true })}
                                    borderColor="gray.200"
                                    focusBorderColor="blue.500"
                                    variant="flushed"
                                />
                                <InputRightElement>
                                    <Button
                                        type="submit"
                                        variant="link"
                                        aria-label="Send"
                                        height="100%"
                                        p={0}
                                        minWidth="0"
                                        leftIcon={<IoIosSend size={'26px'} className="text-blue-500" />}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </form>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ChatModal;
