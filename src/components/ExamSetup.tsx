import React, { useState } from "react";
import { Button } from "./ui/Button";
import { GraduationCap, ArrowLeft } from "lucide-react";

interface ExamSetupProps {
  totalQuestions: number;
  onStartExam: (
    questionCount: number,
    startRange: number,
    endRange: number
  ) => void;
  onClose: () => void;
}

const EXAM_PREFERENCES_KEY = "exam-preferences";

interface ExamPreferences {
  questionCount: string;
  rangeStart: string;
  rangeEnd: string;
}

const ExamSetup: React.FC<ExamSetupProps> = ({
  totalQuestions,
  onStartExam,
  onClose,
}) => {
  const loadPreferences = (): ExamPreferences => {
    try {
      const selectedRange: { start: number; end: number } | null = {
        start: 1,
        end: totalQuestions,
      };
      if (selectedRange) {
        return {
          questionCount: "5",
          rangeStart: String(selectedRange.start),
          rangeEnd: String(selectedRange.end),
        };
      }

      // Otherwise load from storage
      const saved = localStorage.getItem(EXAM_PREFERENCES_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        return {
          questionCount: String(prefs.questionCount),
          rangeStart: String(prefs.rangeStart),
          rangeEnd: String(prefs.rangeEnd),
        };
      }
    } catch (error) {
      console.error("Error loading exam preferences:", error);
    }
    return {
      questionCount: "5",
      rangeStart: "1",
      rangeEnd: String(totalQuestions),
    };
  };

  const [preferences, setPreferences] =
    useState<ExamPreferences>(loadPreferences);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const savePreferences = (newPrefs: ExamPreferences) => {
    try {
      localStorage.setItem(EXAM_PREFERENCES_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error("Error saving exam preferences:", error);
    }
  };

  const handleQuestionCountChange = (value: string) => {
    const newPrefs = { ...preferences, questionCount: value };
    setPreferences(newPrefs);
    savePreferences(newPrefs);

    const numValue = parseInt(value);
    const startNum = parseInt(preferences.rangeStart);
    const endNum = parseInt(preferences.rangeEnd);
    const availableQuestions = endNum - startNum + 1;

    if (!value || value.trim() === "") {
      setErrorMessage("Please enter the number of questions");
    } else if (isNaN(numValue)) {
      setErrorMessage("Please enter a valid number");
    } else if (numValue <= 0) {
      setErrorMessage("Number of questions must be greater than 0");
    } else if (numValue > totalQuestions) {
      setErrorMessage(`Number of questions cannot exceed ${totalQuestions}`);
    } else if (numValue > availableQuestions) {
      setErrorMessage(
        `Selected range only contains ${availableQuestions} questions`
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleRangeStartChange = (value: string) => {
    const newPrefs = { ...preferences, rangeStart: value };
    setPreferences(newPrefs);
    savePreferences(newPrefs);

    const numValue = parseInt(value);
    const endNum = parseInt(preferences.rangeEnd);
    const questionCount = parseInt(preferences.questionCount);

    if (!value) {
      setErrorMessage("Please enter a start range");
    } else if (isNaN(numValue)) {
      setErrorMessage("Please enter a valid number for start range");
    } else if (numValue < 1 || numValue > totalQuestions) {
      setErrorMessage(
        `Error: Start range must be between 1 and ${totalQuestions}`
      );
    } else if (numValue > endNum) {
      setErrorMessage("Error: Start range cannot be greater than end range");
    } else if (questionCount > endNum - numValue + 1) {
      setErrorMessage(
        `Error: Selected questions (${questionCount}) exceeds available questions in range (${
          endNum - numValue + 1
        })`
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleRangeEndChange = (value: string) => {
    const newPrefs = { ...preferences, rangeEnd: value };
    setPreferences(newPrefs);
    savePreferences(newPrefs);

    const numValue = parseInt(value);
    const startNum = parseInt(preferences.rangeStart);
    const questionCount = parseInt(preferences.questionCount);

    if (!value) {
      setErrorMessage("Please enter an end range");
    } else if (isNaN(numValue)) {
      setErrorMessage("Please enter a valid number for end range");
    } else if (numValue < 1 || numValue > totalQuestions) {
      setErrorMessage(
        `Error: End range must be between 1 and ${totalQuestions}`
      );
    } else if (numValue < startNum) {
      setErrorMessage("Error: End range cannot be less than start range");
    } else if (questionCount > numValue - startNum + 1) {
      setErrorMessage(
        `Error: Selected questions (${questionCount}) exceeds available questions in range (${
          numValue - startNum + 1
        })`
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleStartExam = () => {
    const startNum = parseInt(preferences.rangeStart);
    const endNum = parseInt(preferences.rangeEnd);
    const questionCount = parseInt(preferences.questionCount);

    if (isNaN(startNum) || isNaN(endNum) || isNaN(questionCount)) {
      setErrorMessage("Please enter valid numbers for all fields");
      return;
    }

    onStartExam(questionCount, startNum, endNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-xl w-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Exam Setup</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Questions
            </label>
            <input
              type="text"
              value={preferences.questionCount}
              onChange={(e) => handleQuestionCountChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Question Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">From</label>
                <input
                  type="text"
                  value={preferences.rangeStart}
                  onChange={(e) => handleRangeStartChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  type="text"
                  value={preferences.rangeEnd}
                  onChange={(e) => handleRangeEndChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="text-sm text-red-400">{errorMessage}</div>
          )}

          <div className="text-sm text-gray-400">
            {!isNaN(parseInt(preferences.rangeEnd)) &&
            !isNaN(parseInt(preferences.rangeStart))
              ? `${
                  parseInt(preferences.rangeEnd) -
                  parseInt(preferences.rangeStart) +
                  1
                } questions available in range`
              : "Enter valid range numbers"}
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="w-full" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handleStartExam}
              disabled={!!errorMessage}
            >
              <GraduationCap className="h-4 h-4 mr-2" />
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
