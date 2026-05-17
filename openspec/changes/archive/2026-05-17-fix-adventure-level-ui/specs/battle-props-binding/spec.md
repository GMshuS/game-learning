## ADDED Requirements

### Requirement: GameApp passes battle context to BattleGame
The GameApp component SHALL pass player info, monster data, grade level, and streak count as props to the BattleGame component when starting a battle.

#### Scenario: Start battle with full context
- **WHEN** `startBattle(area, level)` is called from the level selection view
- **THEN** BattleGame receives `player`, `monster`, `grade`, and `streak` props with correct values

#### Scenario: Player data includes current stats
- **WHEN** battle is started
- **THEN** the player prop includes name, hp, maxHp, attack, defense from the gameStore

#### Scenario: Monster data matches selected level
- **WHEN** battle is started for a specific level
- **THEN** the monster prop is determined by the area's difficulty and level number, not randomly generated

### Requirement: BattleGame uses received props instead of defaults
The BattleGame component SHALL use the props passed from GameApp to initialize the Phaser BattleScene. Default values SHALL only be used when props are null or undefined.

#### Scenario: Initialize scene with provided monster
- **WHEN** BattleGame receives a monster prop
- **THEN** the BattleScene is initialized with that monster, not a random one

#### Scenario: Initialize scene with provided player
- **WHEN** BattleGame receives a player prop
- **THEN** the BattleScene is initialized with the player's hp, maxHp, and name

#### Scenario: Grade determines question difficulty
- **WHEN** BattleGame receives a grade prop
- **THEN** the question generation uses the grade to determine appropriate math operations

### Requirement: Unified scene initialization via independent scene class
The BattleGame component SHALL start the battle using `game.scene.start('BattleScene', data)` with the independent `BattleScene` class from `src/scenes/BattleScene.js`, NOT an inline scene definition.

#### Scenario: Scene started with data payload
- **WHEN** BattleGame mounts
- **THEN** it calls `game.scene.start('BattleScene', { player, monster, grade, streak, onBattleEnd })`

#### Scenario: Battle end callback works
- **WHEN** the BattleScene ends (victory, defeat, or timeout)
- **THEN** the `onBattleEnd` callback is invoked with result, rewards, and streak data

### Requirement: AdventureMap uses independent WorldMapScene class
The AdventureMap component SHALL start the world map using `game.scene.start('WorldMapScene', data)` with the independent `WorldMapScene` class from `src/scenes/WorldMapScene.js`, NOT an inline scene definition. The `onAreaSelect` callback SHALL trigger the level selection view, not directly start a battle.

#### Scenario: WorldMapScene started with unlocked areas
- **WHEN** AdventureMap mounts
- **THEN** it calls `game.scene.start('WorldMapScene', { unlockedAreas, currentAreaId, onAreaSelect })`

#### Scenario: Area select triggers level selection
- **WHEN** user clicks "进入冒险" on an area in WorldMapScene
- **THEN** the `onAreaSelect` callback fires and GameApp switches to the level selection view for that area

### Requirement: No duplicate scene code in Vue components
The BattleGame.vue and AdventureMap.vue files SHALL NOT contain inline Phaser scene class definitions. All scene logic SHALL reside in `src/scenes/` files.

#### Scenario: BattleGame has no inline scene
- **WHEN** inspecting BattleGame.vue source code
- **THEN** there are no `class extends Phaser.Scene` or `createBattleScene` function definitions

#### Scenario: AdventureMap has no inline scene
- **WHEN** inspecting AdventureMap.vue source code
- **THEN** there are no `class extends Phaser.Scene` or `createWorldMapScene` function definitions
