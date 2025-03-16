import { Button, NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { FC, useEffect, useState } from 'react';
import { useTheme } from '../../components/ThemeContext';
import axios, { AxiosError } from 'axios';

const ProfilePage: FC = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    // Form setup
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: ''
        },
        validate: {
            name: (value) => value.trim().length < 3 ? 'Name is too short' : null,
            email: (value) => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : null,
            phone: (value) => value.length < 10 ? 'Invalid phone number' : null,
            address: (value) => value.trim().length < 10 ? 'Address is too short' : null,
            city: (value) => value.trim().length < 3 ? 'City is too short' : null,
            state: (value) => value.trim().length < 3 ? 'State is too short' : null,
            country: (value) => value.trim().length < 3 ? 'Country is too short' : null,
            pincode: (value) => value.length < 6 ? 'Invalid pincode' : null
        }
    });

    // Fetch user details from backend
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            try {
                const response = await axios.get('https://cinehub-backend.onrender.com/users/profile/getProfile', {
                    headers: { Authorization: `Bearer ${token}` } // Include Authorization header
                });
                form.setValues(response.data);
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error('Error fetching profile:', error.response?.data || error.message);
                } else if (error instanceof Error) {
                    console.error('Error fetching profile:', error.message);
                } else {
                    console.error('An unknown error occurred:', error);
                }
            }
        };

        fetchProfile();
    }, []);

    // Update user profile
    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }

        try { 
            setLoading(true);
            await axios.put('https://cinehub-backend.onrender.com/users/profile/updateProfile', form.values, {
                headers: { Authorization: `Bearer ${token}` } // Include Authorization header
            });
            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error updating profile:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error('Error updating profile:', error.message);
            } else {
                console.error('An unknown error occurred:', error);
            }
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <div className={`flex flex-col items-center justify-center min-h-dvh ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                <div className={`container max-w-4xl mx-auto mt-10 p-8 rounded-2xl shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Avatar Section */}
                        <div className="col-span-1 flex flex-col items-center text-center">
                            <div className={`${theme === 'light' ? 'bg-teal-100' : 'bg-teal-900'} w-36 h-36 flex items-center justify-center rounded-full mb-4`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user text-teal-500">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                </svg>
                            </div>
                            <p className={`text-xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>{form.values.name || 'Your Name'}</p>
                            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {form.values.address && `${form.values.address}, ${form.values.city}, ${form.values.state}, ${form.values.pincode}`}
                            </p>
                        </div>

                        {/* Profile Form Section */}
                        <form onSubmit={form.onSubmit(() => handleSubmit())} className="col-span-2">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextInput
                                        label="Name"
                                        placeholder="Name"
                                        {...form.getInputProps('name')}
                                        classNames={{
                                            input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                            label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                        }}
                                    />
                                    <TextInput
                                        label="Email"
                                        placeholder="Email"
                                        disabled
                                        {...form.getInputProps('email')}
                                        classNames={{
                                            input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                            label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                        }}
                                    />
                                </div>
                                <NumberInput
                                    label="Phone"
                                    placeholder="Phone"
                                    hideControls
                                    {...form.getInputProps('phone')}
                                    onChange={(value) => form.setFieldValue('phone', value?.toString() || '')}
                                    classNames={{
                                        input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                        label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                    }}
                                />
                                <Textarea
                                    label="Address"
                                    placeholder="Address"
                                    {...form.getInputProps('address')}
                                    classNames={{
                                        input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                        label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                    }}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextInput
                                        label="City"
                                        placeholder="City"
                                        {...form.getInputProps('city')}
                                        classNames={{
                                            input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                            label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                        }}
                                    />
                                    <TextInput
                                        label="State"
                                        placeholder="State"
                                        {...form.getInputProps('state')}
                                        classNames={{
                                            input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                            label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextInput
                                        label="Country"
                                        placeholder="Country"
                                        {...form.getInputProps('country')}
                                        classNames={{
                                            input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                            label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                        }}
                                    />
                                    <TextInput
                                        label="Pincode"
                                        placeholder="Pincode"
                                        {...form.getInputProps('pincode')}
                                        classNames={{
                                            input: theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white',
                                            label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                                        }}
                                    />
                                </div>
                                <Button
                                    className="mt-6 w-full md:w-auto"
                                    type="submit"
                                    style={{ backgroundColor: '#0d9488' }}
                                    loading={loading}
                                >
                                    Update
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfilePage;
