// Player Model
class Player {
  // Create a new Player instance
  constructor(id, name, position, team = '', imageUrl = '', value = 0.0, stats = {}) {
    this.id = id;
    this.name = name;
    this.position = position; //  'GK', 'DEF', 'MID', 'FWD'
    this.team = team;
    this.imageUrl = imageUrl;
    this.value = value; // Player value in millions
    this.stats = {
      goals: stats.goals || 0,
      assists: stats.assists || 0,
      cleanSheets: stats.cleanSheets || 0, // CS
      saves: stats.saves || 0,             // S (for GK)
      minutesPlayed: stats.minutesPlayed || 0,
      yellowCards: stats.yellowCards || 0, // Added
      redCards: stats.redCards || 0,       // Added
      totalPoints: 0
    };
    this.calculatePoints();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  calculatePoints() {
    let points = 0;
    
    // Minutes played points
    points += Math.floor(this.stats.minutesPlayed / 90) * 2; // 2 points per 90 minutes
    
    // Goals
    switch(this.position) {
      case 'GK':
      case 'DEF':
        points += this.stats.goals * 6;
        break;
      case 'MID':
        points += this.stats.goals * 5;
        break;
      case 'FWD':
        points += this.stats.goals * 4;
        break;
    }
    
    // Assists
    points += this.stats.assists * 3;
    
    // Clean sheets
    if (this.position === 'GK' || this.position === 'DEF') {
      points += this.stats.cleanSheets * 4;
    } else if (this.position === 'MID') {
      points += this.stats.cleanSheets * 1;
    }
    
    // Saves (Goalkeepers only)
    if (this.position === 'GK') {
      points += Math.floor(this.stats.saves / 3); // 1 point per 3 saves
    }
    
    // Cards
    points -= this.stats.yellowCards * 1;
    points -= this.stats.redCards * 3;
    
    this.stats.totalPoints = points;
    return points;
  }

  // Update player information (excluding stats)
  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'stats' && key !== 'points') {
        this[key] = data[key];
      }
    });
    this.calculatePoints();
    this.updatedAt = new Date();
    return this;
  }

  // Update player stats and recalculate points
  updateStats(newStats) {
    this.stats = { ...this.stats, ...newStats };
    this.calculatePoints();
    this.updatedAt = new Date();
    return this;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      team: this.team,
      imageUrl: this.imageUrl,
      value: this.value,
      stats: this.stats, // Includes yellow/red cards now
      points: this.stats.totalPoints,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  static isValidPosition(position) {
    return ['GK', 'DEF', 'MID', 'FWD'].includes(position);
  }

  static getPositionColor(position) {
    switch(position) {
      case 'GK': return '#f1c40f';
      case 'DEF': return '#2ecc71';
      case 'MID': return '#3498db';
      case 'FWD': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  static getFormationPositions(formation) {
    const formations = {
      '4-4-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
      '4-3-3': { GK: 1, DEF: 4, MID: 3, FWD: 3 },
      '3-5-2': { GK: 1, DEF: 3, MID: 5, FWD: 2 },
      '5-3-2': { GK: 1, DEF: 5, MID: 3, FWD: 2 }
    };
    return formations[formation] || formations['4-4-2'];
  }
}

export default Player; 