import { Button } from '@mantine/core';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemeContext'; // Import useTheme

interface SlotPageProps {}

const SlotPage: FC<SlotPageProps> = () => {
    const { theme } = useTheme(); // Use the theme context
    const [date, setDate] = React.useState('');
    const [theater, setTheater] = React.useState('');
    const [slot, setSlot] = React.useState('');

    const navigate = useNavigate();

    const theaters = [
        {
            name: 'PVR Cinemas',
            id: 'theater-123',
            description: 'Beverages, Snacks, Recliner Seats',
            slots: [
                { id: 'slot-123', time: '10:00 AM', description: 'Dolby 5.1' },
                { id: 'slot-124', time: '1:00 PM', description: 'Dolby 5.1' },
                { id: 'slot-125', time: '4:00 PM' },
                { id: 'slot-126', time: '7:00 PM' },
                { id: 'slot-127', time: '10:00 PM' },
            ],
        },
        {
            name: 'INOX Cinemas',
            id: 'theater-124',
            description: 'Beverages, Snacks, Recliner Seats',
            slots: [
                { id: 'slot-223', time: '10:00 AM', description: 'Dolby 5.1' },
                { id: 'slot-224', time: '1:00 PM', description: 'Dolby 5.1' },
                { id: 'slot-225', time: '4:00 PM' },
                { id: 'slot-226', time: '7:00 PM' },
                { id: 'slot-227', time: '10:00 PM' },
            ],
        },
    ];

    const dates = [
        { id: 'date-123', day: 'Mon', date: '22 July' },
        { id: 'date-124', day: 'Tue', date: '23 July' },
        { id: 'date-125', day: 'Wed', date: '24 July' },
    ];

    return (
        <React.Fragment>
            <div className={`flex flex-col items-center mt-5 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                <div className='container'>
                    <div className={`mx-auto p-6 rounded-3xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                        <p className={`text-2xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>Title</p>
                        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Language</p>

                        {/* Mobile layout for date selection */}
                        <div className='flex my-3 gap-3 flex-wrap md:hidden'>
                            {dates.map((dateItem) => (
                                <div
                                    key={dateItem.id}
                                    className={`p-3 rounded-lg font-semibold text-center leading-tight text-sm cursor-pointer ${
                                        theme === 'light' ? 'bg-teal-100 text-teal-500' : 'bg-teal-900 text-teal-300'
                                    } ${date === dateItem.id ? (theme === 'light' ? 'bg-teal-200' : 'bg-teal-700') : ''}`}
                                    onClick={() => setDate(dateItem.id)}
                                >
                                    <p>{dateItem.day}</p>
                                    <p>{dateItem.date}</p>
                                </div>
                            ))}
                        </div>

                        {/* Desktop layout for date selection */}
                        <div className='hidden md:flex my-3 gap-3'>
                            {dates.map((dateItem) => (
                                <div
                                    key={dateItem.id}
                                    className={`p-3 rounded-lg font-semibold text-center leading-tight text-sm cursor-pointer ${
                                        theme === 'light' ? 'bg-teal-100 text-teal-500' : 'bg-teal-900 text-teal-300'
                                    } ${date === dateItem.id ? (theme === 'light' ? 'bg-teal-200' : 'bg-teal-700') : ''}`}
                                    onClick={() => setDate(dateItem.id)}
                                >
                                    <p>{dateItem.day}</p>
                                    <p>{dateItem.date}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mobile layout for theater selection */}
                        <div className='flex flex-col gap-4 md:hidden'>
                            {theaters.map((theaterItem) => (
                                <div
                                    key={theaterItem.id}
                                    className={`p-4 rounded-lg shadow-md ${
                                        theme === 'light' ? 'bg-white border border-gray-300' : 'bg-gray-700 border border-gray-600'
                                    }`}
                                    onClick={() => setTheater(theaterItem.id)}
                                >
                                    <p className={`font-semibold text-lg ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                                        {theaterItem.name}
                                    </p>
                                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                        {theaterItem.description}
                                    </p>
                                    <div className='grid grid-cols-2 text-sm text-center gap-2 mt-3'>
                                        {theaterItem.slots.map((slotItem) => (
                                            <div
                                                key={slotItem.id}
                                                className={`p-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition duration-200 ${
                                                    theme === 'light'
                                                        ? 'bg-teal-100 text-teal-500 hover:bg-teal-200'
                                                        : 'bg-teal-900 text-teal-300 hover:bg-teal-700'
                                                } ${slot === slotItem.id ? (theme === 'light' ? 'bg-teal-200' : 'bg-teal-700') : ''}`}
                                                onClick={() => setSlot(slotItem.id)}
                                            >
                                                <p className='font-semibold'>{slotItem.time}</p>
                                                {slotItem.description && (
                                                    <p className={`${theme === 'light' ? 'text-teal-500' : 'text-teal-300'}`}>
                                                        {slotItem.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop layout for theater selection */}
                        <div className='hidden md:flex flex-col gap-3'>
                            {theaters.map((theaterItem) => (
                                <div
                                    key={theaterItem.id}
                                    className={`p-3 rounded-lg grid grid-cols-12 ${
                                        theme === 'light' ? 'bg-white' : 'bg-gray-700'
                                    }`}
                                    onClick={() => setTheater(theaterItem.id)}
                                >
                                    <div className='text-sm col-span-4 flex flex-col justify-center'>
                                        <p className={`font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                                            {theaterItem.name}
                                        </p>
                                        <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {theaterItem.description}
                                        </p>
                                    </div>
                                    <div className='grid grid-cols-6 text-xs text-center gap-3 col-span-6'>
                                        {theaterItem.slots.map((slotItem) => (
                                            <div
                                                key={slotItem.id}
                                                className={`p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                                                    theme === 'light'
                                                        ? 'bg-teal-100 text-teal-500 hover:bg-teal-200'
                                                        : 'bg-teal-900 text-teal-300 hover:bg-teal-700'
                                                } ${slot === slotItem.id ? (theme === 'light' ? 'bg-teal-200' : 'bg-teal-700') : ''}`}
                                                onClick={() => setSlot(slotItem.id)}
                                            >
                                                <p className='font-semibold'>{slotItem.time}</p>
                                                <p className={`${theme === 'light' ? 'text-teal-500' : 'text-teal-300'}`}>
                                                    {slotItem.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`mt-3 ${date && theater && slot ? 'bg-teal-600' : 'bg-teal-400'}`}
                            w={200}
                            onClick={() => {
                                if (date && theater && slot) {
                                    navigate(`/seat/${date}/${theater}/${slot}`);
                                } else {
                                    alert('Please select a date, theater, and slot before proceeding.');
                                }
                            }}
                            style={{ opacity: date && theater && slot ? 1 : 0.5 }}
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SlotPage;