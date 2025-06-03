firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('nomeUsuario').textContent = user.displayName || user.email;

  const db = firebase.firestore();
  const doc = await db.collection('usuarios').doc(user.uid).get();

  if (!doc.exists) {
    alert("Usuário não encontrado no banco.");
    firebase.auth().signOut();
    return;
  }

  const dados = doc.data();
  document.getElementById('planoUsuario').textContent = dados.plano;
  document.getElementById('validadePlano').textContent = formatarData(dados.planoExpira);

  const expirado = new Date(dados.planoExpira) < new Date();
  if (expirado) {
    document.getElementById('statusPlano').classList.remove('hidden');
    document.querySelectorAll('a').forEach(btn => btn.classList.add('pointer-events-none', 'opacity-50'));
  }
});

document.getElementById('btnLogout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    window.location.href = 'login.html';
  });
});

function formatarData(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}
