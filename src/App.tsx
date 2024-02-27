import React from 'react';
import { 
  useCallback, 
  useEffect, 
  useReducer,
  useState } from 'react';
import './App.css';
import useStorageState from './hooks/useStorageHook';
import axios from 'axios';
import {
  Story,
  StoriesState,
  StoriesAction,
} from './types';
import SearchForm from './components/search-form';
import List from './components/list';
import loadash from 'lodash';
import { FaCaretUp,FaCaretDown ,FaGithub} from "react-icons/fa";



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
      case 'SORT_STORIES_DESC':
        return {
          ...state,
          data: action.payload
        };
      case  'SORT_STORIES_ASC':
        return {
          ...state,
          data: action.payload
        }
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
      },5)
      console.log('Fetch',stories.data)
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

   const handleSort = (e : React.ChangeEvent<HTMLInputElement>) =>{
    let sortedStories;
    switch(e.target.value){
      case 'points-asc':
        sortedStories = loadash.sortBy(stories.data,['points'])
        dispatchStories({
          type:'SORT_STORIES_ASC',
          payload: sortedStories
        })
        break;
      case 'points-desc':
        sortedStories = loadash.orderBy(stories.data,['points'],['desc'])
        dispatchStories({
          type:'SORT_STORIES_DESC',
          payload: sortedStories
        })
        break;
      case 'comments-asc':
        sortedStories = loadash.sortBy(stories.data,['num_comments'])
        dispatchStories({
          type:'SORT_STORIES_ASC',
          payload: sortedStories
        })
        break;
      case 'comments-desc':
        sortedStories = loadash.orderBy(stories.data,['num_comments'],['desc'])
        dispatchStories({
          type:'SORT_STORIES_DESC',
          payload: sortedStories
        })
        break;
      default: 
       sortedStories = stories.data;
  
    }
   }


  return (
    <div className='main-container'>

      <h1>TECH NEWS</h1>
     
     <a className='github-link' href="https://github.com/IgorStojadinovic/tech-news" target='_blank' rel="noreferrer">
      <FaGithub color='white'/>
      </a> 
      <p className='sub-header'>search for any topic (eg. react,openIA,etc..)</p>
      <SearchForm searchTerm={searchTerm} onSearchSubmit={handleSearchSubmit} onSearhInput={handleSearchInput}/>
      {stories.isError && <p>Something whent wrong ...</p>}
      {stories.isLoading ? "Loading..." : <List list={stories.data} onRemoveItem={handleRemoveStory} sortItems={handleSort}/>}
    </div>
  );
}

export default App;




