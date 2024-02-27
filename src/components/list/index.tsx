import { useMemo } from "react";
import { ListProps } from "./types";
import Item from "../item/index";
import './styles.css';

const List: React.FC<ListProps> = ({list,onRemoveItem,sortItems}) => {
    const renderList = useMemo(() => {
      
    return (
      <table className='ul-container'>
        <tr className='t-row'>
          <th className="t-head">Title</th>
          <th className="t-head">Atuthor</th>
          <th className="t-head">Comments</th>
          <th className="t-head">Points</th>
          <th className="t-head">
            <select className="sort-select" id="sort" onChange={(e) => {sortItems(e)}}>
            <option value='points-asc'>Points ASC</option>
            <option value='points-desc'>Points DESC</option>
            <option value='comments-asc'>Comments ASC</option>
            <option value='comments-desc' selected>Comments DESC</option>
          </select></th>
        </tr>
      {list.map((item) => 
        <Item
        key={item.objectID} 
            item={item}
            onRemoveItem={onRemoveItem}
        />
      )}
    </table>
    )
  },[list,onRemoveItem]);
    
    return renderList;
  }


  export default List;