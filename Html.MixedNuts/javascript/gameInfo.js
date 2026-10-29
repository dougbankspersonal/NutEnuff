// For stuff like rules variants, etc.
define(["dojo/domReady!"], function () {
  var maxPlayers = 5;
  var minPlayers = 2;

  const almondBackgroundColor = "#f98f8f";
  const cashewBackgroundColor = "#a1dbff";
  const hazelnutBackgroundColor = "#dba4ff";
  const pistachioBackgroundColor = "rgb(155, 224, 161)";
  const peanutBackgroundColor = "#f8e6c1";
  const walnutBackgroundColor = "rgb(241, 186, 83)";

  const acornBackgroundColor = "rgb(243, 243, 60)";
  const badNutBackgroundColor = "rgb(88, 88, 88)";

  const gNutTypes = {
    Almond: "almond",
    Cashew: "cashew",
    Hazelnut: "hazelnut",
    Pistachio: "pistachio",
    Peanut: "peanut",
    Walnut: "walnut",
  };

  const gSpecialNutTypes = {
    Acorn: "acorn",
    BadNut: "bad-nut",
  };

  const gNutNames = {
    [gNutTypes.Almond]: "Almond",
    [gNutTypes.Cashew]: "Cashew",
    [gNutTypes.Hazelnut]: "Hazelnut",
    [gNutTypes.Peanut]: "Peanut",
    [gNutTypes.Pistachio]: "Pistachio",
    [gNutTypes.Walnut]: "Walnut",
    [gSpecialNutTypes.Acorn]: "Acorn",
    [gSpecialNutTypes.BadNut]: "Bad Nut",
  };

  const gNutColors = {
    [gNutTypes.Almond]: almondBackgroundColor,
    [gNutTypes.Cashew]: cashewBackgroundColor,
    [gNutTypes.Hazelnut]: hazelnutBackgroundColor,
    [gNutTypes.Peanut]: peanutBackgroundColor,
    [gNutTypes.Pistachio]: pistachioBackgroundColor,
    [gNutTypes.Walnut]: walnutBackgroundColor,
    [gSpecialNutTypes.Acorn]: acornBackgroundColor,
    [gSpecialNutTypes.BadNut]: badNutBackgroundColor,
  };

  const gNutTypesArray = Object.values(gNutTypes);
  const gSpecialNutTypesArray = Object.values(gSpecialNutTypes);

  const gCoinString = "🪙";
  const gPackageString = "📦";

  return {
    maxPlayers: maxPlayers,
    minPlayers: minPlayers,

    nutTypes: gNutTypes,
    specialNutTypes: gSpecialNutTypes,
    nutTypesArray: gNutTypesArray,
    specialNutTypesArray: gSpecialNutTypesArray,
    nutNames: gNutNames,
    nutColors: gNutColors,

    coinString: gCoinString,
    packageString: gPackageString,
  };
});
