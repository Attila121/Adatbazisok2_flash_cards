import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import MarkdownRenderer from "./MarkdownRenderer";
import FlipCard from "./components/ui/Flippcard";
import QuestionRangeSelector from "./components/QuestionRangeSelector";

import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronRight,
  Image as ImageIcon,
  Columns,
  List,
  Maximize2,
  Hash as HashIcon,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

// Type definitions
type Flashcard = {
  id: number;
  question: string;
  answer: string;
  hasImage: boolean;
  imagePath?: string;
  timesCorrect: number;
  timesIncorrect: number;
  lastReviewed?: Date;
  isMarked?: boolean; // New property
};

type Progress = {
  cards: {
    [key: number]: Omit<
      Flashcard,
      "id" | "question" | "answer" | "hasImage" | "imagePath"
    > & { isMarked?: boolean };
  };
  lastCardIndex: number;
};

// Local storage key
const PROGRESS_KEY = "flashcard-progress";
const LAST_POSITION_KEY = "flashcard-last-position";

export default function FlashcardApp() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownCards, setKnownCards] = useState<Flashcard[]>([]);
  const [unknownCards, setUnknownCards] = useState<Flashcard[]>([]);
  const [studyMode, setStudyMode] = useState<"all" | "unknown" | "marked">("all");
  const [dualView, setDualView] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const currentQuestionRef = useRef<HTMLButtonElement>(null);
  const questionListRef = useRef<HTMLDivElement>(null);
  const [selectedRange, setSelectedRange] = useState<{start: number; end: number} | null>(null);
  const [showRangeSelector, setShowRangeSelector] = useState(false);

  
  const loadProgress = (): Progress => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      const lastPosition = localStorage.getItem(LAST_POSITION_KEY);
      return {
        cards: savedProgress ? JSON.parse(savedProgress) : {},
        lastCardIndex: lastPosition ? parseInt(lastPosition, 10) : 0,
      };
    } catch (error) {
      console.error("Error loading progress:", error);
      return { cards: {}, lastCardIndex: 0 };
    }
  };

  const saveProgress = (progressData: Flashcard[], currentIndex: number) => {
    try {
      // Save card progress
      const progressObj = progressData.reduce((acc, card) => {
        acc[card.id] = {
          timesCorrect: card.timesCorrect,
          timesIncorrect: card.timesIncorrect,
          lastReviewed: card.lastReviewed,
        };
        return acc;
      }, {} as Progress["cards"]);

      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressObj));

      // Save current position
      localStorage.setItem(LAST_POSITION_KEY, currentIndex.toString());
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };
  
  const getFilteredCards = () => {
    switch (studyMode) {
      case "marked":
        return cards.filter(card => card.isMarked);
      case "unknown":
        return cards.filter(card => card.timesIncorrect > card.timesCorrect);
      default:
        return cards;
    }
  };

  // Parse markdown and initialize cards
  useEffect(() => {
    const parseMarkdown = (markdown: string): Flashcard[] => {
      if (!markdown) return [];

      const questions: Flashcard[] = [];
      const lines = markdown.trim().split("\n");

      let currentQuestion = "";
      let currentAnswer = "";
      let currentId = 0;
      let currentImagePath: string | undefined;
      let hasImage = false;
      let inCodeBlock = false;
      let currentIndentLevel = 0;
      let inTable = false;
      let tableBuffer = "";

      const processCurrentQuestion = () => {
        if (currentQuestion) {
          questions.push({
            id: currentId,
            question: currentQuestion,
            answer: currentAnswer.trim(),
            hasImage,
            imagePath: currentImagePath,
            timesCorrect: 0,
            timesIncorrect: 0,
          });
        }
      };


      const getIndentLevel = (line: string): number => {
        const match = line.match(/^(\s*)/);
        return match && match[1] ? Math.floor(match[1].length / 2) : 0;
      };

      const processLine = (line: string) => {
        // Handle code blocks
        if (line.startsWith("```")) {
          inCodeBlock = !inCodeBlock;
          currentAnswer += line + "\n";
          return;
        }

        if (inCodeBlock) {
          currentAnswer += line + "\n";
          return;
        }

        // Check for table markers
        const isTableRow = line.trim().startsWith("|");
        const isTableDivider = line.trim().match(/^\|-+\|/);

        // Handle table start
        if (isTableRow && !inTable) {
          inTable = true;
          tableBuffer = "";
          const indent = "  ".repeat(currentIndentLevel);
          tableBuffer += indent + line + "\n";
          return;
        }

        // Handle table content
        if (inTable) {
          const indent = "  ".repeat(currentIndentLevel);
          if (isTableRow || isTableDivider) {
            tableBuffer += indent + line + "\n";
            return;
          } else {
            // Table has ended
            currentAnswer += tableBuffer;
            inTable = false;
            tableBuffer = "";
            if (!line.trim()) return; // Skip empty line after table
          }
        }

        // Handle image references
        const imageMatch = line.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch && imageMatch[1]) {
          hasImage = true;
          currentImagePath = imageMatch[1].replace("./images/", "/images/");
          if (currentAnswer.trim() === "") {
            // currentAnswer = "See diagram above";
          }
          return;
        }

        // Handle bullet points
        const bulletMatch = line.match(/^(\s*)[*-]\s(.+)/);
        if (bulletMatch) {
          const [_, indent, content] = bulletMatch;
          currentIndentLevel = Math.floor((indent?.length || 0) / 2);
          const indentStr = "  ".repeat(currentIndentLevel);
          currentAnswer += `${indentStr}- ${content}\n`;
          return;
        }

        // Handle continued lines within a bullet point
        if (line.trim() && getIndentLevel(line) >= currentIndentLevel) {
          const indentStr = "  ".repeat(currentIndentLevel);
          const contentWithoutIndent = line.trimStart();
          currentAnswer += `${indentStr}  ${contentWithoutIndent}\n`;
          return;
        }

        // Reset indent level for non-indented lines
        if (line.trim() && getIndentLevel(line) === 0) {
          currentIndentLevel = 0;
        }

        // Add regular lines
        if (line.trim()) {
          currentAnswer += line + "\n";
        } else {
          // Preserve empty lines
          currentAnswer += "\n";
        }
      };

      for (const line of lines) {
        // Match question headers
        const questionMatch = line.trim().match(/^## (\d+)\.\s(.+)/);
        if (questionMatch) {
          processCurrentQuestion();

          const [_, idStr, questionText] = questionMatch;
          currentId = parseInt(idStr || "0", 10);
          currentQuestion = questionText || "";
          currentAnswer = "";
          hasImage = false;
          currentImagePath = undefined;
          currentIndentLevel = 0;
          inTable = false;
          tableBuffer = "";
          continue;
        }

        processLine(line);
      }

      // Process the last question
      processCurrentQuestion();

      return questions;
    };

    const loadFlashcards = async () => {
      try {
        const response = await fetch("kerdesek.md");
        if (!response.ok) {
          throw new Error("Failed to load flashcards");
        }

        const markdown = await response.text();
        const parsedCards = parseMarkdown(markdown);
        console.log(
          "Parsed questions:",
          parsedCards.map((card) => card.id)
        );

        // Load saved progress from localStorage
        const { cards: savedProgress, lastCardIndex } = loadProgress();

        // Restore progress for each card
        const restoredCards = parsedCards.map((card) => {
          const savedCard = savedProgress[card.id];
          if (savedCard) {
            return {
              ...card,
              timesCorrect: savedCard.timesCorrect,
              timesIncorrect: savedCard.timesIncorrect,
              lastReviewed: savedCard.lastReviewed
                ? new Date(savedCard.lastReviewed)
                : undefined,
            };
          }
          return card;
        });

        setCards(restoredCards);
        setCurrentCardIndex(lastCardIndex);
      } catch (error) {
        console.error("Error loading flashcards:", error);
      }
    };

    loadFlashcards();
  }, []);

  const handleKnown = () => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = {
      ...currentCard,
      timesCorrect: currentCard.timesCorrect + 1,
      lastReviewed: new Date(),
    };

    setCards(updatedCards);
    setKnownCards([...knownCards, currentCard]);
    setShowAnswer(false);

    // Cycle back to beginning when reaching the end
    const filteredCards = getFilteredCards();
    const nextIndex =
      currentCardIndex < filteredCards.length - 1 ? currentCardIndex + 1 : 0;
    setCurrentCardIndex(nextIndex);
    saveProgress(updatedCards, nextIndex);
  };

  const handleUnknown = () => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = {
      ...currentCard,
      timesIncorrect: currentCard.timesIncorrect + 1,
      lastReviewed: new Date(),
    };

    setCards(updatedCards);
    setUnknownCards([...unknownCards, currentCard]);
    setShowAnswer(false);

    // Cycle back to beginning when reaching the end
    const filteredCards = getFilteredCards();
    const nextIndex =
      currentCardIndex < filteredCards.length - 1 ? currentCardIndex + 1 : 0;
    setCurrentCardIndex(nextIndex);
    saveProgress(updatedCards, nextIndex);
  };

  const handleReset = () => {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(LAST_POSITION_KEY);
    window.location.reload();
  };

  const handleCardSelect = (index: number) => {
    setCurrentCardIndex(index);
    setShowQuestionList(false);
    setShowAnswer(false);
    saveProgress(cards, index);
  };

  // Update toggleStudyMode function to only handle unknown/all
  const toggleStudyMode = () => {
    setStudyMode(current => current === "all" ? "unknown" : "all");
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  // Add new function for marked mode
  const toggleMarkedMode = () => {
    setStudyMode(current => current === "marked" ? "all" : "marked");
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const toggleMark = (cardIndex: number) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      isMarked: !updatedCards[cardIndex].isMarked,
    };
    setCards(updatedCards);
    saveProgress(updatedCards, currentCardIndex);
  };

  useEffect(() => {
    if (
      showQuestionList &&
      currentQuestionRef.current &&
      questionListRef.current
    ) {
      // Wait for the modal animation to complete
      setTimeout(() => {
        currentQuestionRef.current?.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      }, 100);
    }
  }, [showQuestionList]);

  const currentCard = cards[currentCardIndex];

  if (cards.length === 0) {
    return <div>Loading flashcards...</div>;
  }

  // Add UI elements to render
  const renderCardControls = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Button onClick={handleUnknown} variant="destructive">
        <XCircle className="mr-2" /> Don't Know
      </Button>
      <Button
        onClick={() => toggleMark(currentCardIndex)}
        variant="outline"
        className={currentCard?.isMarked ? "border-yellow-500" : ""}
      >
        {currentCard?.isMarked ? <BookmarkCheck /> : <Bookmark />}
        {currentCard?.isMarked ? "Marked" : "Mark"}
      </Button>
      <Button onClick={handleKnown}>
        <CheckCircle className="mr-2" /> Know It  
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 pt-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Adatbázisok 2 vizsga kérdések
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => setShowQuestionList(!showQuestionList)}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => setDualView(!dualView)}
            >
              {dualView ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Columns className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800"
              onClick={toggleStudyMode}
            >
              {studyMode === "all" ? "Study Unknown Only" : "Study All"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-gray-700 hover:bg-gray-800 ${
                studyMode === "marked" ? "bg-yellow-500/20 text-yellow-500" : ""
              }`}
              onClick={toggleMarkedMode}
            >
              <BookmarkCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => setShowRangeSelector(true)}
            >
              <HashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add Range Selector */}
        {showRangeSelector && (
          <QuestionRangeSelector 
            totalQuestions={cards.length} 
            onSelectRange={(start, end) => {
              setSelectedRange({ start, end });
              setCurrentCardIndex(0);
              setShowAnswer(false);
            }}
            onClose={() => setShowRangeSelector(false)}
          />
        )}

        {showQuestionList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">Select Question</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQuestionList(false)}
                >
                  Close
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4" ref={questionListRef}>
                <div className="space-y-2">
                  {cards.map((card, index) => (
                    <Button
                      key={card.id}
                      ref={
                        index === currentCardIndex ? currentQuestionRef : null
                      }
                      variant="outline"
                      className={`w-full justify-start ${
                        index === currentCardIndex
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700"
                      }`}
                      onClick={() => handleCardSelect(index)}
                    >
                      <span className="mr-2">{card.id}.</span>
                      <span className="truncate">{card.question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
            <span>
              Question {currentCardIndex + 1} of {getFilteredCards().length}
            </span>
            {currentCard?.hasImage && (
              <span className="flex items-center">
                <ImageIcon size={16} className="mr-1" />
                Contains diagram
              </span>
            )}
          </div>
          <div className="h-1 bg-gray-800 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentCardIndex + 1) / getFilteredCards().length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Main Card */}
        {dualView ? (
          <div className="grid grid-cols-2 gap-8 mb-4">
            {/* First card - Question */}
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="min-h-[500px] flex flex-col">
                  <div className="mb-4 text-sm font-medium text-gray-400">
                    Question:
                  </div>
                  <div className="flex-grow">
                    <div className="text-xl leading-relaxed">
                      <MarkdownRenderer
                        content={currentCard?.question}
                        imagePath={undefined}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second card - Answer */}
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="min-h-[500px] flex flex-col">
                  <div className="mb-4 text-sm font-medium text-gray-400">
                    Answer:
                  </div>
                  <div className="flex-grow">
                    <div className="text-xl leading-relaxed">
                      <MarkdownRenderer
                        content={currentCard?.answer}
                        imagePath={currentCard?.imagePath}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <FlipCard
            question={currentCard?.question}
            answer={currentCard?.answer}
            imagePath={currentCard?.imagePath}
            onKnow={handleKnown}
            onDontKnow={handleUnknown}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            currentIndex={currentCardIndex}
            totalCards={cards.length}
          />
        )}
        {/* Action Buttons */}
        {renderCardControls()}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-4">
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Known</span>
              <span className="text-xl font-bold text-green-400">
                {knownCards.length}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Need Practice</span>
              <span className="text-xl font-bold text-red-400">
                {unknownCards.length}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Marked</span>
              <span className="text-xl font-bold text-yellow-400">
                {cards.filter(card => card.isMarked).length}
              </span>
            </div>
          </div>
        </div>

        {/* Card Stats */}
        {currentCard && (
          <div className="text-sm text-gray-500 flex justify-center gap-4">
            <span>Correct: {currentCard.timesCorrect}</span>
            <span>Incorrect: {currentCard.timesIncorrect}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export { FlashcardApp };
