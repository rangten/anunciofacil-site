document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    await firebase.auth().signInWithEmailAndPassword(email, senha);
    window.location.href = 'painel.html';
  } catch (error) {
    alert('Erro ao fazer login: ' + error.message);
  }
});
