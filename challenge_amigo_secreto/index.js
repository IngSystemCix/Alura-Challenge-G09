const inputName = document.querySelector("#input-name");
const participantTable = document.querySelector("#participant-table");
const participantListElement = document.querySelector("#participant-list");
const secretFriendListTable = document.querySelector("#secret-friend-table");
const secretFriendListElement = document.querySelector(
  "#secret-friend-list-table"
);

let participantList = [];

const addParticipant = () => {
  const participantName = inputName.value.trim();
  if (!participantName) {
    alert("Por favor, ingresa un nombre válido.");
    return;
  }
  if (participantList.some((p) => p.name === participantName)) {
    alert("El participante ya está en la lista.");
    return;
  }
  const count = participantList.length + 1;
  participantList.push({ id: count, name: participantName });
  inputName.value = "";
  renderParticipantList();
};

const renderParticipantList = () => {
  participantListElement.innerHTML = "";
  participantList.forEach((participant) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${participant.id}</td>
      <td>${participant.name}</td>
    `;
    participantListElement.appendChild(row);
  });
};

const generateSecretFriends = () => {
  if (participantList.length < 2) {
    alert(
      "Se necesitan al menos dos participantes para generar amigos secretos."
    );
    return;
  }
  if (participantList.length % 2 !== 0) {
    alert(
      "El número de participantes debe ser par para generar amigos secretos."
    );
    return;
  }

  const names = participantList.map((p) => p.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    alert("Hay participantes repetidos en la lista.");
    return;
  }

  // Derangement algorithm to ensure no one gets themselves and no repeats
  function generateDerangement(array) {
    const n = array.length;
    let indices = [...Array(n).keys()];
    let deranged = [];

    let attempts = 0;
    do {
      deranged = [...indices];
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deranged[i], deranged[j]] = [deranged[j], deranged[i]];
      }
      attempts++;
    } while (deranged.some((val, i) => val === i) && attempts < 1000);

    if (deranged.some((val, i) => val === i)) {
      alert(
        "No se pudo generar una asignación válida de amigos secretos. Intenta de nuevo."
      );
      return null;
    }

    // Devolver arreglo de participantes en nuevo orden
    return deranged.map((index) => array[index]);
  }

  const shuffled = generateDerangement(participantList);
  if (!shuffled) return;

  secretFriendListElement.innerHTML = "";

  for (let i = 0; i < participantList.length; i++) {
    const giver = participantList[i];
    const receiver = shuffled[i];

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${giver.name}</td>
      <td>${receiver.name}</td>
    `;
    secretFriendListElement.appendChild(row);
  }
};
