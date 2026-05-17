# level-selection Specification

## Purpose
TBD - created by archiving change fix-adventure-level-ui. Update Purpose after archive.
## Requirements
### Requirement: Level selection view display
The system SHALL display a level selection view when the user enters an area from the world map. The view SHALL show all levels in the area as a grid or list, with each level card displaying: level number, unlock status, completion stars (0-3), and area theme color.

#### Scenario: Display unlocked area levels
- **WHEN** user clicks "进入冒险" on an unlocked area in the world map
- **THEN** the level selection view renders with all levels for that area, showing level numbers 1 through N (where N is the area's level count)

#### Scenario: Show completion stars for completed levels
- **WHEN** a level has been previously completed
- **THEN** the level card displays the earned star rating (1-3 stars) based on performance

#### Scenario: Show locked state for locked levels
- **WHEN** a level is not yet unlocked (previous level not completed)
- **THEN** the level card displays a lock icon and is not clickable

### Requirement: Level navigation flow
The system SHALL allow navigation from world map → level selection → battle → level selection (after battle ends). The back button SHALL return to the previous view in the chain.

#### Scenario: Navigate from world map to level selection
- **WHEN** user selects an area on the world map and clicks "进入冒险"
- **THEN** the view switches to level selection for that area, and the back button returns to the world map

#### Scenario: Navigate from level selection to battle
- **WHEN** user clicks an unlocked level card
- **THEN** the view switches to the battle scene with the selected level's monster and difficulty

#### Scenario: Return to level selection after battle
- **WHEN** user clicks "继续" on the battle result dialog
- **THEN** the view returns to the level selection view for the same area

#### Scenario: Back navigation from level selection
- **WHEN** user clicks the back button on the level selection view
- **THEN** the view returns to the world map

### Requirement: Level unlock progression
The system SHALL enforce sequential level unlocking within an area. Level 1 is always unlocked when the area is unlocked. Each subsequent level unlocks only after the previous level is completed.

#### Scenario: First level is always accessible
- **WHEN** an area is unlocked
- **THEN** level 1 of that area is immediately playable

#### Scenario: Complete level unlocks next
- **WHEN** user completes level N with a victory result
- **THEN** level N+1 becomes unlocked and playable

### Requirement: Level selection UI styling
The level selection view SHALL use the area's theme color for visual consistency. Locked levels SHALL appear dimmed/grayed out. Completed levels SHALL show a subtle glow or highlight effect.

#### Scenario: Area theme color applied
- **WHEN** the level selection view is rendered for an area
- **THEN** the header, level card borders, and accent elements use the area's configured color

#### Scenario: Locked level visual state
- **WHEN** a level is locked
- **THEN** the card has reduced opacity (0.5) and displays a lock overlay

