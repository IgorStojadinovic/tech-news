import InputWithLabel from "../input-white-label";
import { SearchFromPops } from "./types";
import './styles.css';

const SearchForm: React.FC<SearchFromPops> = ({
    searchTerm,
    onSearchSubmit,
    onSearhInput
  }) => {
    return(
      <form onSubmit={ onSearchSubmit}>
      <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused={true}
      onInputChange= {onSearhInput}/>
      <button 
        type="submit" 
        className='button'
        disabled={!searchTerm}
        >
          Search
      </button>
    </form>
    )
  }

  export default SearchForm;