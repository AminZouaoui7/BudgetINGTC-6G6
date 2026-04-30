import { TarotCard } from '../data/tarot-cards';
import { motion } from 'motion/react';

interface CardMeaningProps {
  card: TarotCard;
  isReversed: boolean;
}

export function CardMeaning({ card, isReversed }: CardMeaningProps) {
  const meanings = isReversed ? card.reversed : card.upright;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {card.name}
        {isReversed && <span className="text-red-600 ml-2">(Reversed)</span>}
      </h3>

      <p className="text-gray-600 mb-4 italic">{card.description}</p>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          {isReversed ? 'Reversed Meanings:' : 'Upright Meanings:'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {meanings.map((meaning, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${
                isReversed
                  ? 'bg-red-100 text-red-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {meaning}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
