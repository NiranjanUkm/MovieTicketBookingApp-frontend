import React, { FC } from 'react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import MovieCard from '../../components/card-2';

interface LandingPageProps {

}

const LandingPage: FC<LandingPageProps> = ({ }) => {
    const movies = [
        {
            id: '123',
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '124',
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '125', // Change ID to be unique
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '126', // Unique ID
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '127', // Unique ID
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '128', // Unique ID
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '129', // Unique ID
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
        {
            id: '130', // Unique ID
            title: 'A.R.M',
            image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
            rating: 9.5
        },
    ];
    
    return (
        <React.Fragment>
            <Carousel withIndicators height={400} loop >
                <Carousel.Slide>
                    <Image src={'/images/banner-1.avif'} />
                </Carousel.Slide>
                <Carousel.Slide>
                    <Image src={'/images/banner-2.avif'} />
                </Carousel.Slide>
            </Carousel>

            <div className='p-3'>
                <p className='font-semibold text-xl mb-2'>Trending now</p>
                <div className='grid grid-cols-6 gap-10'>
                    {
                        movies.map(movie => (
                            <div key={movie.id} className='col-span-1'>
                                <MovieCard id={movie.id} title={movie.title} image={movie.image} rating={movie.rating} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default LandingPage;