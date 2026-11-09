// For stuff like rules variants, etc.
define(["dojo/domReady!"], function () {
  const gMaxPlayers = 5;
  const gMinPlayers = 2;

  // Nut colors: alphabetical.
  const almondBackgroundColor = "#ffb4b4";
  const brazilBackgroundColor = "#ffd79b";
  const cashewBackgroundColor = "#f4ffae";
  const hazelnutBackgroundColor = "#cdffa2";
  const macadamiaBackgroundColor = "#9bffe8";
  const peanutBackgroundColor = "#97aaff";
  const pistachioBackgroundColor = "rgb(164, 134, 255)";
  const walnutBackgroundColor = "rgb(255, 131, 212)";

  const badNutBackgroundColor = "#9e9e9e";

  // Nut types: alphabetical.
  const gNutTypes = {
    Almond: "almond",
    DoubleAlmond: "double-almond",
    Brazil: "brazil",
    Cashew: "cashew",
    DoubleCashew: "double-cashew",
    Hazelnut: "hazelnut",
    Macadamia: "macadamia",
    DoubleMacadamia: "double-macadamia",
    Peanut: "peanut",
    DoublePeanut: "double-peanut",
    Pistachio: "pistachio",
    Walnut: "walnut",

    BadNut: "bad-nut",
  };

  const gNutNames = {
    [gNutTypes.Almond]: "Almond",
    [gNutTypes.DoubleAlmond]: "Double Almond",
    [gNutTypes.Brazil]: "Brazil Nut",
    [gNutTypes.Cashew]: "Cashew",
    [gNutTypes.DoubleCashew]: "Double Cashew",
    [gNutTypes.Hazelnut]: "Hazelnut",
    [gNutTypes.Macadamia]: "Macadamia",
    [gNutTypes.DoubleMacadamia]: "Double Macadamia",
    [gNutTypes.Peanut]: "Peanut",
    [gNutTypes.DoublePeanut]: "Double Peanut",
    [gNutTypes.Pistachio]: "Pistachio",
    [gNutTypes.Walnut]: "Walnut",
    [gNutTypes.BadNut]: "Bad Nut",
  };

  const gNutColors = {
    [gNutTypes.Almond]: almondBackgroundColor,
    [gNutTypes.Brazil]: brazilBackgroundColor,
    [gNutTypes.Cashew]: cashewBackgroundColor,
    [gNutTypes.Hazelnut]: hazelnutBackgroundColor,
    [gNutTypes.Macadamia]: macadamiaBackgroundColor,
    [gNutTypes.Peanut]: peanutBackgroundColor,
    [gNutTypes.DoubleAlmond]: almondBackgroundColor,
    [gNutTypes.DoubleCashew]: cashewBackgroundColor,
    [gNutTypes.DoubleMacadamia]: macadamiaBackgroundColor,
    [gNutTypes.DoublePeanut]: peanutBackgroundColor,
    [gNutTypes.Pistachio]: pistachioBackgroundColor,
    [gNutTypes.Walnut]: walnutBackgroundColor,
    [gNutTypes.BadNut]: badNutBackgroundColor,
  };

  const gNutTypesArray = [
    gNutTypes.Peanut,
    gNutTypes.DoublePeanut,
    gNutTypes.Almond,
    gNutTypes.DoubleAlmond,
    gNutTypes.Cashew,
    gNutTypes.DoubleCashew,
    gNutTypes.Macadamia,
    gNutTypes.DoubleMacadamia,
    gNutTypes.Walnut,
    gNutTypes.BadNut,
  ];

  const gCoinString = "🪙";
  const gPackageString = "📦";

  function getCraftNumber(nutType) {
    if (
      nutType == gNutTypes.Macadamia ||
      nutType == gNutTypes.DoubleMacadamia
    ) {
      return 4;
    }
    if (nutType == gNutTypes.Walnut) {
      return 2;
    }
    return 3;
  }

  function getKingPoints(nutType) {
    if (nutType == gNutTypes.Peanut) {
      return 7;
    }
    if (nutType == gNutTypes.Almond) {
      return 6;
    }
    if (nutType == gNutTypes.Cashew) {
      return 5;
    }
    return 4;
  }

  function getCraftPoints(nutType) {
    if (
      nutType == gNutTypes.Macadamia ||
      nutType == gNutTypes.DoubleMacadamia
    ) {
      return 7;
    }

    if (nutType == gNutTypes.Peanut || nutType == gNutTypes.DoublePeanut) {
      return 2;
    }
    if (
      nutType == gNutTypes.Almond ||
      nutType == gNutTypes.Walnut ||
      nutType == gNutTypes.DoubleAlmond
    ) {
      return 3;
    }
    if (nutType == gNutTypes.Cashew || nutType == gNutTypes.DoubleCashew) {
      return 4;
    }
    return 0;
  }

  return {
    maxPlayers: gMaxPlayers,
    minPlayers: gMinPlayers,

    nutTypes: gNutTypes,
    nutTypesArray: gNutTypesArray,
    nutNames: gNutNames,
    nutColors: gNutColors,

    coinString: gCoinString,
    packageString: gPackageString,

    getCraftNumber: getCraftNumber,
    getCraftPoints: getCraftPoints,
    getKingPoints: getKingPoints,
  };
});
