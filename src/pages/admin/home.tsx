import React, { FC } from 'react';
import CountCard from '../../components/card-1';
import { Table } from '@mantine/core';

interface HomePageProps {

}

const HomePage: FC<HomePageProps> = ({ }) => {
    const cards = [
        {
            title: 'Total Movies',
            count: 250
        },
        {
            title: 'Total Bookings',
            count: 45569
        },
        {
            title: 'Total Theatres',
            count: 156
        }
    ]

    const movieTable = [
        {
            name: 'Deadpool and Wolverine',
            language: 10,
            subtitle: true,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Red Notice',
            language: 10,
            subtitle: true,
            updatedAt: '2021-09-01'
        },
        {
            name: 'The Eternals',
            language: 11,
            subtitle: true,
            updatedAt: '2021-09-01'
        },
        {
            name: 'The Batman',
            language: 15,
            subtitle: false,
            updatedAt: '2021-09-01'
        },
        {
            name: 'The Flash',
            language: 9,
            subtitle: true,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Avengers: Endgame',
            language: 12,
            subtitle: false,
            updatedAt: '2021-09-01'
        }
    ]

    const cityTable = [
        {
            name: 'Mumbai',
            theaterCount: 10,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Delhi',
            theaterCount: 10,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Bangalore',
            theaterCount: 11,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Chennai',
            theaterCount: 15,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Kolkata',
            theaterCount: 9,
            updatedAt: '2021-09-01'
        },
        {
            name: 'Jaipur',
            theaterCount: 12,
            updatedAt: '2021-09-01'
        }
    ]
    return (
        <React.Fragment>
            <div className='flex flex-col gap-7'>
                <div className="grid grid-cols-12 gap-5">
                    {
                        cards.map((card, index) => (
                            <div key={index} className="col-span-12 md:col-span-3">
                                <CountCard title={card.title} count={card.count} />
                            </div>
                        ))
                    }
                </div>
                <div>
                    <h3 className='text-2xl font-semibold mb-2'>Running movies</h3>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>No.</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Language</Table.Th>
                                <Table.Th>Subtitle</Table.Th>
                                <Table.Th>Update At</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                movieTable.map((movie, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{index + 1}</Table.Td>
                                        <Table.Td>{movie.name}</Table.Td>
                                        <Table.Td>{movie.language}</Table.Td>
                                        <Table.Td>{movie.subtitle ? 'Yes' : 'No'}</Table.Td>
                                        <Table.Td>{movie.updatedAt}</Table.Td>
                                    </Table.Tr>
                                ))
                            }
                        </Table.Tbody>
                    </Table>
                </div>

                <div>
                    <h3 className='text-2xl font-semibold mb-2'>Total Cities</h3>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>No.</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Theater count</Table.Th>
                                <Table.Th>Update At</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                cityTable.map((movie, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{index + 1}</Table.Td>
                                        <Table.Td>{movie.name}</Table.Td>
                                        <Table.Td>{movie.theaterCount}</Table.Td>
                                        <Table.Td>{movie.updatedAt}</Table.Td>
                                    </Table.Tr>
                                ))
                            }
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
        </React.Fragment>
    );
};

export default HomePage;