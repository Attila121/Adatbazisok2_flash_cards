import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { HashIcon, Shuffle } from 'lucide-react';

interface QuestionRangeSelectorProps {
  totalQuestions: number;
  onSelectRange: (start: number, end: number, randomOrder: boolean) => void;
  onClose: () => void;
}

const RANGE_PREFERENCES_KEY = "range-preferences-random";

const QuestionRangeSelector: React.FC<QuestionRangeSelectorProps> = ({ 
  totalQuestions, 
  onSelectRange, 
  onClose 
}) => {
  useEffect(() => {
    const savedRange = localStorage.getItem(RANGE_PREFERENCES_KEY);
    if (savedRange) {
      const { start, end, randomOrder } = JSON.parse(savedRange);
      onSelectRange(start, end, randomOrder);
    }
  }, [onSelectRange]);

  const [isRandomOrder, setIsRandomOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(RANGE_PREFERENCES_KEY);
      return saved ? JSON.parse(saved).randomOrder : false; 
    } catch {
      return false; 
    }
  });

  useEffect(() => {
    localStorage.setItem(RANGE_PREFERENCES_KEY, JSON.stringify({ randomOrder: isRandomOrder }));
  }, [isRandomOrder]);

  const ranges = [];
  for (let i = 0; i < totalQuestions; i += 10) {
    const start = i + 1;
    const end = Math.min(i + 10, totalQuestions);
    if (start <= totalQuestions) {
      ranges.push({ start, end });
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Question Range</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className={isRandomOrder ? "bg-blue-500/20 border-blue-500" : ""}
              onClick={() => setIsRandomOrder(!isRandomOrder)}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Random Order
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-700/50 flex items-center justify-start gap-2 w-full"
              onClick={() => {
                onSelectRange(1, totalQuestions, isRandomOrder);
                localStorage.setItem(RANGE_PREFERENCES_KEY, JSON.stringify({ start: 1, end: totalQuestions, randomOrder: isRandomOrder }));
                onClose();
              }}
            >
              <HashIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">All Questions</span>
            </Button>
            {ranges.map(({ start, end }) => (
              <Button
                key={`${start}-${end}`}
                variant="outline"
                className="border-gray-700 hover:bg-gray-700/50 flex items-center justify-start gap-2 w-full"
                onClick={() => {
                  onSelectRange(start, end, isRandomOrder);
                  localStorage.setItem(RANGE_PREFERENCES_KEY, JSON.stringify({ start, end, randomOrder: isRandomOrder }));
                  onClose();
                }}
              >
                <HashIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">Questions {start}-{end}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionRangeSelector;