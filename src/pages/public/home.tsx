import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landing';
import DetailsPage from './detail';
import PaymentPage from './payment';
import ProfilePage from './profile';
import SeatPage from './seat';
import SlotPage from './slot';
import Navbar from '../../components/navbar';

interface HomePageProps {

}

const HomePage: FC<HomePageProps> = ({ }) => {
    return (
        <React.Fragment>
            <div className='bg-gray-100 min-h-dvh'>
                <Navbar />
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/details/:id' element={<DetailsPage />} />
                    <Route path='/payment/:id' element={<PaymentPage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/seat/:date/:theater/:slot' element={<SeatPage />} />
                    <Route path='/slot/:id' element={<SlotPage />} />
                </Routes>
            </div>
        </React.Fragment>
    );
};

export default HomePage;