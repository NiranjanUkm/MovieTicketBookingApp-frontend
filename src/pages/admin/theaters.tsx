import { Button, Table, Modal, TextInput, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState, FC } from 'react';
import axios from 'axios';

interface City {
    _id: string;
    name: string;
}

interface Movie {
    _id: string;
    title: string;
}

interface Theater {
    _id: string;
    name: string;
    city: string;
    ticketPrice: number;
    beverage: boolean;
    runningMovies: string[];
    updatedAt: string;
}

const TheatersPage: FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [cities, setCities] = useState<City[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [theaters, setTheaters] = useState<Theater[]>([]);

    const form = useForm({
        initialValues: {
            name: '',
            city: '',
            ticketPrice: 0,
            beverage: '', // Initialize as an empty string
            runningMovies: [] as string[],
        },
        validate: {
            name: (value) => (value.length > 0 ? null : 'Name is required'),
            city: (value) => (value.length > 0 ? null : 'City is required'),
            ticketPrice: (value) => (value > 0 ? null : 'Ticket price is required'),
            beverage: (value) => (value === 'true' || value === 'false' ? null : 'Beverage is required'),
            runningMovies: (value) => (value.length > 0 ? null : 'At least one movie is required'),
        },
    });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get<City[]>('https://cinehub-backend.onrender.com/cities/getCity');
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get<Movie[]>('https://cinehub-backend.onrender.com/movies/getMovie');
                setMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, []);

    const fetchTheaters = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<Theater[]>('https://cinehub-backend.onrender.com/theatres/getTheatre', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTheaters(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching theaters:", error);
            setTheaters([]);
        }
    };

    useEffect(() => {
        fetchTheaters();
    }, []);

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...values,
                beverage: values.beverage === 'true', // Convert to boolean
            };
            await axios.post(
                'https://cinehub-backend.onrender.com/theatres/addTheatre',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            close();
            form.reset();
            await fetchTheaters();
        } catch (error) {
            console.error("Error saving theater:", error);
        }
    };
    

    return (
        <React.Fragment>
            <div>
                <div className='flex items-center justify-between'>
                    <h3 className='text-2xl font-semibold mb-2'>Total Theatres</h3>
                    <Button variant='primary' size='xs' onClick={open}>Add Theatre</Button>
                </div>
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>No.</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>City</Table.Th>
                            <Table.Th>Ticket Price</Table.Th>
                            <Table.Th>Running Movies</Table.Th>
                            <Table.Th>Beverage</Table.Th>
                            <Table.Th>Updated At</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {theaters.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={8}>No theaters available.</Table.Td>
                            </Table.Tr>
                        ) : (
                            theaters.map((theater, index) => (
                                <Table.Tr key={theater._id}>
                                    <Table.Td>{index + 1}</Table.Td>
                                    <Table.Td>{theater.name}</Table.Td>
                                    {/* Find city by ID and display name */}
                                    <Table.Td>{cities.find(city => city._id === theater.city)?.name || 'Unknown City'}</Table.Td>
                                    <Table.Td>{theater.ticketPrice}</Table.Td>
                                    {/* Map movie IDs to titles */}
                                    <Table.Td>
                                        {theater.runningMovies && theater.runningMovies.length > 0 ? (
                                            theater.runningMovies.map((movieId) => {
                                                const movie = movies.find(m => m._id === movieId);
                                                return <div key={movieId}>{movie ? movie.title : 'Unknown Movie'}</div>;
                                            })
                                        ) : (
                                            <div>No running movies</div>
                                        )}
                                    </Table.Td>
                                    {/* Convert boolean beverage to Yes/No */}
                                    <Table.Td>{theater.beverage ? 'Yes' : 'No'}</Table.Td>
                                    <Table.Td>{theater.updatedAt}</Table.Td>
                                    <Table.Td className='flex items-center gap-2'>
                                        <Button variant='light' size='xs' onClick={open}>Edit</Button>
                                        <Button variant='light' size='xs' color='red'>Delete</Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </div>

            <Modal opened={opened} onClose={close} title={<p className='text-lg font-semibold'>Add Theater</p>} size={'lg'}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className="col-span-12 md:col-span-6">
                            <TextInput label='Theater name' placeholder='Theater name' {...form.getInputProps('name')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select label='Select city' placeholder='City name' data={cities.map(city => ({ value: city._id, label: city.name }))} {...form.getInputProps('city')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <NumberInput label='Ticket price' placeholder='Ticket price' hideControls {...form.getInputProps('ticketPrice')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select label='Beverages available' placeholder='Beverages' data={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]} {...form.getInputProps('beverage')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select
                                label='Running movies'
                                placeholder='Select movies'
                                multiple
                                data={movies.map(movie => ({ value: movie._id, label: movie.title }))}
                                {...form.getInputProps('runningMovies')}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end mt-6'>
                        <Button type='submit'>Submit</Button>
                    </div>
                </form>
            </Modal>
        </React.Fragment>
    );
};

export default TheatersPage;
