import React from 'react';
import { AppContextProvider } from './context/AppContext';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { HomePage } from './pages/HomePage/HomePage';
import { SlideOver } from './components/ui/SlideOver/SlideOver';
import { Toast } from './components/ui/Toast/Toast';
import { Alert } from './components/ui/Alert/Alert';
import './index.css';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <div className="app">
        <Header />
        <main className="main">
          <HomePage />
        </main>
        <Footer />
        <SlideOver />
        <Toast />
        <Alert />
      </div>
    </AppContextProvider>
  );
};

export default App;