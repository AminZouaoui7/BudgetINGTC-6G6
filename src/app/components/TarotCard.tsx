import { motion } from 'motion/react';
import { TarotCard as TarotCardType } from '../data/tarot-cards';
import { Sparkles } from 'lucide-react';

interface TarotCardProps {
  card: TarotCardType;
  isRevealed: boolean;
  isReversed: boolean;
  onClick?: () => void;
}

export function TarotCard({ card, isRevealed, isReversed, onClick }: TarotCardProps) {
  return (
    <motion.div
      className="relative w-64 h-96 cursor-pointer perspective-1000"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0, rotateZ: isReversed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 border-2 border-purple-400 shadow-2xl flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <div className="grid grid-cols-3 gap-2 p-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-purple-400 rounded-full opacity-30" />
              ))}
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-600 shadow-2xl p-6 flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex flex-col items-center justify-between">
            {/* Card Number/Icon */}
            <div className="w-full text-center mb-4">
              <div className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold">
                {card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}
              </div>
            </div>

            {/* Card Symbol */}
            <div className="flex-1 flex items-center justify-center">
              <Sparkles className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
            </div>

            {/* Card Name */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.name}</h3>
              {isReversed && (
                <p className="text-sm text-red-600 font-semibold">(Reversed)</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
