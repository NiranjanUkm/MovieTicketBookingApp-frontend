import { Button, Table, Modal, TextInput, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { FC } from 'react';

interface TheatersPageProps {

}

const TheatersPage: FC<TheatersPageProps> = ({ }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            name: '',
            city: '',
            ticketPrice: 0,
            beverage: 'true',
        },
        validate: {
            name: (value) => value.length > 0 ? null : 'Name is required',
            city: (value) => value.length > 0 ? null : 'City is required',
            ticketPrice: (value) => value > 0 ? null : 'Ticket price is required',
            beverage: (value) => (value === 'true' || value === 'false') ? null : 'Beverage is required',
        }
    })

    const table = [
        {
            name: 'PVR Cinemas',
            city: 'Mumbai',
            ticketPrice: 250,
            runningMovies: [
                'Deadpool and Wolverine', 'Red Notice', 'The Eternals'
            ],
            beverage: true,
            updatedAt: '2021-09-01'
        },
        {
            name: 'INOX Cinemas',
            city: 'Mumbai',
            ticketPrice: 300,
            runningMovies: [
                'The Batman', 'The Flash', 'Avengers: Endgame'
            ],
            beverage: true,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Cinepolis',
            city: 'Mumbai',
            ticketPrice: 200,
            runningMovies: [
                'Deadpool and Wolverine', 'Red Notice', 'The Eternals'
            ],
            beverage: true,
            updatedAt: '2021-09-01',
        }
    ]

    const cities = [
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Bangalore', label: 'Bangalore' },
        { value: 'Chennai', label: 'Chennai' },
        { value: 'Kolkata', label: 'Kolkata' },
    ]

    const beverages = [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
    ]

    const handleSubmit = async () => {
        console.log(form.values)
    }

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
                            <Table.Th>Update At</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {
                            table.map((theater, index) => (
                                <Table.Tr key={index}>
                                    <Table.Td>{index + 1}</Table.Td>
                                    <Table.Td>{theater.name}</Table.Td>
                                    <Table.Td>{theater.city}</Table.Td>
                                    <Table.Td>{theater.ticketPrice}</Table.Td>
                                    <Table.Td>
                                        {
                                            theater.runningMovies.map((movie, index) => (
                                                <div key={index}>{movie}</div>
                                            ))
                                        }
                                    </Table.Td>
                                    <Table.Td>{theater.beverage ? 'Yes' : 'No'}</Table.Td>
                                    <Table.Td>{theater.updatedAt}</Table.Td>
                                    <Table.Td className='flex items-center gap-2'>
                                        <Button variant='light' size='xs' onClick={open}>Edit</Button>
                                        <Button variant='light' size='xs' color='red'>Delete</Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        }
                    </Table.Tbody>
                </Table>
            </div>

            <Modal opened={opened} onClose={close} title={<p className='text-lg font-semibold'>Edit city details</p>} size={'lg'}>
                <form onSubmit={form.onSubmit(() => { handleSubmit() })}>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className="col-span-12 md:col-span-6">
                            <TextInput label='Theater name' placeholder='Theater name' {...form.getInputProps('name')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select label='Select city' placeholder='City name' data={cities} {...form.getInputProps('city')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <NumberInput label='Ticket price' placeholder='Ticket price' hideControls {...form.getInputProps('ticketPrice')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select label='Beverages available' placeholder='Beverages' data={beverages} {...form.getInputProps('beverage')} />
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

export default TheatersPage;