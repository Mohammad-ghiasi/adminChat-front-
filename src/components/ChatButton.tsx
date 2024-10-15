// ChatButton.tsx
'use client';

import React from 'react';
import { IconButton, Badge } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

interface ChatButtonProps {
    onClick: () => void; // Function to toggle the modal
    newMessage?: boolean; // New prop to indicate if there are new messages
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, newMessage }) => {
    return (
        <IconButton
            icon={
                <>
                    <ChatIcon />
                    {newMessage && (
                        <Badge
                            backgroundColor="#ff0000" // Set your custom red color here
                            position="absolute"
                            top="-2px"
                            right="-2px"
                            borderRadius="full"
                            boxSize="3"
                        />
                    )}
                </>
            }
            onClick={onClick}
            aria-label="Open chat"
            position="fixed"
            bottom="4"
            left="4"
            colorScheme="blue"
            borderRadius="full"
            boxShadow="lg"
            _hover={{ bg: 'blue.600' }}
        />
    );
};

export default ChatButton;
