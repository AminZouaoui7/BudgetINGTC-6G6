export interface TarotCard {
  id: string;
  name: string;
  suit?: string;
  arcana: 'major' | 'minor';
  upright: string[];
  reversed: string[];
  description: string;
}

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  {
    id: '0',
    name: 'The Fool',
    arcana: 'major',
    upright: ['New beginnings', 'Innocence', 'Spontaneity', 'Free spirit'],
    reversed: ['Recklessness', 'Taken advantage of', 'Inconsideration'],
    description: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.'
  },
  {
    id: '1',
    name: 'The Magician',
    arcana: 'major',
    upright: ['Manifestation', 'Resourcefulness', 'Power', 'Inspired action'],
    reversed: ['Manipulation', 'Poor planning', 'Untapped talents'],
    description: 'The Magician is about making higher and better use of all one\'s power. Everything that is manifested in the physical world has its beginning in the spiritual world.'
  },
  {
    id: '2',
    name: 'The High Priestess',
    arcana: 'major',
    upright: ['Intuition', 'Sacred knowledge', 'Divine feminine', 'Subconscious mind'],
    reversed: ['Secrets', 'Disconnected from intuition', 'Withdrawal'],
    description: 'The High Priestess is a card of mystery, stillness and passivity. She sits in her sacred space, guarding the secrets of the universe.'
  },
  {
    id: '3',
    name: 'The Empress',
    arcana: 'major',
    upright: ['Femininity', 'Beauty', 'Nature', 'Nurturing', 'Abundance'],
    reversed: ['Creative block', 'Dependence on others'],
    description: 'The Empress signifies a strong connection with our femininity, creativity, and abundance in all aspects of life.'
  },
  {
    id: '4',
    name: 'The Emperor',
    arcana: 'major',
    upright: ['Authority', 'Establishment', 'Structure', 'Father figure'],
    reversed: ['Domination', 'Excessive control', 'Lack of discipline'],
    description: 'The Emperor represents authority figures such as bosses, fathers, and leaders. He brings structure and stability.'
  },
  {
    id: '5',
    name: 'The Hierophant',
    arcana: 'major',
    upright: ['Spiritual wisdom', 'Religious beliefs', 'Conformity', 'Tradition'],
    reversed: ['Personal beliefs', 'Freedom', 'Challenging the status quo'],
    description: 'The Hierophant is a symbol of traditional values and institutions. He represents spiritual wisdom and conformity to social standards.'
  },
  {
    id: '6',
    name: 'The Lovers',
    arcana: 'major',
    upright: ['Love', 'Harmony', 'Relationships', 'Values alignment'],
    reversed: ['Self-love', 'Disharmony', 'Imbalance', 'Misalignment of values'],
    description: 'The Lovers represent perfect union, harmony and mutual attraction. This card can also reflect a moral dilemma.'
  },
  {
    id: '7',
    name: 'The Chariot',
    arcana: 'major',
    upright: ['Control', 'Willpower', 'Success', 'Determination'],
    reversed: ['Self-discipline', 'Opposition', 'Lack of direction'],
    description: 'The Chariot tarot card is about overcoming challenges and gaining victory through maintaining control of your surroundings.'
  },
  {
    id: '8',
    name: 'Strength',
    arcana: 'major',
    upright: ['Strength', 'Courage', 'Persuasion', 'Influence', 'Compassion'],
    reversed: ['Inner strength', 'Self-doubt', 'Low energy', 'Raw emotion'],
    description: 'Strength is about compassion, courage, and inner power. It represents the strength of the human spirit and the power of love.'
  },
  {
    id: '9',
    name: 'The Hermit',
    arcana: 'major',
    upright: ['Soul searching', 'Introspection', 'Being alone', 'Inner guidance'],
    reversed: ['Isolation', 'Loneliness', 'Withdrawal'],
    description: 'The Hermit suggests that you are in a phase of introspection where you are drawing your attention inwards.'
  },
  {
    id: '10',
    name: 'Wheel of Fortune',
    arcana: 'major',
    upright: ['Good luck', 'Karma', 'Life cycles', 'Destiny', 'Turning point'],
    reversed: ['Bad luck', 'Resistance to change', 'Breaking cycles'],
    description: 'The Wheel of Fortune reminds us that the wheel is always turning and life is in a state of constant change.'
  },
  {
    id: '11',
    name: 'Justice',
    arcana: 'major',
    upright: ['Justice', 'Fairness', 'Truth', 'Cause and effect', 'Law'],
    reversed: ['Unfairness', 'Lack of accountability', 'Dishonesty'],
    description: 'Justice represents truth, fairness and the law. You are being called to account for your actions.'
  },
  {
    id: '12',
    name: 'The Hanged Man',
    arcana: 'major',
    upright: ['Pause', 'Surrender', 'Letting go', 'New perspectives'],
    reversed: ['Delays', 'Resistance', 'Stalling', 'Indecision'],
    description: 'The Hanged Man is about letting go, surrendering to the moment and changing your perspective.'
  },
  {
    id: '13',
    name: 'Death',
    arcana: 'major',
    upright: ['Endings', 'Change', 'Transformation', 'Transition'],
    reversed: ['Resistance to change', 'Personal transformation', 'Inner purging'],
    description: 'Death is about endings and beginnings, birth and rebirth, change and transformation. It rarely indicates physical death.'
  },
  {
    id: '14',
    name: 'Temperance',
    arcana: 'major',
    upright: ['Balance', 'Moderation', 'Patience', 'Purpose'],
    reversed: ['Imbalance', 'Excess', 'Self-healing', 'Re-alignment'],
    description: 'Temperance is about finding balance and creating harmony in your life through patience and moderation.'
  },
  {
    id: '15',
    name: 'The Devil',
    arcana: 'major',
    upright: ['Shadow self', 'Attachment', 'Addiction', 'Restriction'],
    reversed: ['Releasing limiting beliefs', 'Exploring dark thoughts', 'Detachment'],
    description: 'The Devil represents your shadow side and the negative forces that keep you bound to unhealthy attachments.'
  },
  {
    id: '16',
    name: 'The Tower',
    arcana: 'major',
    upright: ['Sudden change', 'Upheaval', 'Chaos', 'Revelation', 'Awakening'],
    reversed: ['Personal transformation', 'Fear of change', 'Averting disaster'],
    description: 'The Tower marks a time of great turmoil and destruction that clears away the old to make way for the new.'
  },
  {
    id: '17',
    name: 'The Star',
    arcana: 'major',
    upright: ['Hope', 'Faith', 'Purpose', 'Renewal', 'Spirituality'],
    reversed: ['Lack of faith', 'Despair', 'Self-trust', 'Disconnection'],
    description: 'The Star brings renewed hope and faith and a sense that you are truly blessed by the universe.'
  },
  {
    id: '18',
    name: 'The Moon',
    arcana: 'major',
    upright: ['Illusion', 'Fear', 'Anxiety', 'Subconscious', 'Intuition'],
    reversed: ['Release of fear', 'Repressed emotion', 'Inner confusion'],
    description: 'The Moon is a card of illusion and deception. Things are not as they seem. Your intuition is your guide.'
  },
  {
    id: '19',
    name: 'The Sun',
    arcana: 'major',
    upright: ['Positivity', 'Fun', 'Warmth', 'Success', 'Vitality'],
    reversed: ['Inner child', 'Feeling down', 'Overly optimistic'],
    description: 'The Sun represents success, radiance and abundance. It is a very positive card full of optimism and joy.'
  },
  {
    id: '20',
    name: 'Judgement',
    arcana: 'major',
    upright: ['Judgement', 'Rebirth', 'Inner calling', 'Absolution'],
    reversed: ['Self-doubt', 'Inner critic', 'Ignoring the call'],
    description: 'Judgement is about reflection, reckoning and transformation. You are being called to account for your actions.'
  },
  {
    id: '21',
    name: 'The World',
    arcana: 'major',
    upright: ['Completion', 'Integration', 'Accomplishment', 'Travel'],
    reversed: ['Seeking personal closure', 'Short-cuts', 'Delays'],
    description: 'The World represents completion and accomplishment. You have achieved a significant milestone and can now move on.'
  }
];
