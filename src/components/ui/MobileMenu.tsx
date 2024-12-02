import React from 'react';
import { Button } from './Button';
import {
  List,
  Columns,
  Maximize2,
  RotateCcw,
  Hash as HashIcon,
  BookmarkCheck,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  studyMode: 'all' | 'unknown' | 'marked';
  dualView: boolean;
  onToggleQuestionList: () => void;
  onToggleDualView: () => void;
  onToggleStudyMode: () => void;
  onToggleMarkedMode: () => void;
  onReset: () => void;
  onToggleRangeSelector: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  studyMode,
  dualView,
  onToggleQuestionList,
  onToggleDualView,
  onToggleStudyMode,
  onToggleMarkedMode,
  onReset,
  onToggleRangeSelector,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-x-0 bottom-0 bg-gray-800 rounded-t-xl p-4 space-y-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Menu</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-700"
          onClick={() => {
            onToggleQuestionList();
            onClose();
          }}
        >
          <List className="mr-2 h-4 w-4" />
          Question List
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-700"
          onClick={() => {
            onToggleDualView();
            onClose();
          }}
        >
          {dualView ? (
            <Maximize2 className="mr-2 h-4 w-4" />
          ) : (
            <Columns className="mr-2 h-4 w-4" />
          )}
          {dualView ? 'Single View' : 'Dual View'}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-700"
          onClick={() => {
            onToggleStudyMode();
            onClose();
          }}
        >
          {studyMode === 'all' ? 'Study Unknown Only' : 'Study All'}
        </Button>

        <Button
          variant="outline"
          className={`w-full justify-start border-gray-700 ${
            studyMode === 'marked' ? 'bg-yellow-500/20 text-yellow-500' : ''
          }`}
          onClick={() => {
            onToggleMarkedMode();
            onClose();
          }}
        >
          <BookmarkCheck className="mr-2 h-4 w-4" />
          {studyMode === 'marked' ? 'Study All' : 'Study Marked'}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-700"
          onClick={() => {
            onReset();
            onClose();
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Progress
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-700"
          onClick={() => {
            onToggleRangeSelector();
            onClose();
          }}
        >
          <HashIcon className="mr-2 h-4 w-4" />
          Select Range
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;