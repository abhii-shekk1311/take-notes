import { useEffect, useState } from 'react'

const useDebounce = (value, delay = 500) => {
  const [debouncedVal, setDebouncedVal] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedVal(value) }, delay)
    return () => clearTimeout(timer);
  }, [value, delay])
  return debouncedVal
}

export default useDebounce