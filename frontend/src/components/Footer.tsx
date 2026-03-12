export default function Footer(){
  return(
    <footer className="bg-primary justify-center relative p-5 align-baseline">
      <section className="flex flex-row justify-between">
        <article className="flex-1 flex flex-col mx-4">
          <h1>Resources:</h1>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Reach out to us</a></li>
            <li><a href="#">Become a Seller</a></li>
            <li><a href="#">Lodge a Complaint</a></li>
          </ul>
        </article>

        <article className="flex-1 flex flex-col mx-4 align-bottom">
          <h1>Copyright 2026</h1>
          <h1>All CIIT brandmarks are owned by CIIT College of Inovation and Integrated Technology </h1>
        </article>

        
        <article className="flex-1 flex flex-col mx-4 align-bottom">
          <h1>TBA</h1>
          <ul>
            <li><a href="#"></a></li>
            <li><a href="#">TBA</a></li>
            <li><a href="#">TBA </a></li>
            <li><a href="#">TBA </a></li>
            <li><a href="#">TBA </a></li>
          </ul>
        </article>
      </section>
    </footer>
  )
}