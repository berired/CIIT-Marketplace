import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home';
import Listings from './pages/Listings/Listings'
import CreateListing from './pages/CreateListing'
import ProductDetails from './pages/ProductDetails.css/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Messages from './pages/Messages/Messages'
import Profile from './pages/Profile/Profile'
import Admin from './pages/Admin/Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App