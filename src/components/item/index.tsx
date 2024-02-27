import { useMemo, useState } from "react";
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

    const fadeOutAnimation = {
      inital: {
        y: '50%', x: '0', opacity: 0 
      },
      animate:{
        y: 0, x: '0', opacity: 1
      }
    }
    return (
      <tr className='t-row'>
        <td className="t-head">
          <a href={item.url} target="_blank" rel="noreferrer" className="bold">{item.title}</a>
        </td>
        <td className="t-head">
          <p className="bold">{item.author.length ? item.author : 'unknown'  }</p>
        </td>
        <td className="t-head">
          <p className="bold">{item.num_comments}</p>
        </td>
        <td className="t-head">
         <p className="bold">{item.points}</p>
        </td>
      </tr>
     
    )
  
    },[item,onRemoveItem])
  
  
    return renderItem;
  }
  

  export default Item;