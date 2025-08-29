import { useParams } from 'react-router-dom';

export default function LoanFileDetail() {
  const { loanFileId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan File Details</h1>
        <p className="text-gray-600">Loan File ID: {loanFileId}</p>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Application</h2>
        <p className="text-gray-600">
          Loan file detail functionality coming soon...
        </p>
      </div>
    </div>
  );
}
