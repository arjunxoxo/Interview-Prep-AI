import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext';

const DashboardLayout = () => {
    const {user}=useContext(UserContext);
  return (
    <div>
        <Navbar />

        {user && <div>{children}</div>} 
    </div>
  );
};

export default DashboardLayout;