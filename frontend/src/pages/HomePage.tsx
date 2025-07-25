import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Connect with 3D Printing Experts
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Upload your 3D models, get instant quotes, and connect with professional makers worldwide.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link 
            to="/projects/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
          >
            Start a Project
          </Link>
          <Link 
            to="/register?role=maker" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
          >
            Become a Maker
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-4xl mb-4">1</div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Model</h3>
          <p className="text-gray-600">
            Simply upload your STL or OBJ file and provide project details.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-4xl mb-4">2</div>
          <h3 className="text-xl font-semibold mb-2">Get Instant Quote</h3>
          <p className="text-gray-600">
            Receive an immediate cost estimate based on material and complexity.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-4xl mb-4">3</div>
          <h3 className="text-xl font-semibold mb-2">Connect with Makers</h3>
          <p className="text-gray-600">
            Choose a professional maker and get your project printed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;