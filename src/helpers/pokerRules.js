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
  {name: '10', value: 9},
  {name: 'J', value: 10},
  {name: 'Q', value: 11},
  {name: 'K', value: 12},
  {name: 'A', value: 13}
];

const getSortOrder = (card1, card2) =>{
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
}

const getSortedValueCards = (deck) => {
  return deck.sort((card1, card2) => {
    return getSortOrder(card1, card2);
  });
};

/**
 *  1. High Card: Highest value card. Order is 2, 3, 4, 5, 6, 7, 8, 9, Ten, Jack, Queen, King, Ace.
 */
const getHighestCard = (deck1, deck2) => {

  const deck1Sorted = getSortedValueCards(deck1);
  const deck2Sorted = getSortedValueCards(deck2);

  const deck1Length = deck1Sorted.length-1;
  const deck2Length = deck2Sorted.length-1;

  if (getSortOrder(deck1Sorted[deck1Length],deck2Sorted[deck2Length])===1) {
    return {player: 1, card: deck1Sorted[deck1Sorted.length - 1]};
  }

  if (getSortOrder(deck1Sorted[deck1Length],deck2Sorted[deck2Length])===-1) {
    return {player: 2, card: deck2Sorted[deck2Sorted.length - 1]};
  }

  return 'equals';
};

const findOnePair = function (deckSorted) {
  for (let i = 0; (i < deckSorted.length && typeof deckSorted[i + 1] !== 'undefined'); i++) {
    if (deckSorted[i].number === deckSorted[i + 1].number) {
      return deckSorted[i];
    }
  }
  return undefined;
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

    const deckTmp = Object.assign([], deck);

    deckTmp.splice(index, 1);

    return hasOnePair(deckTmp);
  }
  return false;
};

/**
 *  4. Three of a Kind: Three cards of the same value.
 */
const hasThreeOfAKind = (deck) => {
  if (hasTwoPairs(deck)) {
    const duplicated = findOnePair(deck);
    const index = deck.indexOf(duplicated);

    const deckTmp = Object.assign([], deck);

    deckTmp.splice(index, 1);
    return hasTwoPairs(deckTmp);
  }
  return false;
};

/**
 *   5. Straight: All cards are consecutive values.
 */
const hasStraight = (deck) => {
  const deckSorted = getSortedValueCards(deck);
  for (let i = 0; (i < deckSorted.length && typeof deckSorted[i + 1] !== 'undefined'); i++) {


    if (parseInt(deckSorted[i].number) !== deckSorted[i + 1].number - 1) {
      return false;
    }
  }
  return true;
};

/**
 *   6. Flush: All cards of the same suit.
 */
const hasFlush = (deck) => {
  const deckSorted = getSortedValueCards(deck);
  for (let i = 0; (i < deckSorted.length && typeof deckSorted[i + 1] !== 'undefined'); i++) {


    if (deckSorted[i].suit !== deckSorted[i + 1].suit) {
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
  if (hasThreeOfAKind(deck)) {
    const duplicated = findOnePair(deck);
    const index = deck.indexOf(duplicated);

    const deckTmp = Object.assign([], deck);

    deckTmp.splice(index, 1);

    return hasThreeOfAKind(deckTmp);
  }
  return false;
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
  return findRoyalValue(deck, '10') && findRoyalValue(deck, 'J') && findRoyalValue(deck, 'Q')
    && findRoyalValue(deck, 'K') && findRoyalValue(deck, 'A');
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
  getSortedValueCards,
};