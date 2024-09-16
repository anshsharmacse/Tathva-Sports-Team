const playerForm = document.getElementById('playerForm');
const playerNameInput = document.getElementById('playerName');
const playerPositionInput = document.getElementById('playerPosition');
const teamList = document.getElementById('teamList');
const newsSection = document.createElement('section');
newsSection.className = 'news-section';

let teamPlayers = [];

function renderTeam() {
    teamList.innerHTML = '';
    teamPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td>
                <button class="delete" onclick="deletePlayer(${index})">Delete</button>
            </td>
        `;
        teamList.appendChild(row);
    });
}

function addPlayer(event) {
    event.preventDefault();
    const playerName = playerNameInput.value.trim();
    const playerPosition = playerPositionInput.value.trim();
    if (playerName && playerPosition) {
        const newPlayer = {
            name: playerName,
            position: playerPosition,
        };
        teamPlayers.push(newPlayer);
        renderTeam();
        playerNameInput.value = '';
        playerPositionInput.value = '';
    }
}

function deletePlayer(index) {
    teamPlayers.splice(index, 1);
    renderTeam();
}

playerForm.addEventListener('submit', addPlayer);

async function fetchSportsNews() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        const newsTitle = document.createElement('h2');
        newsTitle.textContent = "Latest Sports News";
        newsSection.appendChild(newsTitle);
        data.slice(0, 5).forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'news-article';
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.body}</p>
            `;
            newsSection.appendChild(articleElement);
        });
        document.body.appendChild(newsSection);
    } catch (error) {
        console.error("Error fetching sports news:", error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Unable to fetch news at the moment.";
        newsSection.appendChild(errorMessage);
        document.body.appendChild(newsSection);
    }
}

fetchSportsNews();

function saveTeam() {
    localStorage.setItem('teamPlayers', JSON.stringify(teamPlayers));
}

function loadTeam() {
    const storedTeam = localStorage.getItem('teamPlayers');
    if (storedTeam) {
        teamPlayers = JSON.parse(storedTeam);
        renderTeam();
    }
}

const saveButton = document.createElement('button');
saveButton.textContent = 'Save the list of Team';
saveButton.onclick = saveTeam;
document.body.appendChild(saveButton);

loadTeam();

function downloadTeam() {
    const teamData = JSON.stringify(teamPlayers, null, 2);
    const blob = new Blob([teamData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team_list.json';
    a.click();
}

const downloadButton = document.createElement('button');
downloadButton.textContent = ' Download Team List';
downloadButton.onclick = downloadTeam;
document.body.appendChild(downloadButton);
