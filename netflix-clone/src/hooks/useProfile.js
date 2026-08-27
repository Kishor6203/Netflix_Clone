import {
    useContext,
  } from "react";
  
  import ProfileContext from "../context/ProfileContext";
  
  export const useProfile = () => {
    const context =
      useContext(ProfileContext);
  
    if (!context) {
      throw new Error(
        "useProfile must be used inside ProfileProvider"
      );
    }
  
    return context;
  };
  
  export default useProfile;