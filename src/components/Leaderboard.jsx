export default function Leaderboard({ leaderboard = [] }) {
  // Sort players by wins descending
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.wins - a.wins);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return index + 1;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Leaderboard</h2>
      {sortedLeaderboard.length === 0 ? (
        <p style={styles.noData}>No scores yet.</p>
      ) : (
        <table style={styles.table} aria-label="Leaderboard Table">
          <thead>
            <tr>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Player</th>
              <th style={styles.th}>Wins</th>
              <th style={styles.th}>Losses</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.slice(0, 3).map(({ username, wins, losses }, index) => (
              <tr key={username} style={styles.row}>
                <td style={styles.td}>{getRankIcon(index)}</td>
                <td style={styles.td}>{username}</td>
                <td style={styles.td}>{wins}</td>
                <td style={styles.td}>{losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '0 auto',
    fontSize: 14,
    color: '#fa8484ff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#a67373ff',
  },
  noData: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#ce6969ff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #007bff',
    textAlign: 'left',
    padding: '8px 12px',
    color: '#007bff',
  },
  td: {
    borderBottom: '1px solid #d14a4aff',
    padding: '8px 12px',
  },
  row: {
    backgroundColor: 'white',
  },
};