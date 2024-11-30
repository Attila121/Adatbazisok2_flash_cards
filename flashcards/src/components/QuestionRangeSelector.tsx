import { Button } from './ui/Button';
import { HashIcon } from 'lucide-react';

interface QuestionRangeSelectorProps {
  totalQuestions: number;
  onSelectRange: (start: number, end: number) => void;
  onClose: () => void;
}

const QuestionRangeSelector: React.FC<QuestionRangeSelectorProps> = ({ 
  totalQuestions, 
  onSelectRange, 
  onClose 
}) => {
  const ranges = [];
  for (let i = 0; i < totalQuestions; i += 10) {
    const start = i + 1;
    const end = Math.min(i + 10, totalQuestions);
    // Only add valid ranges
    if (start <= totalQuestions) {
      ranges.push({ start, end });
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Question Range</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ranges.map(({ start, end }) => (
              <Button
                key={`${start}-${end}`}
                variant="outline"
                className="border-gray-700 hover:bg-gray-700/50 flex items-center justify-start gap-2 w-full"
                onClick={() => {
                  onSelectRange(start, end);
                  onClose();
                }}
              >
                <HashIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">Questions {start}-{end}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-700/50 flex items-center justify-start gap-2 w-full"
              onClick={() => {
                onSelectRange(1, totalQuestions);
                onClose();
              }}
            >
              <HashIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">All Questions</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionRangeSelector;