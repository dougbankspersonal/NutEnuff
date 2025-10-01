local TOKEN_1_GUID = "23a94d"
local TOKEN_5_GUID = "5c4b70"
local TOKEN_10_GUID = "b372bd"

local HIDDEN_ZONE_SCALE = 5

local tokenCreationDescriptors = {
  { guid = TOKEN_1_GUID,  count = 5, protoype = nil },
  { guid = TOKEN_5_GUID,  count = 1, protoype = nil },
  { guid = TOKEN_10_GUID, count = 2, protoype = nil },
}
-- === CONFIG ===
local ZONE_OFFSET = Vector(0, 0, 5) -- relative to hand zone center

-- === INTERNAL STATE ===
local gPlayerZones = {}  -- color -> zone guid
local gPlayerTokens = {} -- color -> {guids}

----===== Genera; Utils
---
---    q   q
local tagRegExp = "setupForPlayer"
local function debugLog(tag, ...)
  -- Check the tag reg exp to see if tag is enabled.
  if string.match(tag, tagRegExp) then
    print("[" .. tag .. "] " .. string.format(...))
  end
end

-- Utility for printing.-- Flatten table to string.
function FlattenTable(t, sep, prefix)
  sep = sep or "."      -- separator between nested keys
  prefix = prefix or "" -- starting key prefix
  local parts = {}

  for k, v in pairs(t) do
    local key = tostring(k)
    local newPrefix = prefix ~= "" and (prefix .. sep .. key) or key

    if type(v) == "table" then
      -- recurse into nested table
      table.insert(parts, FlattenTable(v, sep, newPrefix))
    else
      -- convert value to string
      table.insert(parts, newPrefix .. "=" .. tostring(v))
    end
  end

  return table.concat(parts, ", ")
end

