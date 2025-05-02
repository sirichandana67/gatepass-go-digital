
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequestPass from "./pages/RequestPass";
import MyPasses from "./pages/MyPasses";
import VerifyPass from "./pages/VerifyPass";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request-pass" element={<RequestPass />} />
        <Route path="/my-passes" element={<MyPasses />} />
        <Route path="/verify" element={<VerifyPass />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
