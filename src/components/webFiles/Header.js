import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Appstate } from '../../App';

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className='main text-4xl z-10 sticky top-0 text-red-500 flex justify-between font-bold border-b-2 p-3 border-gray-500 header bg-black'>
      <Link to='/'>
        <span className='brand'>Filmy <span className='text-white'>Dunia</span></span>
      </Link>
      {loggedIn ? (
        <Link to='/addmovie'>
          <h1 className='text-lg cursor-pointer flex items-center'>
            <Button>
              <AddIcon className='mr-1' color='secondary' /> <span className='text-white'>Add New</span>
            </Button>
          </h1>
        </Link>
      ) : (
        <Link to='/login'>
          <h1 className='text-lg rounded bg-green-500 cursor-pointer flex items-center' onClick={handleLogin}>
            <Button><span className='text-white font-medium capitalize'>Login</span></Button>
          </h1>
        </Link>
      )}
    </div>
  );
}

export default Header;
