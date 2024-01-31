import React from 'react';
import { 
  useCallback, 
  useEffect, 
  useReducer,
  useState } from 'react';
import './App.css';
import useStorageState from './hooks/useStorageHook';
import loading from './assets/loading.gif';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Story,
  StoriesState,
  StoriesAction,
} from './types';
import SearchForm from './components/search-form';
import List from './components/list';


const storiesReducer = (state:StoriesState,action:StoriesAction) => {
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

const App = () => {

  const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
  const [searchTerm, setSearchTerm] = useStorageState('','');
  const [url,setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)

  const [stories,dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading:false, isError:false }
  )

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


  const handleSearchInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit= (event : React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  const handleRemoveStory = useCallback((item:Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
      });
  },[])


  return (
    <div className='main-container'>
      <h1>TECH NEWS</h1>
      <p className='sub-header'>search for any topic (eg. react,openIA,etc..)</p>
      <SearchForm searchTerm={searchTerm} onSearchSubmit={handleSearchSubmit} onSearhInput={handleSearchInput}/>
      <hr/>
      {stories.isError && <p>Something whent wrong ...</p>}
      {stories.isLoading ? <img src={loading} className='gif' alt='gif'/> : <List list={stories.data} onRemoveItem={handleRemoveStory}/>}
    </div>
  );
}

export default App;




