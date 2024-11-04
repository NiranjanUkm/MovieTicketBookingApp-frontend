import { Button, Image } from '@mantine/core';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface DetailsPageProps {}

const DetailsPage: FC<DetailsPageProps> = () => {
    const [movie, setMovie] = useState<any>();
    const { id } = useParams<{ id: string }>();
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
            description: "A gripping psychological thriller following a family entangled in a police investigation surrounding the mysterious disappearance of tourists in Kerala.",
            languages: ['Malayalam', 'Tamil'],
        },
        {
            id: '125',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/venom-the-last-dance-et00383474-1729596212.jpg',
            title: 'Venom',
            rating: 0,
            description: "The story of a warrior who must fight his inner and outer battles in an ancient, war-torn kingdom.",
            languages: ['English', 'Hindi'],
        }
    ];

    useEffect(() => {
        const movie = movies.find(movie => movie.id === id);
        setMovie(movie);
    }, [id]);

    const handleBookNow = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`/slot/${movie?.id}`);
        } else {
            navigate('/login', { state: { from: location } });
        }
    };

    return (
        <React.Fragment>
            <div className="flex justify-center min-h-dvh bg-gray-100 mt-5">
                <div className="container">
                    <div className="bg-white rounded-3xl p-4">
                        {/* Desktop layout */}
                        <div className="hidden md:flex gap-7">
                            <div className="w-1/6 h-72 rounded-2xl overflow-hidden">
                                <Image
                                    src={movie?.image}
                                    alt={movie?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                <p className="font-semibold text-2xl mb-2">{movie?.title}</p>
                                <p className="text-gray-500 mb-2">{movie?.description}</p>
                                <div className="flex gap-2">
                                    {movie?.languages.map((language: string) => (
                                        <span key={language} className="bg-gray-100 px-2 py-1 rounded-md">
                                            {language}
                                        </span>
                                    ))}
                                </div>
                                <Button
                                    className="mt-4"
                                    w={200}
                                    style={{ backgroundColor: '#0d9488' }}
                                    onClick={handleBookNow}
                                >
                                    Book now
                                </Button>
                            </div>
                        </div>

                        {/* Mobile layout */}
                        <div className="flex flex-col gap-5 md:hidden">
                            <div className="w-full h-73 rounded-2xl overflow-hidden mb-4">
                                <Image
                                    src={movie?.image}
                                    alt={movie?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-2xl mb-2">{movie?.title}</p>
                                <p className="text-gray-500 mb-2">{movie?.description}</p>
                                <div className="flex gap-2 justify-center">
                                    {movie?.languages.map((language: string) => (
                                        <span key={language} className="bg-gray-100 px-2 py-1 rounded-md">
                                            {language}
                                        </span>
                                    ))}
                                </div>
                                <Button
                                    className="mt-4"
                                    w={200}
                                    style={{ backgroundColor: '#0d9488' }}
                                    onClick={handleBookNow}
                                >
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
