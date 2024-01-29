import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import './App.css';
import useStorageState from './hooks/useStorageHook';
import loading from './assets/loading.gif';
import axios from 'axios';
import { motion } from 'framer-motion';


const App = () => {
  const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
  const [searchTerm, setSearchTerm] = useStorageState('','');
  const [url,setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)

  

  const storiesReducer = (state,action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
        ...state,
        isLoading: true,
        isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
        };
      case 'STORIES_FETCH_FAILURE':
        return {
        ...state,
        isLoading: false,
        isError: true,
        };
      case 'REMOVE_STORY':
        return {
        ...state,
        data: state.data.filter(
        (story) => action.payload.objectID !== story.objectID
        ),
        };
      default:
        throw new Error();
      }
  }
  

  const [stories,dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading:false, isError:false }
  )

  const handleSearchSubmit= (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  const handleFetchStories = useCallback( async() => {
  
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        
        try {
          const result = await axios.get(url);
          setTimeout(() => {
            dispatchStories({
              type: 'STORIES_FETCH_SUCCESS',
              payload: result.data.hits, 
            });
          },1000)
        
        } catch {
          dispatchStories({
            type:'STORIES_FETCH_FAILURE'
          })
        }
      
      
  },[url])
    
  useEffect(() => {
    handleFetchStories()
  },[handleFetchStories]);

  useEffect(() => {
    localStorage.setItem('search',searchTerm);
  },[searchTerm])


  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
    //localStorage.setItem('search', event.target.value);
  }


  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
      });
  };
    

  return (
    <div className='main-container'>
      <h1>TECH NEWS</h1>
      <SearchForm searchTerm={searchTerm} onSearchSubmit={handleSearchSubmit} onSearhInput={handleSearchInput}/>
      <hr/>
      {stories.isError && <p>Something whent wrong ...</p>}
      {stories.isLoading ? <img src={loading} className='gif' alt='gif'/> : <List list={stories.data} onRemoveItem={handleRemoveStory}/>}
      
    </div>
  );
}

export default App;


const SearchForm = ({
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
    onInputChange= {onSearhInput}>

    </InputWithLabel>
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

const List = ({list,onRemoveItem}) => {
  return (
    <ul className='ul-container'>
      {list.map((item) => 
      <Item
      key={item.objectID} 
        item={item}
        onRemoveItem={onRemoveItem}
      />
      )}
    </ul>
  )
}

const Item = ({item, onRemoveItem }) => {
  const handleRemoveItem = () =>{
    onRemoveItem(item);
  }

  const fadeInAnimation = {
    inital: {
      y: '0', x: '-50%', opacity: 0 
    },
    animate:{
      y: 0, x: '0', opacity: 1 
    }
  }

  return (
    <motion.li    
    variants={fadeInAnimation}  
    initial='inital'
    whileInView='animate'
    viewport={{
      once: true,
    }}  
    className='list-item'>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <div className='list-item-info'>
        <div className='list-text'>
          <p  className='bold'>Author: </p><span>{item.author.length > 9 && item.author.slice(0,12) + '...' }</span>
        </div>
        <div  className='list-text'>
          <p  className='bold'>Comments:</p> <span>{item.num_comments}</span>
        </div>
        <div  className='list-text'> 
          <p  className='bold'>Points:</p><span>{item.points}</span>
        </div>
      </div>
      <button className='button' onClick={handleRemoveItem}>Remove </button>
    </motion.li>
  )
}


const InputWithLabel = ({id,label,value,type='text',isFocused,onInputChange,children}) => {
  const inputRef = useRef();
  
  useEffect(() => {
    if (isFocused && inputRef.current) {
    inputRef.current.focus();
    }
    }, [isFocused]);
    
  return (
    <div className='container'>
      <label htmlFor={id}>
      {children}
      </label>
      &nbsp;
      <input
        className='search-input-field'
        ref={inputRef}
        autoFocus={isFocused}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </div>
  )
 
}