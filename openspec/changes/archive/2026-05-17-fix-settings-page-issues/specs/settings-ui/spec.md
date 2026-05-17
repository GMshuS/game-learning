## ADDED Requirements

### Requirement: Settings dropdown text visibility
The settings panel SHALL ensure all dropdown (`<select>`) text is visible against the dark background. Both selected and unselected options MUST use a light color (white or near-white).

#### Scenario: Grade selection dropdown displays correctly
- **WHEN** the user opens the grade selection dropdown
- **THEN** all grade options are displayed in a light color readable against the dark background

#### Scenario: Language selection dropdown displays correctly
- **WHEN** the user opens the language selection dropdown
- **THEN** all language options are displayed in a light color readable against the dark background

### Requirement: Difficulty card text readability
The difficulty setting cards SHALL use light-colored text for all labels and descriptions to ensure readability against the dark card background.

#### Scenario: Difficulty card title is readable
- **WHEN** the difficulty cards are displayed
- **THEN** the difficulty title (h4) is displayed in white or near-white color

#### Scenario: Difficulty card description is readable
- **WHEN** the difficulty cards are displayed
- **THEN** the difficulty description (p) is displayed in a light color with sufficient contrast

### Requirement: Difficulty selection state update
Clicking a difficulty card SHALL update the selected difficulty and visually reflect the change immediately.

#### Scenario: User selects a different difficulty
- **WHEN** the user clicks on a non-selected difficulty card
- **THEN** the clicked card becomes visually selected (highlighted border and background) and the previously selected card returns to normal state

#### Scenario: Selected difficulty persists after click
- **WHEN** the user clicks a difficulty card
- **THEN** the `localSettings.difficulty` value is updated and the UI reflects the new selection

### Requirement: Export game data
The system SHALL allow users to export all game data (settings, progress, inventory, etc.) as a downloadable JSON file.

#### Scenario: User clicks export button
- **WHEN** the user clicks the "导出数据" button in the data management tab
- **THEN** a JSON file containing all game data is downloaded to the user's device

#### Scenario: Export file contains valid data
- **WHEN** the export is triggered
- **THEN** the downloaded file contains valid JSON with settings, player progress, and other relevant game data

### Requirement: Import game data
The system SHALL allow users to import game data from a previously exported JSON file.

#### Scenario: User clicks import button
- **WHEN** the user clicks the "导入数据" button in the data management tab
- **THEN** a file picker dialog opens allowing the user to select a JSON file

#### Scenario: Valid data is imported successfully
- **WHEN** the user selects a valid JSON export file
- **THEN** the game data is loaded from the file, settings are updated, and the UI reflects the imported data

#### Scenario: Invalid file is rejected
- **WHEN** the user selects a file that is not valid JSON or has incorrect structure
- **THEN** the system displays an error message and does not modify existing game data
