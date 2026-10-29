define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------

  var gCardConfigs = [
    {
      nutTypeArray: [
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Walnut,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Hazelnut,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Almond,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Peanut,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Pistachio,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Cashew,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Cashew,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Walnut,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Peanut,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Hazelnut,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Pistachio,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Almond,
      ],
    },
    {
      nutTypeArray: [
        gameInfo.nutTypes.Almond,
        gameInfo.nutTypes.Walnut,
        gameInfo.nutTypes.Peanut,
        gameInfo.nutTypes.Hazelnut,
        gameInfo.nutTypes.Cashew,
        gameInfo.nutTypes.Pistachio,
      ],
    },
  ];

  // Just explicit.  Too lazy to try to code.
  // 6 basic nut types. 12 cards.
  // Every nut type shows up in every position twice.
  // No two cards are the same.
  // Cards are not just shift by one permustaions of each other.

  function generateCardConfigs() {
    if (gCardConfigs != null) {
      return;
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();

    return gCardConfigs;
  }

  function getNumCards() {
    generateCardConfigs();

    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  const gPointsArray = [4, 3, 2, 1, 1, 0];

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,

    pointsArray: gPointsArray,
  };
});
