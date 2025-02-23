import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Loader,
  Title,
  Container,
  SimpleGrid,
  Badge,
  Group,
  Button,
  useMantineTheme,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import axios from "axios";
import { useTheme } from "../../components/ThemeContext";

interface Order {
  _id: string;
  movieId: string;
  title: string;
  poster: string;
  bookingDate: string;
  seats: string[];
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mantineTheme = useMantineTheme();
  const { theme } = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching orders with token:", token);

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const res = await axios.get("http://localhost:4001/api/orders/getOrder", { // Updated endpoint
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("Orders fetched:", res.data.orders);
      setOrders(res.data.orders || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Failed to fetch orders. Please try again.";
      setError(errorMsg);
      notifications.show({
        title: "Error",
        message: errorMsg,
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    console.log("handleCancelOrder called with orderId:", orderId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      setLoading(true);
      const res = await axios.delete(`http://localhost:4001/api/orders/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("Order cancelled:", res.data);
      notifications.show({
        title: "Success",
        message: "Order cancelled successfully!",
        color: "teal",
        autoClose: 3000,
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error: any) {
      console.error("Error cancelling order:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Failed to cancel order.";
      notifications.show({
        title: "Error",
        message: errorMsg,
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmCancelOrder = (orderId: string, title: string) => {
    console.log("confirmCancelOrder called with:", orderId, title);
    modals.openConfirmModal({
      title: "Confirm Cancellation",
      children: (
        <Text size="sm">
          Are you sure you want to cancel your booking for <strong>{title}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Back" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancellation aborted"),
      onConfirm: () => handleCancelOrder(orderId),
    });
  };

  return (
    <Container size="lg" py="xl" className="min-h-screen">
      <Title order={1} ta="center" mb="xl" c={theme === "light" ? "teal.7" : "teal.3"}>
        🎬 My Orders
      </Title>

      {loading ? (
        <Group justify="center" mt="xl">
          <Loader color="teal" size="lg" />
          <Text c="gray" size="lg">
            Loading your cinematic adventures...
          </Text>
        </Group>
      ) : error ? (
        <Paper
          withBorder
          p="md"
          radius="md"
          bg={theme === "light" ? "red.0" : "red.9"}
          shadow="sm"
        >
          <Text c="red" ta="center" size="lg">
            {error}
          </Text>
        </Paper>
      ) : orders.length === 0 ? (
        <Paper
          withBorder
          p="lg"
          radius="md"
          bg={theme === "light" ? "gray.0" : "gray.8"}
          shadow="sm"
        >
          <Text ta="center" c="gray" size="lg">
            No orders yet. Book your first movie ticket now! 🍿
          </Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg" verticalSpacing="lg">
          {orders.map((order) => (
            <Card
              key={order._id}
              shadow="md"
              radius="lg"
              padding="lg"
              withBorder
              style={{
                backgroundColor: theme === "light" ? "#ffffff" : "#2d2e34",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              <Card.Section>
                <Image
                  src={order.poster}
                  alt={order.title}
                  radius="md"
                  height={250}
                  fit="cover"
                  fallbackSrc="/images/placeholder.jpg"
                  style={{ borderBottom: `1px solid ${mantineTheme.colors.gray[2]}` }}
                />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={700} size="lg" c={theme === "light" ? "gray.9" : "gray.1"}>
                  {order.title}
                </Text>
                <Badge color="teal" variant="light">
                  {order.seats.length} Seat{order.seats.length > 1 ? "s" : ""}
                </Badge>
              </Group>

              <Text size="sm" c="gray">
                <strong>Seats:</strong> {order.seats.join(", ")}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Booked on:{" "}
                {new Date(order.bookingDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>

              <Button
                color="red"
                variant="light"
                size="xs"
                mt="md"
                fullWidth
                onClick={() => confirmCancelOrder(order._id, order.title)}
              >
                Cancel Order
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default MyOrders;