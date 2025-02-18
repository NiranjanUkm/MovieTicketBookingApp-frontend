import React, { FC } from 'react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import MovieCard from '../../components/card-2';
import { useTheme } from '../../components/ThemeContext'; // Import useTheme

interface LandingPageProps {}

const LandingPage: FC<LandingPageProps> = () => {
  const { theme } = useTheme(); // Use the theme context

  const movies = [
    {
        id: '123',
        title: 'A.R.M',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/arm-et00407124-1726144274.jpg',
        rating: 9.5
    },
    {
        id: '124',
        title: 'Bougainvillea',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/bougainvillea-et00413069-1727432413.jpg',
        rating: 9.5
    },
    {
        id: '125',
        title: 'Venom',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/venom-the-last-dance-et00383474-1729596212.jpg',
        rating: 9.5
    },
    {
        id: '126',
        title: 'Vettaiyan',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/vettaiyan-et00379391-1727938465.jpg',
        rating: 9.5
    },
    {
        id: '127',
        title: 'Devara',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/devara--part-1-et00310216-1712750637.jpg',
        rating: 9.5
    },
    {
        id: '128',
        title: 'The Wild Robot',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/the-wild-robot-et00398665-1732271118.jpg',
        rating: 9.5
    },
    {
        id: '129',
        title: 'Pani',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pani-et00404167-1720515291.jpg',
        rating: 9.5
    },
    {
        id: '130',
        title: 'Martin',
        image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/martin-et00328827-1677137256.jpg',
        rating: 9.5
    },
];

  return (
    <React.Fragment>
      <Carousel withIndicators height={400} loop>
        <Carousel.Slide>
          <Image src={'https://assets-in.bmscdn.com/promotions/cms/creatives/1728390794440_bandlanddesktop.jpg'} />
        </Carousel.Slide>
        <Carousel.Slide>
          <Image src={'/images/banner-2.avif'} />
        </Carousel.Slide>
      </Carousel>

      <div className={`p-3 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <p className={`font-semibold text-xl mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Trending now</p>
        <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
          {movies.map((movie) => (
            <div key={movie.id}>
              <MovieCard id={movie.id} title={movie.title} image={movie.image} rating={movie.rating} />
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default LandingPage;