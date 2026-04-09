import './FilterChips.css'

interface Props{
  filters: String[];
  SelectedFilter: String;
  onClick: (value: React.SetStateAction<any>) => void;
}

function FilterChips({filters, SelectedFilter, onClick}:Props){
  return(
    <div className="filter-chips ">
      {filters.map((filter, index) => (
        <button
          key={filter as React.Key}
          className={SelectedFilter === filter ? 'chip active-chip' : 'chip'}
          type="button"
          onClick={() => onClick(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterChips;