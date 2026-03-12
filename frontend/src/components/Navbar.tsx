import { useState } from "react";

export default function Navbar(){
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  return(
    <nav className="w-full mb-1 min-w-24 min-h-12 h-fit transition-all flex flex-row justify-between px-4 py-6 md:py-2 items-center gap-1 sm:gap-8 border-b bg-primary">
      
      {/* LOGO SECTION */}
      <section id="logoSection" className="rounded-md py-4 px-0 md:pe-2 flex flex-row flex-none items-center justify-between">
        <img 
          src="https://play-lh.googleusercontent.com/J5tBXh_A3QD1hjkLM2T9V0SdyTeRTkqUPp2fRpijLFf5o6_W5fCvpY2zG8NwqUuHPJo" 
          alt="logo" 
          width="60" 
          className="shrink-0 pe-1 cursor-pointer"/>
        <p className="text-nowrap hidden md:block">&lt;== Temporary</p>
      </section>
      
      {/* SEARCH  SECTION*/}
      <section className="relative flex-1 flex flex-row my-2 rounded-3xl p-1 gap-2 bg-platinum text-black">
        <input type="text" placeholder="Search..." 
          className="flex-1 ps-2 rounded-4xl bg-platinum text-gray-500  border-0 min-w-0" />

        <button type="button" 
          className="flex-none right-0 border-0 rounded-4xl p-1 text-2xl hover:bg-secondary hover:text-white transition-all">
            🔎︎
          </button>

      </section>

      {/* LINKS  SECTION*/}
      <section id="links" className={`relative`}> {/* I don't even remember what this does*/}
        
        <button onClick={()=>setHamburgerOpen(p=>!p)} className="md:hidden m-auto p-3 text-4xl leading-none active:bg-secondary rounded-lg transition-all">
          {hamburgerOpen ? "✕" : "☰" }
        </button>
        
        <ul className={
          // First row mobile Second row desktop
          `${hamburgerOpen ? "flex flex-col absolute top-16 right-0 bg-primary border-b border-pale-slate w-48 p-4 shadow-xl z-50" : "hidden"}
          md:flex md:flex-row md:static md:bg-transparent md:border-none md:p-0 md:shadow-none text-nowrap gap-2 list-none`
          }>
          <li><a className={'block hover:bg-secondary rounded-2xl p-4'}  href="#Home">Home</a></li>
          <li><a className={'block hover:bg-secondary rounded-2xl p-4'}  href="#Saved">Saved</a></li>
          <li><a className={'block hover:bg-secondary rounded-2xl p-4'}  href="#Account">Account</a></li>
          <li><a className={'block hover:bg-secondary rounded-2xl p-4'}  href="#Cart">Cart</a></li>
          <li><a className={'block hover:bg-secondary rounded-2xl p-4'}  href="#Messages">Messages</a></li>
        </ul>
      </section>
    </nav>
  )
}
