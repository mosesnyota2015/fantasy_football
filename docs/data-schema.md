# Fantasy Football App - Data Schema

This document outlines the potential data schema for future development of the Fantasy Football app.

## Current Schema (Prototype)

### Player
```json
{
  "id": "string",
  "name": "string",
  "position": "string",
  "stats": {},
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Future Schema

### User
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "hashed string",
  "profileImage": "string (url)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Team
```json
{
  "id": "string",
  "name": "string",
  "owner": "User ID reference",
  "players": ["Player ID references"],
  "league": "League ID reference",
  "totalPoints": "number",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### League
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "commissioner": "User ID reference",
  "teams": ["Team ID references"],
  "season": "string (e.g., '2023-2024')",
  "settings": {
    "draftDate": "ISO date string",
    "scoringSystem": "string",
    "maxTeams": "number",
    "playoffStartWeek": "number"
  },
  "status": "string (draft, active, completed)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Enhanced Player
```json
{
  "id": "string",
  "name": "string",
  "position": "string",
  "team": "string (NFL team)",
  "image": "string (url)",
  "status": "string (active, injured, suspended)",
  "stats": {
    "passingYards": "number",
    "passingTouchdowns": "number",
    "interceptions": "number",
    "rushingYards": "number",
    "rushingTouchdowns": "number",
    "receptions": "number",
    "receivingYards": "number",
    "receivingTouchdowns": "number",
    "fumbles": "number",
    "fieldGoals": "number",
    "extraPoints": "number"
  },
  "fantasyPoints": "number",
  "projectedPoints": "number",
  "newsUpdates": [
    {
      "date": "ISO date string",
      "title": "string",
      "content": "string",
      "source": "string"
    }
  ],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Game
```json
{
  "id": "string",
  "homeTeam": "string (NFL team)",
  "awayTeam": "string (NFL team)",
  "week": "number",
  "season": "string",
  "date": "ISO date string",
  "status": "string (scheduled, in-progress, final)",
  "score": {
    "homeScore": "number",
    "awayScore": "number"
  },
  "stats": {
    "playerStats": [
      {
        "playerId": "string",
        "stats": {}
      }
    ]
  }
}
```

### Fantasy Matchup
```json
{
  "id": "string",
  "league": "League ID reference",
  "week": "number",
  "season": "string",
  "homeTeam": "Team ID reference",
  "awayTeam": "Team ID reference",
  "homeScore": "number",
  "awayScore": "number",
  "status": "string (scheduled, in-progress, final)",
  "playerPerformances": [
    {
      "team": "home/away",
      "playerId": "Player ID reference",
      "points": "number",
      "stats": {}
    }
  ]
}
```

### Draft
```json
{
  "id": "string",
  "league": "League ID reference",
  "date": "ISO date string",
  "status": "string (scheduled, in-progress, completed)",
  "order": ["Team ID references"],
  "rounds": "number",
  "currentRound": "number",
  "currentPick": "number",
  "timePerPick": "number (seconds)",
  "picks": [
    {
      "round": "number",
      "pickNumber": "number",
      "team": "Team ID reference",
      "player": "Player ID reference",
      "timestamp": "ISO date string"
    }
  ]
}
```

## Database Relationships

- A User can own multiple Teams
- A League has multiple Teams
- A Team belongs to a League
- A Team has multiple Players
- A Player can belong to multiple Teams (across different Leagues)
- A League has one Draft
- A League has multiple Fantasy Matchups
- A Team participates in multiple Fantasy Matchups
- A Game has multiple Player Stats
- A Player has Stats in multiple Games

## API Endpoints (Future)

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/leagues` - League management
- `/api/teams` - Team management
- `/api/players` - Player information and stats
- `/api/games` - NFL game information
- `/api/matchups` - Fantasy matchup information
- `/api/drafts` - Draft management
- `/api/stats` - Player statistics
- `/api/news` - News and updates

This schema provides a foundation for developing a full-featured fantasy football application with user management, league creation, team management, drafting, and scoring functionality. 