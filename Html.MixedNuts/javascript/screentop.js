export default function (variant, index) {
  const gLightenedSeatColors = [
    "#f28b8b",
    "#7ed77e",
    "#ffed8b",
    "#7a8fe0",
    "#f9b28b",
    "#c48de0",
    "#7ef0f0",
    "#cccccc",
  ];

  var gNumPlayers = 5;
  var gNumHolderTypes = 3;

  var adjustedIndex = index - 1;
  var playerIndex = adjustedIndex % gNumPlayers;
  var holderType = Math.floor(adjustedIndex / gNumPlayers) % gNumHolderTypes;

  var seatColor = gLightenedSeatColors[playerIndex];
  var holderImageIndex = holderType + 1;

  return {
    baseFillColor: seatColor,
    baseAssetIndex: holderImageIndex,
  };
}
