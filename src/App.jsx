import React from 'react';
import UserList from './components/UserList';

const App = () => {
  const handleSubmitSuccess = (data) => {
    console.log('User added successfully:', data);
    // You can also update the state or perform other actions here
  };

  return (
    <div className="App">
      <UserList onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default App;