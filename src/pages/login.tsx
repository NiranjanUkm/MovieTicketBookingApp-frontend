import { upperFirst, useToggle } from '@mantine/hooks';
import React, { FC, useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import {
    Paper,
    Group,
    Stack,
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Button,
    Text,
    PaperProps
} from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginPageProps extends PaperProps {}

const LoginPage: FC<LoginPageProps> = ({ ...props }) => {
    const [type, toggle] = useToggle(['login', 'register']);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            terms: false,
        },
    });

    const handleSubmit = async () => {
        setLoading(true);
    
        if (type === 'login') {
            const { email, password } = form.values;
    
            try {
                const response = await axios.post('https://cinehub-backend.onrender.com/users/login', { email, password });
    
                // Check if response data contains expected properties
                if (response.data && response.data.token) {
                    const { isAdmin, token } = response.data;
    
                    localStorage.setItem('token', token);
                    setIsLoggedIn(true);
                    toast.success('Login successful');
    
                    const redirectTo = location.state?.from?.pathname || '/';
                    if (isAdmin) {
                        navigate('/app');
                    } else {
                        navigate(redirectTo);
                    }
                } else {
                    // Handle case where response data is missing expected properties
                    toast.error('Invalid login credentials');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        } else {
            const { email, username, password, confirmPassword, terms } = form.values;

            // Form validation logic
            if (!/^\S+@\S+$/.test(email)) {
                toast.error('Invalid email');
                setLoading(false);
                return;
            }

            if (password.length <= 6) {
                toast.error('Password must be at least 6 characters');
                setLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                setLoading(false);
                return;
            }

            if (!terms) {
                toast.error('You must accept the terms and conditions');
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.post('https://cinehub-backend.onrender.com/users/register', {
                    email,
                    username,
                    password,
                    confirmPassword,
                    isAdmin: false,
                });
    
                // Check if response data contains expected properties
                if (response.data && response.data.token) {
                    const { token } = response.data;
    
                    localStorage.setItem('token', token);
                    setIsLoggedIn(true);
                    toast.success('Registration successful');
    
                    const redirectTo = location.state?.from?.pathname || '/';
                    navigate(redirectTo);
                } else {
                    toast.error('Registration failed');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    const toggleFormType = () => {
        toggle();
        form.reset(); // Reset all form fields when switching between login and register
    };

    return (
        <React.Fragment>
            <ToastContainer />
            <div className='flex h-dvh items-center justify-center'>
                <Paper radius="md" p="xl" withBorder {...props}>
                    <Text size="lg" fw={500}>
                        Welcome to Movie Booking, Please {type}
                    </Text>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            {type === 'register' && (
                                <TextInput
                                    label="Username"
                                    placeholder="Your username"
                                    value={form.values.username}
                                    onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                                    radius="md"
                                    error={form.errors.username}
                                />
                            )}

                            <TextInput
                                required
                                label="Email"
                                placeholder="hello@example.com"
                                value={form.values.email}
                                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                                radius="md"
                                error={form.errors.email}
                            />

                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                value={form.values.password}
                                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                                radius="md"
                                error={form.errors.password}
                            />

                            {type === 'register' && (
                                <PasswordInput
                                    required
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    value={form.values.confirmPassword}
                                    onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
                                    radius="md"
                                    error={form.errors.confirmPassword}
                                />
                            )}

                            {type === 'register' && (
                                <Checkbox
                                    label="I accept terms and conditions"
                                    checked={form.values.terms}
                                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                                    error={form.errors.terms}
                                />
                            )}
                        </Stack>

                        <Group justify="space-between" mt="xl">
                            {isLoggedIn ? (
                                <>
                                    <Text size="sm">You are logged in</Text>
                                    <Button type="button" onClick={handleLogout} radius="xl">
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Anchor component="button" type="button" color="dimmed" onClick={toggleFormType} size="xs">
                                        {type === 'register'
                                            ? 'Already have an account? Login'
                                            : "Don't have an account? Register"}
                                    </Anchor>
                                    <Button type="submit" radius="xl" disabled={loading}>
                                        {loading ? 'Submitting...' : upperFirst(type)}
                                    </Button>
                                </>
                            )}
                        </Group>
                    </form>
                </Paper>
            </div>
        </React.Fragment>
    );
};

export default LoginPage;