// Player Model
class Player {
  // Create a new Player instance
  constructor(id, name, position, team = '', imageUrl = '', value = 0.0, stats = {}) {
    this.id = id;
    this.name = name;
    this.position = position; // e.g., 'GK', 'DEF', 'MID', 'FWD'
    this.team = team;
    this.imageUrl = imageUrl;
    this.value = value; // Player value in millions
    this.stats = {
      goals: stats.goals || 0,
      assists: stats.assists || 0,
      cleanSheets: stats.cleanSheets || 0, // CS
      saves: stats.saves || 0,             // S (mainly for GK)
      minutesPlayed: stats.minutesPlayed || 0,
      yellowCards: stats.yellowCards || 0, // Added
      redCards: stats.redCards || 0,       // Added
      // Add other relevant stats if needed
    };
    // Calculate points based on stats (example scoring)
    this.points = this.calculatePoints();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  calculatePoints() {
    let points = 0;
    // Basic scoring rules (customize as needed)
    points += (this.stats.goals || 0) * (this.position === 'FWD' ? 4 : this.position === 'MID' ? 5 : 6);
    points += (this.stats.assists || 0) * 3;
    points += (this.stats.cleanSheets || 0) * (this.position === 'GK' || this.position === 'DEF' ? 4 : this.position === 'MID' ? 1 : 0);
    points += Math.floor((this.stats.saves || 0) / 3) * (this.position === 'GK' ? 1 : 0); // 1 point per 3 saves for GK
    points += Math.floor((this.stats.minutesPlayed || 0) / 60) * 2; // 2 points for playing 60+ mins
    points -= (this.stats.yellowCards || 0) * 1; // -1 for yellow card
    points -= (this.stats.redCards || 0) * 3;   // -3 for red card
    // Add penalties saved, bonus points etc. later
    return points;
  }

  // Update player information (excluding stats)
  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'stats' && key !== 'points') {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date();
    return this;
  }

  // Update player stats and recalculate points
  updateStats(newStats) {
    this.stats = {
      ...this.stats,
      ...newStats,
    };
    this.points = this.calculatePoints(); // Recalculate points when stats change
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
      points: this.points,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

export default Player; 