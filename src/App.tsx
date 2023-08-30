import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import { Header } from './components/header';

const Main = lazy(() => import('./modules/main'));
const Notes = lazy(() => import('./modules/notes'));

function App() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='notes' element={<Notes />} />
            <Route path='*' element={<Main />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
