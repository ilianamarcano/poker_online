/**
 * Each hand consists in a set of five​ cards. One hand wins if its hand ranking is better. If two hands are ranked equally,
 * then the hand with the highest value cards wins. If the two hands are both ranked equally and their highest cards are the same,
 * then the second highests cards are compared, and so on. If they are still equal, it’s a tie.
 */

const valueCards = [
  {name: '2', value: 1},
  {name: '3', value: 2},
  {name: '4', value: 3},
  {name: '5', value: 4},
  {name: '6', value: 5},
  {name: '7', value: 6},
  {name: '8', value: 7},
  {name: '9', value: 8},
  {name: 'Ten', value: 9},
  {name: 'Jack', value: 10},
  {name: 'Queen', value: 11},
  {name: 'King', value: 12},
  {name: 'Ace', value: 13}
];

const getSortedValueCards = (deck) => {
  return deck.sort((card1, card2) => {

    const valueCard1 = valueCards.find((valueCard) => {
      return valueCard.name === card1.number;
    });

    const valueCard2 = valueCards.find((valueCard) => {
      return valueCard.name === card2.number;
    });

    if (valueCard1.value > valueCard2.value) {
      return 1;
    }
    if (valueCard1.value < valueCard2.value) {
      return -1;
    }
    return 0;
  });
};

/**
 *  1. High Card: Highest value card. Order is 2, 3, 4, 5, 6, 7, 8, 9, Ten, Jack, Queen, King, Ace.
 */
const getHighestCard = (deck1, deck2) => {
  const deck1Sorted = getSortedValueCards(deck1);
  const deck2Sorted = getSortedValueCards(deck2);

  if (Math.max(deck1Sorted) > Math.max(deck2Sorted)) {
    return deck1Sorted[deck1Sorted.length - 1];
  }

  if (Math.max(deck1Sorted) !== Math.max(deck2Sorted)) {
    return deck2Sorted[deck2Sorted.length - 1];
  }

  return 'equals';
};

const findOnePair = function (deckSorted) {
  return deckSorted.find((card1) => {
    deckSorted.find((card2) => {
      return card1 === card2;
    });
  });
};

/**
 *  2. One Pair: Two cards of the same value.
 */
const hasOnePair = (deck) => {
  const deckSorted = getSortedValueCards(deck);
  const duplicated = findOnePair(deckSorted);

  return typeof duplicated !== 'undefined';
};

/**
 *   3. Two Pairs: Two different pairs.
 */
const hasTwoPairs = (deck) => {
  if (hasOnePair(deck)) {
    const duplicated = findOnePair(deck);
    const index = deck.indexOf(duplicated);

    deck.splice(index, 1);

    return hasOnePair(deck);
  }
};

/**
 *  4. Three of a Kind: Three cards of the same value.
 */
const hasThreeOfAKind = (deck) => {
  const count = 1;
  if (hasOnePair(deck)) {
    const duplicated = findOnePair(deck);
    const index = deck.indexOf(duplicated);

    deck.splice(index, 1);

    if (count === 2) {
      return hasOnePair(deck);
    }
    hasThreeOfAKind(deck);
  }
};

/**
 *   5. Straight: All cards are consecutive values.
 */
const hasStraight = (deck) => {
  const deckSorted = getSortedValueCards(deck);
  for (let i = 0; (i < deckSorted.length && typeof deckSorted[i + 1] !== 'undefined'); i++) {
    const valueCard = valueCards.find((valueCard) => {
      return valueCard.name === deckSorted[i].suit;
    });

    const valueCardNext = valueCards.find((valueCard) => {
      return valueCard.name === deckSorted[i + 1].suit;
    });

    if (valueCard.value !== valueCardNext.value - 1) {
      return false;
    }
  }
  return true;
};

/**
 *   6. Flush: All cards of the same suit.
 */
const hasFlush = () => {
  const deckSorted = getSortedValueCards(deck);
  for (let i = 0; (i < deckSorted.length && typeof deckSorted[i + 1] !== 'undefined'); i++) {
    const valueCard = valueCards.find((valueCard) => {
      return valueCard.name === deckSorted[i].suit;
    });

    const valueCardNext = valueCards.find((valueCard) => {
      return valueCard.name === deckSorted[i + 1].suit;
    });

    if (valueCard.suit !== valueCardNext.suit) {
      return false;
    }
  }
  return true;
};

/**
 *    7. Full House: Three of a kind and a pair.
 */
const hasFullHouse = (deck) => {
  return hasThreeOfAKind(deck) && hasOnePair(deck);
};

/**
 *   8. Four of a Kind: Four cards of the same value.
 */
const hasFourOfAKind = (deck) => {
  const count = 1;
  if (hasOnePair(deck)) {
    const duplicated = findOnePair(deck);
    const index = deck.indexOf(duplicated);

    deck.splice(index, 1);

    if (count === 3) {
      return hasOnePair(deck);
    }
    hasFourOfAKind(deck);
  }
};

/**
 *   9. Straight Flush: All cards are consecutive values of same suit.
 */
const hasStraightFlush = (deck) => {
  return hasStraight(deck) && hasFlush(deck);

};

const findRoyalValue = (deck, royal) => {
  return typeof deck.find((card) => {
    return card.number === royal
  }) !== 'undefined';
};
/**
 *   10. Royal Flush: Ten, Jack, Queen, King, Ace of same suit.
 */
const hasRoyalFlush = (deck) => {
  if (!hasFlush(deck)) {
    return false;
  }
  return findRoyalValue(deck, 'Ten') && findRoyalValue(deck, 'Jack') && findRoyalValue(deck, 'Queen')
    && findRoyalValue(deck, 'King') && findRoyalValue(deck, 'Ace');
};


export default {
  getHighestCard,
  hasOnePair,
  hasTwoPairs,
  hasThreeOfAKind,
  hasStraight,
  hasFlush,
  hasFullHouse,
  hasFourOfAKind,
  hasStraightFlush,
  hasRoyalFlush,
};