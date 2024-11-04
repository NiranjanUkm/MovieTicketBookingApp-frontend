import { Button, Modal, Table, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface City {
  _id: string;
  name: string;
  description: string;
  updatedAt: string;
  theatres: { name: string }[]; // Include theatres array with name property
}

const CitiesPage: FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [cities, setCities] = useState<City[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      description: ''
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      description: (value) => (value.trim().length > 0 ? null : 'Description is required')
    }
  });

  // Fetch cities from backend
  const fetchCities = async () => {
    try {
      const response = await axios.get('https://cinehub-backend.onrender.com/cities/getCity'); // Adjust endpoint as necessary
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Handle city addition
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4001/cities/addCity', form.values); // Adjust endpoint as necessary
      setCities([...cities, response.data.city]); // Update cities list with new city
      form.reset();
      close();
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  useEffect(() => {
    fetchCities(); // Fetch cities on component mount
  }, []);

  return (
    <React.Fragment>
      <div>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-semibold mb-2'>Total Cities</h3>
          <Button variant='primary' size='xs' onClick={open}>Add City</Button>
        </div>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Theaters</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {cities.map((city, index) => (
              <Table.Tr key={city._id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{city.name}</Table.Td>
                <Table.Td>
                  {city.theatres.length > 0 ? (
                    city.theatres.map((theatre, i) => (
                      <div key={i}>{theatre.name}</div>
                    ))
                  ) : (
                    <div>No theatres available</div>
                  )}
                </Table.Td>
                <Table.Td>{city.description}</Table.Td>
                <Table.Td>{new Date(city.updatedAt).toLocaleDateString()}</Table.Td>
                <Table.Td className='flex items-center gap-2'>
                  <Button variant='light' size='xs'>Edit</Button>
                  <Button variant='light' size='xs' color='red'>Delete</Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <Modal opened={opened} onClose={close} title={<p className='text-lg font-semibold'>Add city details</p>} size={'lg'}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className='grid grid-cols-12 gap-5'>
            <div className="col-span-12">
              <TextInput label='City name' placeholder='City name' {...form.getInputProps('name')} />
            </div>
            <div className="col-span-12">
              <Textarea label='Description' placeholder='Description' {...form.getInputProps('description')} />
            </div>
          </div>
          <div className="flex items-center justify-end mt-5">
            <Button variant='primary' type='submit'>Save</Button>
          </div>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default CitiesPage;
