import { useParams } from 'react-router-dom';

export default function ClientLoanDetail() {
  const { loanFileId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
        <p className="text-gray-600">Loan File ID: {loanFileId}</p>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Application Progress</h2>
        <p className="text-gray-600">
          Client loan detail functionality coming soon...
        </p>
      </div>
    </div>
  );
}
