import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/admin/dashboard'
import LoginPage from './pages/login'
import HomePage from './pages/public/home'

function App() {
  return (
    <Routes>
      <Route path='/*' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='app/*' element={<DashboardPage />} />
    </Routes>
  )
}

export default App
