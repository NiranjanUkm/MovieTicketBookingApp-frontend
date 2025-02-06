import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/admin/dashboard';
import LoginPage from './pages/login';
import HomePage from './pages/public/home';
import { ThemeProvider } from './components/themeContext'; // Import ThemeProvider

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path='/*' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='app/*' element={<DashboardPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;