let eloChart = null;

async function loadEloChart(teamSlug, year) {
  const apiUrl = `https://9o3f790vnk.execute-api.us-east-2.amazonaws.com/items/${teamSlug}-${year}`;
  const res = await fetch(apiUrl);
  const data = await res.json();

  if (!data?.eloData?.length) return;

  const labels = data.eloData.map(p => `Week ${p.week}`);
  const elos = data.eloData.map(p => p.elo);

  const ctx = document.getElementById("elo-chart").getContext("2d");

  if (eloChart) eloChart.destroy();

  eloChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Elo Rating",
          data: elos,
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

async function loadLeaderboard() {
  const apiUrl = "https://9o3f790vnk.execute-api.us-east-2.amazonaws.com/items";
  const res = await fetch(apiUrl);
  const items = await res.json();

  if (!Array.isArray(items)) return;

  items.sort((a, b) => (b.currentElo ?? 0) - (a.currentElo ?? 0));

  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = "";

  let rank = 1;

  for (const team of items) {
    if (!team.currentElo) continue;

    const tr = document.createElement("tr");

tr.innerHTML = `
  <td>${rank}</td>
  <td>${team.team}</td>
  <td>${team.currentElo}</td>
  <td>${team.highestElo?.elo ?? "–"}</td>
  <td>${team.lowestElo?.elo ?? "–"}</td>
`;


    tbody.appendChild(tr);
    rank++;
  }
}
