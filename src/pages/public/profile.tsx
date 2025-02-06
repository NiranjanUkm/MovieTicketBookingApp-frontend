import { Button, NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { FC } from 'react';
import { useTheme } from '../../components/ThemeContext'; // Import useTheme

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = ({ }) => {
    const { theme } = useTheme(); // Use the theme context
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

    const handleSubmit = async () => {
        console.log(form.values);
    };

    return (
        <React.Fragment>
            <div className={`flex flex-col items-center justify-center min-h-dvh ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                <div className={`container mt-5 grid grid-cols-12 rounded-2xl p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <div className="col-span-3 flex flex-col items-center text-center">
                        <div className={`${theme === 'light' ? 'bg-teal-100' : 'bg-teal-900'} w-36 h-36 flex items-center justify-center rounded-full`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user text-teal-500">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            </svg>
                        </div>
                        <p className={`text-xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>Niranjan UKM</p>
                        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Pever House, Chelakkara,<br />Thirssur, 680591</p>
                    </div>
                    <form onSubmit={form.onSubmit(() => handleSubmit())} className="col-span-9">
                        <div className='grid grid-cols-3 gap-5'>
                            <TextInput
                                label='Name'
                                placeholder='Name'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('name')}
                            />
                            <TextInput
                                label='Email'
                                placeholder='Email'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('email')}
                            />
                            <NumberInput
                                hideControls
                                label='Phone'
                                placeholder='Phone'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('phone')}
                            />
                        </div>
                        <Textarea
                            label='Address'
                            placeholder='Address'
                            className='mb-4'
                            styles={{
                                label: { color: theme === 'light' ? '#000' : '#fff' },
                                input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                            }}
                            {...form.getInputProps('address')}
                        />
                        <div className='grid grid-cols-2 gap-5'>
                            <TextInput
                                label='City'
                                placeholder='City'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('city')}
                            />
                            <TextInput
                                label='State'
                                placeholder='State'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('state')}
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-5'>
                            <TextInput
                                label='Country'
                                placeholder='Country'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('country')}
                            />
                            <TextInput
                                label='Pincode'
                                placeholder='Pincode'
                                className='mb-4'
                                styles={{
                                    label: { color: theme === 'light' ? '#000' : '#fff' },
                                    input: { backgroundColor: theme === 'light' ? '#fff' : '#374151', color: theme === 'light' ? '#000' : '#fff' }
                                }}
                                {...form.getInputProps('pincode')}
                            />
                        </div>
                        <Button className='mt-4' type='submit' style={{ backgroundColor: '#0d9488' }}>
                            Update
                        </Button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfilePage;