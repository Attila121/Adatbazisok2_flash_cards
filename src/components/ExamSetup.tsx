import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface ExamSetupProps {
  totalQuestions: number;
  onStartExam: (questionCount: number, startRange: number, endRange: number) => void;
  onClose: () => void;
}

// Key for storing exam preferences
const EXAM_PREFERENCES_KEY = "exam-preferences";

interface ExamPreferences {
  questionCount: number;
  rangeStart: number;
  rangeEnd: number;
}

const ExamSetup: React.FC<ExamSetupProps> = ({ 
  totalQuestions, 
  onStartExam, 
  onClose 
}) => {
  // Load saved preferences or use defaults
  const loadPreferences = (): ExamPreferences => {
    try {
      const saved = localStorage.getItem(EXAM_PREFERENCES_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        return {
          questionCount: Math.min(prefs.questionCount, totalQuestions),
          rangeStart: Math.min(prefs.rangeStart, totalQuestions),
          rangeEnd: Math.min(prefs.rangeEnd, totalQuestions)
        };
      }
    } catch (error) {
      console.error("Error loading exam preferences:", error);
    }
    return {
      questionCount: 5,
      rangeStart: 1,
      rangeEnd: totalQuestions
    };
  };

  const [preferences, setPreferences] = useState<ExamPreferences>(loadPreferences);

  // Save preferences whenever they change
  const savePreferences = (newPrefs: ExamPreferences) => {
    try {
      localStorage.setItem(EXAM_PREFERENCES_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error("Error saving exam preferences:", error);
    }
  };

  const handleQuestionCountChange = (value: number) => {
    const newPrefs = {
      ...preferences,
      questionCount: Math.min(totalQuestions, Math.max(1, value))
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const handleRangeStartChange = (value: number) => {
    const newPrefs = {
      ...preferences,
      rangeStart: Math.min(preferences.rangeEnd, Math.max(1, value))
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const handleRangeEndChange = (value: number) => {
    const newPrefs = {
      ...preferences,
      rangeEnd: Math.max(preferences.rangeStart, Math.min(totalQuestions, value))
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const handleStartExam = () => {
    const availableQuestions = preferences.rangeEnd - preferences.rangeStart + 1;
    const finalQuestionCount = Math.min(preferences.questionCount, availableQuestions);
    onStartExam(finalQuestionCount, preferences.rangeStart, preferences.rangeEnd);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-xl w-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Exam Setup</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              min="1"
              max={totalQuestions}
              value={preferences.questionCount}
              onChange={(e) => handleQuestionCountChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>

          {/* Question Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Question Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">From</label>
                <input
                  type="number"
                  min="1"
                  max={preferences.rangeEnd}
                  value={preferences.rangeStart}
                  onChange={(e) => handleRangeStartChange(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  type="number"
                  min={preferences.rangeStart}
                  max={totalQuestions}
                  value={preferences.rangeEnd}
                  onChange={(e) => handleRangeEndChange(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Selected Range Info */}
          <div className="text-sm text-gray-400">
            {preferences.rangeEnd - preferences.rangeStart + 1} questions available in selected range
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onClose}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="w-full" 
              onClick={handleStartExam}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;