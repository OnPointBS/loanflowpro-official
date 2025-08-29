import { useParams } from 'react-router-dom';

export default function ClientDetail() {
  const { clientId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
        <p className="text-gray-600">Client ID: {clientId}</p>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Client Profile</h2>
        <p className="text-gray-600">
          Client detail functionality coming soon...
        </p>
      </div>
    </div>
  );
}
