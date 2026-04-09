import './SectionHeader.css'

const SectionHeader = ({children}:{children:React.ReactNode}) => {
  return(
    <div className="section-header">
      {children}
    </div>
  )
}

export default SectionHeader