-- Apply handTransform to [pod, get pos in world spaece.
function ApplyHandTransformToLocalOffset(handTransform, localOffset)
  -- This is terrible but best we can do.
  -- Make a dummy object.
  local dummyObject = spawnObject({
    type = "BlockSquare",
    position = vd,
    rotation = handTransform.rotation,
    scale = { 0.1, 0.1, 0.1 },
    sound = false,
    snap_to_grid = false
  })
  dummyObject.setInvisibleTo(Player.getColors())
  print("localOffset: ", FlattenTable(localOffset))
  a
  -- Use that to get offset position.
  local worldPos = dummyObject.positionToWorld(localOffset)
  dummyObject.destroy()
  return worldPos
end

function OnPlayerChangeColor(player, color)
  CleanupForPlayer(player.steam_id)
  if color ~= "Grey" then
    SetupForPlayer(color)
  end
end

function OnPlayerLeave(player)
  CleanupForPlayer(player.steam_id)
end

function SetInvisibleToEveryoneElse(obj, ownerColor)
  debugLog("setInvisibleToEveryoneElse", "ownerColor: " .. ownerColor)

  obj.setInvisibleTo({}) -- clear first
  local allPossiblePlayerColorsInTTS = {
    "White", "Brown", "Red", "Orange", "Yellow", "Green", "Teal", "Blue", "Purple", "Pink"
  }
  -- Build a list.
  local invisibleToColors = {}
  for i = 1, #allPossiblePlayerColorsInTTS do
    local playerColor = allPossiblePlayerColorsInTTS[i]
    debugLog("setInvisibleToEveryoneElse", "playerColor = " .. playerColor)
    if playerColor ~= ownerColor and playerColor ~= "Grey" then
      debugLog("setInvisibleToEveryoneElse", "adding to table ='" .. FlattenTable(invisibleToColors) .. "'")
      table.insert(invisibleToColors, playerColor)
      debugLog("setInvisibleToEveryoneElse", "#invisibleToColors = " .. #invisibleToColors)
    end
  end
  debugLog("setInvisibleToEveryoneElse", "outside Loop: #invisibleToColors = " .. #invisibleToColors)
  debugLog("setInvisibleToEveryoneElse", "invisibleToColors[1]", invisibleToColors[1])
  local invisibleToColorsAsString = table.concat(invisibleToColors, ", ")
  debugLog("setInvisibleToEveryoneElse", "invisibleToColorsAsString: " .. invisibleToColorsAsString)

  obj.setInvisibleTo(invisibleToColors)
end

function AddTokensForZone(zonePos, color)
  debugLog("addTokens", "color: " .. color)
  for i = 1, #tokenCreationDescriptors do
    local tokenCreationDescriptor = tokenCreationDescriptors[i]
    if not tokenCreationDescriptor.prototype then
      print("Error: No prototype for token with guid " .. tokenCreationDescriptor.guid)
      return
    end
    for j = 1, tokenCreationDescriptor.count + 1 do
      local flattededTokenDescri
      ptor = FlattenTable(tokenCreationDescriptor)

      debugLog("AddTokensforZone", "encodedDescriptor = ", flattededTokenDescriptor)
      local token = tokenCreationDescriptor.prototype.clone({
        position = zonePos + Vector(math.random() - 0.5, 1, math.random() - 0.5),
      })
      -- Tint the token with the color.
      token.setColorTint(color)

      table.insert(gPlayerTokens[color], token.getGUID())
      print("Added token " .. token.getGUID() .. " for " .. color)
    end
  end
end

function AddZoneForPlayer(color)
  debugLog("setupForPlayer", "color: " .. color)
  local handTransform = Player[color].getHandTransform()
  if not handTransform then return end

  -- Position new zone next to hand zone
  local zonePos = ApplyHandTransformToLocalOffset(handTransform, ZONE_OFFSET)
  local zoneRot = { 0, handTransform.rotation.y, 0 }

  local zone = spawnObject({
    type = "FogOfWarTrigger",
    position = zonePos,
    rotation = zoneRot,
    scale = { HIDDEN_ZONE_SCALE, HIDDEN_ZONE_SCALE, HIDDEN_ZONE_SCALE },
  })
  debugLog("setupForPlayer", "Added zone for " .. color)
  zone.setColorTint(color)
  debugLog("tintedTheZone : " .. color);

  SetInvisibleToEveryoneElse(zone, color)
  return zone
end

-- Create hidden zone + tokens
function SetupForPlayer(color)
  local zone = AddZoneForPlayer(color)

  gPlayerZones[color] = zone.getGUID()
  gPlayerTokens[color] = {}


  -- Spawn tokens inside
  AddTokensForZone(zone.getPosition(), color)
end

-- Clean up when leaving/changing
function CleanupForPlayer(idOrColor)
  local color = nil
  if type(idOrColor) == "string" then
    color = idOrColor
  else
    -- lookup by steam_id
    for c, _ in pairs(gPlayerZones) do
      if Player[c].steam_id == idOrColor then
        color = c
        break
      end
    end
  end
  if not color then return end

  -- Destroy zone
  if gPlayerZones[color] then
    local zone = getObjectFromGUID(gPlayerZones[color])
    if zone then zone.destroy() end
    gPlayerZones[color] = nil
  end

  -- Destroy tokens
  if gPlayerTokens[color] then
    for _, guid in ipairs(gPlayerTokens[color]) do
      local obj = getObjectFromGUID(guid)
      if obj then obj.destroy() end
    end
    gPlayerTokens[color] = nil
  end
end

function LoadTokenObjects()
  for i = 1, #tokenCreationDescriptors do
    local desc = tokenCreationDescriptors[i]
    desc.prototype = getObjectFromGUID(desc.guid)
    debugPrin(("Loaded object frmo guidL %s))="):format(desc.guid))
    if not desc.prototype then
      print("Error: Could not find token with guid " .. desc.guid)
      return
    end
  end
end

function onLoad()
  debugLog("onLoad", "onLoad")
  -- Load the token objects
  LoadTokenObjects()
  -- Do the setup for all players in the game.
  for _, player in pairs(Player.getPlayers()) do
    debugLog("onLoad", "in for loop")
    if player.color ~= "Grey" then
      SetupForPlayer(player.color)
    end
  end
end
