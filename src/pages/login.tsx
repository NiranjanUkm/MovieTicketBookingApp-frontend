import { upperFirst, useToggle } from '@mantine/hooks';
import React, { FC, useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Paper, Group, Stack, TextInput, PasswordInput, Checkbox, Anchor, Button, Text, PaperProps } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface LoginPageProps extends PaperProps {}

const LoginPage: FC<LoginPageProps> = ({ ...props }) => {
    const [type, toggle] = useToggle(['login', 'register']);
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);
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
            terms: true,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            if (type === 'login') {
                const { email, password } = form.values;
                const response = await axios.post('http://localhost:4001/users/login', { email, password });
                const { isAdmin, token } = response.data;

                localStorage.setItem('token', token);
                setIsLoggedIn(true);

                const redirectTo = location.state?.from?.pathname || '/';
                if (isAdmin) {
                    navigate('/app');
                } else {
                    navigate(redirectTo);
                }
            } else {
                const { email, username, password, confirmPassword } = form.values;
                const response = await axios.post('http://localhost:4001/users/register', {
                    email,
                    username,
                    password,
                    confirmPassword,
                    isAdmin: false,
                });

                // Retrieve token from response and log the user in
                const { token } = response.data;
                localStorage.setItem('token', token);
                setIsLoggedIn(true);

                // Redirect to user home after registration
                const redirectTo = location.state?.from?.pathname || '/';
                navigate(redirectTo);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <React.Fragment>
            <div className='flex h-dvh items-center justify-center'>
                <Paper radius="md" p="xl" withBorder {...props}>
                    <Text size="lg" fw={500}>
                        Welcome to Movie Booking, Please {type}
                    </Text>

                    {error && (
                        <Text color="red" size="sm" mt="md">
                            {error}
                        </Text>
                    )}

                    <form onSubmit={form.onSubmit(() => { handleSubmit() })}>
                        <Stack>
                            {type === 'register' && (
                                <TextInput
                                    label="Username"
                                    placeholder="Your username"
                                    value={form.values.username}
                                    onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                                    radius="md"
                                />
                            )}

                            <TextInput
                                required
                                label="Email"
                                placeholder="hello@mantine.dev"
                                value={form.values.email}
                                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                                error={form.errors.email && 'Invalid email'}
                                radius="md"
                            />

                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                value={form.values.password}
                                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                                error={form.errors.password && 'Password should include at least 6 characters'}
                                radius="md"
                            />

                            {type === 'register' && (
                                <PasswordInput
                                    required
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    value={form.values.confirmPassword}
                                    onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
                                    radius="md"
                                />
                            )}

                            {type === 'register' && (
                                <Checkbox
                                    label="I accept terms and conditions"
                                    checked={form.values.terms}
                                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
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
                                    <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                                        {type === 'register'
                                            ? 'Already have an account? Login'
                                            : "Don't have an account? Register"}
                                    </Anchor>
                                    <Button type="submit" radius="xl" disabled={loading}>
                                        {upperFirst(type)}
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
