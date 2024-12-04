import React from 'react';
import { Button } from './ui/Button';
import { RotateCcw, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface ExamResultsProps {
  correct: number;
  incorrect: number;
  onRetry: () => void;
  onClose: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({
  correct,
  incorrect,
  onRetry,
  onClose
}) => {
  const total = correct + incorrect;
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Exam Results</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <div className="text-2xl font-bold text-green-400">{correct}</div>
              </div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-5 h-5 text-red-400 mr-2" />
                <div className="text-2xl font-bold text-red-400">{incorrect}</div>
              </div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2">{percentage}%</div>
            <div className="text-sm text-gray-400">Overall Score</div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onClose}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
            <Button 
              className="w-full" 
              onClick={onRetry}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;