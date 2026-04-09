import './Search.css'

function Search(){
  return(
    <div className="search">
      <input type="text" placeholder="Search listings..." />
      <button type="button">🔍</button>
    </div>
  ) 
}

export default Search;