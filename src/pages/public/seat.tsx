import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../components/ThemeContext'; // Import useTheme

interface SeatPageProps {}

const SeatPage: FC<SeatPageProps> = ({ }) => {
    const { theme } = useTheme(); // Use the theme context
    const bookingDetails = useParams();
    const [opened, { open, close }] = useDisclosure(false);
    const [seating, setSeating] = useState<any[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const generateSeatingGrid = (rows: number, cols: number) => {
        const seating = [];
        const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < rows; i++) {
            for (let j = 1; j <= cols; j++) {
                seating.push({
                    status: 'available',
                    id: `${rowLetters[i]}${j}`,
                });
            }
        }
        return seating;
    };

    useEffect(() => {
        setSeating(generateSeatingGrid(7, 7));
    }, []);

    const handleSeatSelection = (seatId: string) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatId)
                ? prevSelectedSeats.filter((id) => id !== seatId)
                : [...prevSelectedSeats, seatId]
        );
    };

    const getSeatColor = (seat: any) => {
        if (seat.status === 'unavailable') {
            return theme === 'light' ? 'bg-black' : 'bg-gray-700';
        } else if (selectedSeats.includes(seat.id)) {
            return 'bg-teal-500';
        } else {
            return theme === 'light' ? 'bg-gray-400' : 'bg-gray-600';
        }
    };

    const theaters = [
        {
            name: 'PVR',
            id: '123',
            description: 'Beverages, Snacks, Recliner Seats',
            slots: [
                { id: '123', time: '10:00 AM', description: 'Dolby 5.1' },
                { id: '124', time: '1:00 PM', description: 'Dolby 5.1' },
                { id: '125', time: '4:00 PM' },
                { id: '126', time: '7:00 PM' },
                { id: '127', time: '10:00 PM' },
            ],
        },
        {
            name: 'PVR',
            id: '123',
            description: 'Beverages, Snacks, Recliner Seats',
            slots: [
                { id: '123', time: '10:00 AM', description: 'Dolby 5.1' },
                { id: '124', time: '1:00 PM', description: 'Dolby 5.1' },
                { id: '125', time: '4:00 PM', description: 'Dolby 5.1' },
                { id: '126', time: '7:00 PM' },
                { id: '127', time: '10:00 PM' },
            ],
        },
    ];

    const dates = [
        { id: '123', day: 'Mon', date: '22 July' },
        { id: '124', day: 'Tue', date: '23 July' },
        { id: '125', day: 'Wed', date: '24 July' },
    ];

    return (
        <React.Fragment>
            <div className={`flex items-center flex-col justify-center mt-5 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                <div className={`container rounded-2xl p-4 flex justify-center items-center flex-col ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <div className="w-full max-w-[30rem] mx-auto my-6">
                        <div className="grid grid-cols-7 gap-2">
                            {seating.map((seat) => (
                                <div
                                    key={seat.id}
                                    className={`w-12 h-12 flex items-center justify-center font-bold ${getSeatColor(seat)} rounded-md cursor-pointer ${
                                        theme === 'light' ? 'text-white' : 'text-gray-100'
                                    }`}
                                    onClick={() => handleSeatSelection(seat.id)}
                                >
                                    {seat.id}
                                </div>
                            ))}
                        </div>
                        <p className={`text-center mt-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>SCREEN HERE</p>
                    </div>

                    <div className={`mt-4 font-semibold text-sm text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                        <h2>Selected Seats:</h2>
                        <p>{selectedSeats.join(', ') || 'None selected'}</p>
                    </div>

                    <Button
                        className='mt-4'
                        w={200}
                        style={{ backgroundColor: '#0d9488' }}
                        disabled={selectedSeats.length <= 0}
                        onClick={open}
                    >
                        Confirm
                    </Button>
                </div>
            </div>

            <Modal
                opened={opened}
                onClose={close}
                title={<p className={`font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>Booking confirmed</p>}
                styles={{
                    content: { backgroundColor: theme === 'light' ? '#fff' : '#374151' },
                    header: { backgroundColor: theme === 'light' ? '#fff' : '#374151' },
                }}
            >
                <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>Booking details</p>
                <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    Theater: <span>{theaters.find((theater) => theater.id === bookingDetails.theater)?.name}</span>
                </p>
                <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    Date: <span>{dates.find((date) => date.id === bookingDetails.date)?.date}</span>
                </p>
                <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    Slot: <span>{theaters.find((theater) => theater.id === bookingDetails.theater)?.slots.find((slot) => slot.id === bookingDetails.slot)?.time}</span>
                </p>
                <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    Seats: <span>{selectedSeats.join(', ')}</span>
                </p>
            </Modal>
        </React.Fragment>
    );
};

export default SeatPage;