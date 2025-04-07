import * as React from "react";
import './App.css';
import Home from './pages/header/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Payment from './pages/payment/Payment';
import InvSearchBar from './pages/investorSearch/InvSearchBar';
import StartupSearchBar from './pages/startupSearch/StartupSearchBar';
import Chat from './pages/chat/chat';
import LogIn from '../src/pages/login/Login';
import SignUp from './pages/signup/SignUp';
import Profile from './pages/profile';
import KnowledgeHub from './pages/knowledgehub';
import EditProfile from './pages/editprofile'
import ForgotPassword from './pages/forgot-password';
import Dashboard from './pages/dashboard';
import Investorprofile from './pages/investors/Investorprofile';
import RequestDemo from './components/Dashboard/RequestDemo';
import DocumentVerification from './pages/documentVerification/DocumentVerification';
// import Footer from './pages/footer/Footer';
import StartupProfile from './pages/product/StartupProflie';
import AddInvestor from './pages/investors/AddInvestor'; 
import AddStartup from './pages/startups/AddStartup';
import AdminDashboard from './pages/admin/AdminDashboard';
// Import new proposal components
import CreateProposal from './pages/proposals/CreateProposal';
import ProposalsList from './pages/proposals/ProposalsList';
import ProposalDetail from './pages/proposals/ProposalDetail';
import MyProposals from './pages/proposals/MyProposals';

function App(props) {
  const [isUserAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState('');

  React.useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem("role") || '');
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Home />
        <Routes>
          {isUserAuthenticated && (
            <>
              <Route exact path='/payments' element={<Payment />} />
              <Route exact path='/chat' element={<Chat />} />
              <Route exact path="/documentVerification" element={<DocumentVerification />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path='/editprofile' element={<EditProfile />} />
              
              {/* Investment Proposal Routes */}
              <Route exact path='/proposals' element={<ProposalsList />} />
              <Route exact path='/proposals/:id' element={<ProposalDetail />} />
              <Route exact path='/create-proposal' element={<CreateProposal />} />
              <Route exact path='/my-proposals' element={<MyProposals />} />
              
              {/* Investor-specific routes */}
              {(userRole === 'investor' || userRole === 'admin') && (
                <>
                  <Route exact path='/add-investor' element={<AddInvestor />} />
                </>
              )}
              
              {/* Startup-specific routes */}
              {(userRole === 'startup' || userRole === 'admin') && (
                <>
                  <Route exact path='/add-startup' element={<AddStartup />} />
                  <Route exact path='/create-proposal' element={<CreateProposal />} />
                  <Route exact path='/my-proposals' element={<MyProposals />} />
                </>
              )}
              
              {/* Admin-specific routes */}
              {userRole === 'admin' && (
                <>
                  <Route exact path='/admin-dashboard' element={<AdminDashboard />} />
                </>
              )}
            </>
          )}
          <Route exact path='/invSearchBar' element={<InvSearchBar />} />        
          <Route exact path='/startupSearchBar' element={<StartupSearchBar />} />
          <Route exact path="/investors" element={<Investorprofile />} />
          <Route exact path="/startup" element={<StartupProfile />} />
          <Route exact path="/startup/:id" element={<StartupProfile />} /> 
          <Route exact path="/login" element={<LogIn setIsAuthenticated={setIsAuthenticated}/>} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
          <Route exact path='/hub' element={<KnowledgeHub />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/requestdemo' element={<RequestDemo />} />
          <Route exact path='/' element={<Dashboard />} />
          
        </Routes>
         
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  );
}

export default App;
