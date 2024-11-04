import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Select, FileInput, Table, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

interface Movie {
    _id: string;
    title: string;
    language: string;
    genre: string[];
    isSubtitle: string;
    subtitle?: string;
    updatedAt: string;
}

const languages = ['English', 'Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Telugu'];
const genres = ['Sci-Fi', 'Thriller', 'Comedy', 'Rom-Com', 'Romance'];

const MoviesPage: React.FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [tableData, setTableData] = useState<Movie[]>([]);

    const form = useForm({
        initialValues: {
            title: '',
            language: '',
            genre: [] as string[],
            isSubtitle: 'false',
            subtitle: '',
            description: '',
            poster: null as File | null,
        },
        validate: {
            title: (value) => (value.trim().length > 0 ? null : 'Title is required'),
            language: (value) => (value ? null : 'Language is required'),
            genre: (value) => (value.length > 0 ? null : 'Genre is required'),
            description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
            poster: (value) => (value ? null : 'Poster is required'),
        },
    });

    const fetchMovies = async () => {
        try {
            const response = await axios.get('https://cinehub-backend.onrender.com/movies/getMovie');
            setTableData(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('title', form.values.title);
            formData.append('language', form.values.language);
            formData.append('genre', JSON.stringify(form.values.genre));
            formData.append('isSubtitle', form.values.isSubtitle);
            formData.append('subtitle', form.values.isSubtitle === 'true' ? form.values.subtitle || '' : '');
            formData.append('description', form.values.description);
            if (form.values.poster) {
                formData.append('poster', form.values.poster);
            }

            const response = await axios.post('https://cinehub-backend.onrender.com/movies/addMovie', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 201) {
                const savedMovie = response.data.movie;
                setTableData((prev) => [...prev, savedMovie]);
                close();
                form.reset();
            } else {
                console.error('Error adding movie');
            }
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <React.Fragment>
            <div>
                <div className='flex items-center justify-between'>
                    <h3 className='text-2xl font-semibold mb-2'>Total Movies</h3>
                    <Button variant='primary' size='xs' onClick={open}>Add Movie</Button>
                </div>

                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>No.</Table.Th>
                            <Table.Th>Title</Table.Th>
                            <Table.Th>Language</Table.Th>
                            <Table.Th>Genre</Table.Th>
                            <Table.Th>Subtitle</Table.Th>
                            <Table.Th>Updated At</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {tableData.map((movie, index) => (
                            <Table.Tr key={movie._id}>
                                <Table.Td>{index + 1}</Table.Td>
                                <Table.Td>{movie.title}</Table.Td>
                                <Table.Td>{movie.language}</Table.Td>
                                <Table.Td>{movie.genre.join(', ')}</Table.Td>
                                <Table.Td>{movie.isSubtitle === 'true' ? 'Yes' : 'No'}</Table.Td>
                                <Table.Td>{new Date(movie.updatedAt).toLocaleDateString()}</Table.Td>
                                <Table.Td className="flex items-center gap-2">
                                    <Button variant="light" size="xs" color="red" onClick={() => console.log(`Delete ${movie._id}`)}>Delete</Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>

            <Modal opened={opened} onClose={close} title={<p className='text-lg font-semibold'>Add Movie Details</p>} size={'lg'}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className="col-span-12">
                            <TextInput label='Movie Title' placeholder='Enter movie title' {...form.getInputProps('title')} />
                        </div>
                        <div className="col-span-12">
                            <Select label="Language" placeholder="Select language" data={languages} {...form.getInputProps('language')} />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Genre"
                                placeholder="Select genres"
                                data={genres.map((genre) => ({ value: genre, label: genre }))}
                                {...form.getInputProps('genre')}
                                searchable
                                clearable
                                multiple
                            />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Subtitle available"
                                placeholder="Select value"
                                data={[
                                    { value: 'true', label: 'Yes' },
                                    { value: 'false', label: 'No' },
                                ]}
                                {...form.getInputProps('isSubtitle')}
                                onChange={(value) => {
                                    form.setFieldValue('isSubtitle', value || 'false');
                                    if (value === 'false') {
                                        form.setFieldValue('subtitle', '');
                                    }
                                }}
                            />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Subtitle"
                                placeholder="Select subtitle language"
                                data={languages.map((language) => ({ value: language, label: language }))}
                                {...form.getInputProps('subtitle')}
                                disabled={form.values.isSubtitle !== 'true'}
                            />
                        </div>
                        <div className="col-span-12">
                            <Textarea label='Description' placeholder='Enter description' {...form.getInputProps('description')} />
                        </div>
                        <div className="col-span-12">
                            <FileInput label='Poster' placeholder='Upload poster' {...form.getInputProps('poster')} />
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

export default MoviesPage;
