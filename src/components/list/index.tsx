import { useMemo } from "react";
import { ListProps } from "./types";
import Item from "../item/index";
import './styles.css';

const List: React.FC<ListProps> = ({list,onRemoveItem}) => {
    const renderList = useMemo(() => {
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
  },[list,onRemoveItem]);
    
    return renderList;
  }


  export default List;