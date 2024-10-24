'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaComments } from 'react-icons/fa';
import { Badge, Button } from '@chakra-ui/react';
import ChatModal from '@/components/ChatModal';
import socket from '@/services/soketIo';

const AdminPage: React.FC = () => {
    // const [userData, setUserData] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    useEffect(() => {

        const userDataString = Cookies.get('userData');
        if (userDataString) {
            const parsedData = JSON.parse(userDataString);
            // setUserData(parsedData);

            socket.on('connect', () => {
                // Emit the getAllRooms event when the socket connects
                socket.emit('getAllRooms');
            });
            // Listen for the 'allRooms' event to receive room data
            socket.on('allRooms', (data) => {
                setRooms(data.data);
            });

            // Listen for error events
            socket.on('error', (error) => {
                console.error('Error:', error);
            });
        }

        // Cleanup the socket connection when the component unmounts
        return () => {
            // socket.disconnect();
        };
    }, []);

    // Function to open the modal
    const openModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Page</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left">UserId</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms?.map((user: any) => (
                            <tr key={user._id} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-6">{user.isForUser}</td>
                                <td className="py-3 px-6 text-center">
                                    <Button
                                        variant="link"
                                        colorScheme="blue"
                                        onClick={() => openModal(user.isForUser)}
                                    >
                                        <FaComments className="inline-block mr-2" />
                                        Chat
                                        {user.newMessageUserToAdmin && (
                                            <Badge ml={2} colorScheme="red">
                                                New
                                            </Badge>
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Chat Modal */}
            {selectedUserId && (
                <ChatModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    userId={selectedUserId}
                />
            )}
        </div>
    );
};

export default AdminPage;
