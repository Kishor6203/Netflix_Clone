import {
    useContext,
  } from "react";
  
  import MyListContext from "../context/MyListContext";
  
  const useMyList = () => {
    const context =
      useContext(MyListContext);
  
    if (!context) {
      throw new Error(
        "useMyList must be used inside MyListProvider"
      );
    }
  
    return context;
  };
  
  export default useMyList;