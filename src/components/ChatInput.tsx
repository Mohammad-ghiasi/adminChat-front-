// ChatInput.tsx
'use client';

import React from 'react';
import {
    Button,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoIosSend } from 'react-icons/io';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

interface ChatFormValues {
    message: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const { register, handleSubmit, reset } = useForm<ChatFormValues>();

    // Handle message submission
    const onSubmit: SubmitHandler<ChatFormValues> = ({ message }) => {
        if (message.trim() !== '') {
            onSendMessage(message); // Call the function passed as a prop
            reset(); // Reset the form after sending the message
        }
    };

    return (
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
                        variant="link" // Use variant="link" to disable default styles
                        aria-label="Send"
                        height="100%" // Ensure the button fits the input height
                        p={0} // Remove padding
                        minWidth="0" // Remove min-width to avoid stretching
                        leftIcon={<IoIosSend size={'26px'} className="text-blue-500" />}
                    />
                </InputRightElement>
            </InputGroup>
        </form>
    );
};

export default ChatInput;
