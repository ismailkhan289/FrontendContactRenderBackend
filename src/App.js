import './App.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import { UserProvider } from './components/coreComp/UserContext';
import MainContainer from './components/coreComp/MainContainer';
import Home from './components/pages/Home';
import Contacts from './components/pages/Contacts';

function App() {


  return (
    <>
    <UserProvider>
      <Router>
        <MainContainer>
          <Routes>          
            <Route path="/" element={<Home/>}/>
            <Route path="/contacts" element={<Contacts/>}/>
          </Routes>
        </MainContainer>
      </Router>
    </UserProvider>
    </>
  );
}

export default App;
