define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const gCardConfigs = [
    {
      motions: [
        "Any Luxury Nut (Macadamia, Pistachio, Walnut) package must also include a Peanut",
        "Luxury Nut packages score +2 end of game.",
      ],
    },
    {
      motions: [
        "When packaging a Peanut take a coin token.",
        "When packaging an Almond take a coin token.",
      ],
    },
    {
      motions: [
        "2 squirrels with cleanest floors (ties friendly) can exchange a card from their hand during Packaging.",
        "2 squirrels with messiest floors (ties friendly) may put a card from the floor back in their hand during Packaging.",
      ],
    },
    {
      motions: [
        "During Conveyor setup, place a coin token on every other card of the first half of the conveyor belt",
        "During Conveyor setup, place a coin token on every other card of the second half of the conveyor belt",
      ],
    },
    {
      motions: [
        "Squirrel who collects the fewest cards in a shift gets 5 tokens. (ties friendly).",
        "Squirrel who collects the most cards in a shift (ties friendly) may discard one card during cleanup.",
      ],
    },
    {
      motions: [
        "One time during packaging, each player may underfill a package by 1.",
        "During final scoring any underfilled packages incur a -2 penalty.",
      ],
    },
  ];

  //-----------------------------------------
  //
  // Functions
  //
  //-----------------------------------------
  function addMotion(parent, motion, index) {
    var motionNode = htmlUtils.addDiv(parent, ["motion", "motion-" + index]);
    htmlUtils.addImage(motionNode, ["checkbox"], "checkbox-" + index);

    var motionText = htmlUtils.addDiv(
      motionNode,
      ["motion-text"],
      "motion-text-" + index,
      motion,
    );

    return motionNode;
  }

  function addCardFront(parent, cardConfig, index) {
    var motions = cardConfig.motions;
    console.assert(motions, "Expected cardConfig.motions to be defined");
    console.assert(
      motions.length == 2,
      "Expected motions array to have length 2",
    );

    var classArray = ["motions"];
    var cardFrontNode = cards.addCardFront(
      parent,
      classArray,
      "motions" + index,
    );

    addMotion(cardFrontNode, motions[0], 0);
    htmlUtils.addDiv(
      cardFrontNode,
      ["motion-divider"],
      "motion-divider-" + index,
    );
    addMotion(cardFrontNode, motions[1], 1);

    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: index = " + index,
    );
    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: gCardConfigs = " +
        JSON.stringify(gCardConfigs),
    );

    var cardConfig = gCardConfigs[index];
    console.assert(
      cardConfig,
      "Expected cardConfig to be defined for index = " + index,
    );

    addCardFront(parent, cardConfig, index);
  }

  var gNumCards = 0;
  function getNumCards() {
    // Wait until we're asked to calculate so system configs can be applied.
    if (gNumCards === 0) {
      gNumCards = gCardConfigs.length;
    }
    return gNumCards;
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    addCardFrontAtIndex: addCardFrontAtIndex,
  };
});
