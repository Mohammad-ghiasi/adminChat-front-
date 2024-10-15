"use client"
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input, Button, VStack, FormControl, FormErrorMessage } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
    userId: string;
}

export default function Login() {
    const router = useRouter()
    const { register, reset, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

    const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
        axios.get(`https://adminchat-back-3ohq.vercel.app/user/get-user?userId=${data.userId}`)
            .then((res) => {
                const { username, role, _id } = res.data.data;
                Cookies.set('userData', JSON.stringify({ username, role, userId: _id }), {
                    expires: 1, // Expires in 1 day
                });
                if (role === 'user') {
                    router.push('/chat');
                } else if (role === 'admin') {
                    router.push('/admin');
                }
                reset()
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={4}
            width="300px"
            mx="auto"
            mt="50px"
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
        >
            <FormControl isInvalid={!!errors.userId}>
                <Input
                    placeholder="Enter User ID"
                    {...register('userId', { required: 'User ID is required' })}
                    variant="filled"
                />
                <FormErrorMessage>
                    {errors.userId && errors.userId.message}
                </FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
                Submit
            </Button>
        </VStack>
    );
};