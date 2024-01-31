import { useMemo } from "react";
import { ItemProps } from "./types";
import {motion} from "framer-motion";
import './styles.css'

const Item: React.FC<ItemProps> = ({item,onRemoveItem}) : JSX.Element => {

    const renderItem = useMemo(() => {
      const handleRemoveItem =() =>{
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
          <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
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
  
    },[item,onRemoveItem])
  
  
    return renderItem;
  }
  

  export default Item;