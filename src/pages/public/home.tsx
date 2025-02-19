import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landing';
import DetailsPage from './detail';
import PaymentPage from './payment';
import ProfilePage from './profile';
import SeatPage from './seat';
import SlotPage from './slot';
import Navbar from '../../components/navbar';
import FooterLinks from '../../components/footer';
import { useTheme } from '../../components/ThemeContext'; // Import useTheme
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = ({ }) => {
  const { theme } = useTheme(); // Use the theme context

  return (
    <React.Fragment>
      <div className={`min-h-dvh ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/details/:id' element={<DetailsPage />} />
          <Route path='/payment/:id' element={<PaymentPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/seat/:date/:theater/:slot' element={<SeatPage />} />
          <Route path='/slot/:id' element={<SlotPage />} />
          <Route path='/payment-success' element={<PaymentSuccess/>} />
          <Route path='/payment-failed' element={<PaymentFailed/>} />
        </Routes>
        <FooterLinks />
      </div>
    </React.Fragment>
  );
};

export default HomePage;