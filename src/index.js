import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import './styles/all-elements.css'

import NavigtionBar from './components/NavigtionBar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import Signin from './components/Signin';
import CreateAccount from './components/CreateAccount';
import Account from './components/Account';
import DogInformation from './components/DogInformation';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NavigtionBar />
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/Signin' element={<Signin />} />
      <Route path='/CreateAccount' element={<CreateAccount />} />
      <Route path='/Account' element={<Account />} />
      <Route path='/Dog-information' element={<DogInformation />}>
        <Route path=':id' element={<DogInformation />} />
      </Route>
    </Routes>
    <Footer />
  </BrowserRouter>
);