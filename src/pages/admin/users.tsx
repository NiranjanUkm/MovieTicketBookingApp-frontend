import React, { FC, useEffect, useState } from 'react';
import { Button, Table, Switch } from '@mantine/core';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  updatedAt: string;
}

const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://cinehub-backend.onrender.com/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  // Toggle user active/inactive status
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://cinehub-backend.onrender.com/users/${userId}/toggle`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <React.Fragment>
      <div>
        <h3 className="text-2xl font-semibold mb-2">User Management</h3>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>No users available.</Table.Td>
              </Table.Tr>
            ) : (
              users.map((user, index) => (
                <Table.Tr key={user._id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>
                    <Switch
                      checked={user.isActive}
                      onChange={() => toggleUserStatus(user._id, user.isActive)}
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color="teal"
                    />
                  </Table.Td>
                  <Table.Td>{new Date(user.updatedAt).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Button variant="light" size="xs" color="red">
                      Delete
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>
    </React.Fragment>
  );
};

export default UsersPage;