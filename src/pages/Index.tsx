
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-10 px-4">
          <div className="text-center mb-16 mt-10">
            <h1 className="text-4xl font-bold mb-6">Campus Gate Pass System</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A digital solution for students to request and manage campus gate passes.
              Get approvals from parents and faculty, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">For Students</h2>
              <p className="mb-4">Request gate passes digitally and track approvals in real-time. No more paper forms or waiting in lines.</p>
              <Link to="/login">
                <Button className="w-full">Student Login</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">For Parents</h2>
              <p className="mb-4">Approve your child's gate pass requests digitally. Stay informed about their campus exit times.</p>
              <Link to="/parent-login">
                <Button className="w-full">Parent Login</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">For Faculty</h2>
              <p className="mb-4">Review and approve student gate pass requests efficiently with notifications for pending approvals.</p>
              <Link to="/faculty-login">
                <Button className="w-full">Faculty Login</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-bold mb-2">Student Requests</h3>
                <p>Students submit gate pass requests with date, time, and reason.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-bold mb-2">Two-Level Approval</h3>
                <p>Requests require approval from both parents and faculty.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-bold mb-2">Digital Pass</h3>
                <p>Approved passes generate a QR code for security verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
