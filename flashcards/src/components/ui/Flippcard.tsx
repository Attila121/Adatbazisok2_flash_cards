import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent } from './Card';
import MarkdownRenderer from '../../MarkdownRenderer';

interface FlipCardProps {
  question: string | undefined;
  answer: string | undefined;
  imagePath?: string;
  onKnow: () => void;
  onDontKnow: () => void;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  currentIndex: number;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
  question, 
  answer, 
  imagePath, 
  onKnow, 
  onDontKnow,
  showAnswer,
  setShowAnswer,
  currentIndex
}) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  
  useEffect(() => {
    controls.start({ x: 0, opacity: 1 });
  }, [currentIndex, controls]);
  
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    setIsDragging(false);
    const { offset } = info;
    
    if (offset.x > 100) {
      await controls.start({ x: 500, opacity: 0 });
      onKnow();
      setShowAnswer(false);
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0 } });
      await controls.start({ x: 0, opacity: 1, transition: { duration: 0.3 } });
    } else if (offset.x < -100) {
      await controls.start({ x: -500, opacity: 0 });
      onDontKnow();
      setShowAnswer(false);
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0 } });
      await controls.start({ x: 0, opacity: 1, transition: { duration: 0.3 } });
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleClick = async () => {
    if (!isDragging && !isFlipping) {
      setIsFlipping(true);
      setShowAnswer(!showAnswer);
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="mb-12 relative min-h-[500px]">
      
      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="cursor-pointer relative"
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={controls}
      >
        <div className="perspective-1000">
          <motion.div
            animate={{ 
              rotateY: showAnswer ? 180 : 0,
            }}
            transition={{ 
              duration: 0.5,
              type: "tween",
              ease: "easeInOut"
            }}
            className="w-full preserve-3d relative"
            style={{
              transformOrigin: "center center"
            }}
          >
            {/* Question side */}
            <Card className="mb-4 bg-gray-800 border-gray-700 absolute w-full backface-hidden">
              <CardContent className="p-6">
                <div className="min-h-[500px] flex flex-col">
                  <div className="mb-4 text-sm font-medium text-gray-400">
                    Question:
                  </div>
                  <div className="flex-grow">
                    <div className="text-xl leading-relaxed">
                      <MarkdownRenderer content={question} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer side */}
            <Card className="mb-4 bg-gray-800 border-gray-700 absolute w-full backface-hidden"
                 style={{ transform: 'rotateY(180deg)' }}>
              <CardContent className="p-6">
                <div className="min-h-[500px] flex flex-col">
                  <div className="mb-4 text-sm font-medium text-gray-400">
                    Answer:
                  </div>
                  <div className="flex-grow">
                    <div className="text-xl leading-relaxed">
                      <MarkdownRenderer 
                        content={answer}
                        imagePath={imagePath}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;