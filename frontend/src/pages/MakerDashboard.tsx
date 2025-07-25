import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Project {
  id: string;
  title: string;
  cost: number;
  material: string;
  complexity: string;
  status: string;
}

const MakerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleAcceptProject = (projectId: string) => {
    // In a full implementation, this would make an API call
    alert(`Project ${projectId} accepted!`);
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Maker Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Projects</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Material</p>
                    <p className="font-medium">{project.material}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Complexity</p>
                    <p className="font-medium capitalize">{project.complexity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium">${project.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">{project.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptProject(project.id)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Accept Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Accepted Projects</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't accepted any projects yet</p>
        </div>
      </div>
    </div>
  );
};

export default MakerDashboard;