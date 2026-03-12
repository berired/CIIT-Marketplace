import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import './index.css'
function App() {

  return (
    <>
      <Navbar />
        <div className="min-h-screen bg-platinum">
          <p className="text-black">Causus Bellum. Tempus Est Locondum</p>
        </div>
      <Footer />
    </>
  )
}

export default App
