import { Button, Image } from '@mantine/core';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface DetailsPageProps {}

const DetailsPage: FC<DetailsPageProps> = ({ }) => {
    const [movie, setMovie] = useState<any>();
    const id = useParams()?.id;
    const navigate = useNavigate();
    const location = useLocation();

    const movies = [
        {
            id: '123',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            title: 'A.R.M',
            rating: 0,
            description: "Set in Northern Kerala across the years 1900, 1950, and 1990, this epic tale follows three generations of heroes Maniyan, Kunjikelu, and Ajayan as they strive to protect the land's most vital treasure.",
            languages: ['Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Hindi'],
        },
        {
            id: '124',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/bougainvillea-et00413069-1727432413.jpg',
            title: 'Bougainvillea',
            rating: 0,
            description: "The film is a gripping psychological thriller that follows a family entangled in a police investigation surrounding the mysterious disappearance of tourists in Kerala.",
            languages: ['Malayalam', 'Tamil'],
        },
        {
            id: '125',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/bougainvillea-et00413069-1727432413.jpg',
            title: 'Bougainvillea',
            rating: 0,
            description: "The film is a gripping psychological thriller that follows a family entangled in a police investigation surrounding the mysterious disappearance of tourists in Kerala.",
            languages: ['Malayalam', 'Tamil'],
        }
    ];

    useEffect(() => {
        const movie = movies.find(movie => movie.id === id);
        setMovie(movie);
    }, [id]);

    const handleBookNow = () => {
        const token = localStorage.getItem('token'); // Check if the user is logged in
        if (token) {
            navigate(`/slot/${movie.id}`); // Navigate to booking page if logged in
        } else {
            // Redirect to login page and pass the current location to redirect back after login
            navigate('/login', { state: { from: location } }); 
        }
    };
    
    // const handleBookNow = () => {
    //     const token = localStorage.getItem('token'); // Check if the user is logged in
    //     if (token) {
    //         navigate(`/login`); // Navigate to booking page if logged in
    //     } else {
    //         navigate('/slot/${movie.id}'); // Redirect to login page if not logged in
    //     }
    // };

    return (
        <React.Fragment>
            <div className='flex justify-center min-h-dvh bg-gray-100 mt-5'>
                <div className='container'>
                    <div className='bg-white rounded-3xl p-4'>
                        <div className='grid grid-cols-12 gap-7'>
                            <div className='col-span-2 h-72 rounded-2xl overflow-hidden'>
                                <Image src={movie?.image} alt={movie?.title} className='col-span-12 md:col-span-4 w-full h-full object-cover' />
                            </div>
                            <div className='col-span-8 flex flex-col h-full justify-end'>
                                <p className='font-semibold text-2xl mb-2'>{movie?.title}</p>
                                <p className='text-gray-500 mb-2'>{movie?.description}</p>
                                <div className='flex gap-2'>
                                    {
                                        movie?.languages.map((language: string) => (
                                            <span key={language} className='bg-gray-100 px-2 py-1 rounded-md'>{language}</span>
                                        ))
                                    }
                                </div>
                                <Button className='mt-4' w={200} color='#0d9488' onClick={handleBookNow}>
                                    Book now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default DetailsPage;
