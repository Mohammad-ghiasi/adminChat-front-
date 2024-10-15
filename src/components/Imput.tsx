// app/components/UserForm.tsx
'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormValues {
    username: string;
    role: 'user' | 'admin';
}

const UserForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const router = useRouter()

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
        axios.post('https://adminchat-back-3ohq.vercel.app/user/add-user', data, { withCredentials: true }).
            then((res) => {
                if (res.status === 201) {
                    if (data.role === 'user') {
                        router.push('/chat');
                    } else if (data.role === 'admin') {
                        router.push('/admin');
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
        >
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    id="username"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    {...register('username', { required: 'Username is required' })}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                </label>
                <select
                    id="role"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    {...register('role', { required: 'Role is required' })}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Submit
            </button>
        </form>
    );
};

export default UserForm;
