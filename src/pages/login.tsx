import { upperFirst, useToggle } from "@mantine/hooks";
import React, { FC, useState, useEffect } from "react";
import { useForm } from "@mantine/form";
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
  PaperProps,
  Title,
  Divider,
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginPageProps extends PaperProps {}

const LoginPage: FC<LoginPageProps> = ({ ...props }) => {
  const [type, toggle] = useToggle(["login", "register"]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const handleSubmit = async () => {
    setLoading(true);

    if (type === "login") {
      const { email, password } = form.values;

      try {
        const response = await axios.post("http://localhost:4001/users/login", {
          email,
          password,
        });

        if (response.data && response.data.token) {
          const { isAdmin, token } = response.data;

          localStorage.setItem("token", token);
          setIsLoggedIn(true);
          toast.success("Login successful");

          const redirectTo = location.state?.from?.pathname || "/";
          if (isAdmin) {
            navigate("/app");
          } else {
            navigate(redirectTo);
          }
        } else {
          toast.error("Invalid login credentials");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      const { email, username, password, confirmPassword, terms } = form.values;

      if (!/^\S+@\S+$/.test(email)) {
        toast.error("Invalid email");
        setLoading(false);
        return;
      }

      if (password.length <= 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!terms) {
        toast.error("You must accept the terms and conditions");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("http://localhost:4001/users/register", {
          email,
          username,
          password,
          confirmPassword,
          isAdmin: false,
        });

        if (response.data && response.data.token) {
          const { token } = response.data;

          localStorage.setItem("token", token);
          setIsLoggedIn(true);
          toast.success("Registration successful");

          const redirectTo = location.state?.from?.pathname || "/";
          navigate(redirectTo);
        } else {
          toast.error("Registration failed");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleFormType = () => {
    toggle();
    form.reset();
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div
        className="flex h-screen items-center justify-center bg-gray-900"
        style={{
          backgroundImage: "radial-gradient(circle at 10px 10px, #4b5563 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundColor: "#1f2937", // Dark gray base
        }}
      >
        <Paper
          radius="lg"
          p="xl"
          withBorder
          shadow="md"
          className="w-full max-w-md relative overflow-hidden"
          style={{
            border: "1px solid #0d9488",
            background: "linear-gradient(145deg, #374151, #1f2937)", // Dark gradient
          }}
          {...props}
        >
          {/* Decorative Header */}
          <div className="text-center mb-6">
            <Title order={2} c="teal.4" fw={700}>
              CineHub
            </Title>
            <Text size="md" c="gray.4" mt="xs">
              {type === "login" ? "Welcome Back!" : "Join the Movie Magic"}
            </Text>
          </div>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {type === "register" && (
                <TextInput
                  label={<Text c="gray.3">Username</Text>}
                  placeholder="Your username"
                  value={form.values.username}
                  onChange={(event) => form.setFieldValue("username", event.currentTarget.value)}
                  radius="md"
                  variant="filled"
                  size="md"
                  className="focus:ring-2 focus:ring-teal-500"
                  styles={{
                    input: { backgroundColor: "#4b5563", color: "#e5e7eb" },
                  }}
                />
              )}

              <TextInput
                required
                label={<Text c="gray.3">Email</Text>}
                placeholder="hello@example.com"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                radius="md"
                variant="filled"
                size="md"
                className="focus:ring-2 focus:ring-teal-500"
                styles={{
                  input: { backgroundColor: "#4b5563", color: "#e5e7eb" },
                }}
              />

              <PasswordInput
                required
                label={<Text c="gray.3">Password</Text>}
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                radius="md"
                variant="filled"
                size="md"
                className="focus:ring-2 focus:ring-teal-500"
                styles={{
                  input: { backgroundColor: "#4b5563", color: "#e5e7eb" },
                }}
              />

              {type === "register" && (
                <PasswordInput
                  required
                  label={<Text c="gray.3">Confirm Password</Text>}
                  placeholder="Confirm your password"
                  value={form.values.confirmPassword}
                  onChange={(event) => form.setFieldValue("confirmPassword", event.currentTarget.value)}
                  radius="md"
                  variant="filled"
                  size="md"
                  className="focus:ring-2 focus:ring-teal-500"
                  styles={{
                    input: { backgroundColor: "#4b5563", color: "#e5e7eb" },
                  }}
                />
              )}

              {type === "register" && (
                <Checkbox
                  label={<Text c="gray.4">I accept terms and conditions</Text>}
                  checked={form.values.terms}
                  onChange={(event) => form.setFieldValue("terms", event.currentTarget.checked)}
                  color="teal"
                  size="sm"
                />
              )}
            </Stack>

            <Divider my="lg" color="gray.7" />

            <Group justify="space-between" mt="md">
              {isLoggedIn ? (
                <>
                  <Text size="sm" c="gray.4">
                    You are logged in
                  </Text>
                  <Button
                    variant="outline"
                    color="red"
                    radius="xl"
                    size="md"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Anchor
                    component="button"
                    type="button"
                    color="teal.4"
                    onClick={toggleFormType}
                    size="sm"
                    className="hover:underline"
                  >
                    {type === "register"
                      ? "Already have an account? Login"
                      : "Don't have an account? Register"}
                  </Anchor>
                  <Button
                    type="submit"
                    radius="xl"
                    size="md"
                    color="teal"
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700 transition-colors"
                  >
                    {loading ? "Submitting..." : upperFirst(type)}
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