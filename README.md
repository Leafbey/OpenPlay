# OpenPlay

OpenPlay is a desktop game launcher built around a fully widget-based interface.

## Initial build

This repository is starting from scratch. The first milestone is the **Default (Basic)** shell and Library experience, with every major content area implemented as a reusable widget rather than a hard-coded page.

### Visual direction

- Near-black / graphite / charcoal interface
- Cool-silver selection and focus states
- Game artwork provides most of the colour
- Green is reserved for an individual game's **Play** button
- No purple or blue OpenPlay accent
- No Play All
- Compact, desktop-first UI

### Default (Basic) Library widgets

- Game Library
- Game Banner
- Play Button
- Play Statistics
- Game Cover
- Game Information
- Game Description

The selected game is shared application state, so selecting a game updates every compatible widget.

## Planned first milestone

1. Desktop application shell
2. Permanent top bar and sidebar
3. Widget registry and layout model
4. Default (Basic) Library preset
5. Shared selected-game state
6. Edit Layout foundation
7. Add Widget foundation

Steam, Epic Games, Local Games and Collections will build on the same widget and game-data model after the base Library experience is established.
