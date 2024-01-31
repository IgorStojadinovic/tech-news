import { useRef,useEffect } from "react";
import { InputWithLabelProps } from "./types";

const InputWithLabel: React.FC<InputWithLabelProps> = ({id,value,type='text',isFocused,onInputChange}) => {
    const inputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (isFocused && inputRef.current) {
      inputRef.current.focus();
      }
      }, [isFocused]);
      
    return (
      <div className='container' id={id}>
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

export default InputWithLabel;