import { useState, useEffect } from 'react';

const getLocalValue = (key, initValue) => {
  // SSR
  if( typeof window === undefined ) return initValue;

  // if a value is already store
  const localValue = JSON.parse( localStorage.getItem(key));
  if( localValue ) return localValue;

  // return result of a function
  if( initValue instanceof Function ) return initValue();

  return initValue;
}


const useLocalStorage = ( key, initValue ) => {
  // store value into localStorage in every update from this hook
  const [ value, setValue ] = useState(JSON.parse( localStorage.getItem(key) ) || initValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value])

  return [ value, setValue ];
}

export default useLocalStorage;