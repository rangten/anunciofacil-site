document.getElementById('formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    // Cria o usuário no Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
    const user = userCredential.user;

    // Atualiza o nome no perfil
    await user.updateProfile({ displayName: nome });

    // Salva os dados no Firestore
    const db = firebase.firestore();
    await db.collection('usuarios').doc(user.uid).set({
      nome: nome,
      email: email,
      plano: 'Grátis',
      planoExpira: gerarDataExpiracao(7) // 7 dias de teste grátis
    });

    // Redireciona para o painel
    window.location.href = 'painel.html';
  } catch (error) {
    alert('Erro ao cadastrar: ' + error.message);
  }
});

// Gera data de expiração no formato ISO
function gerarDataExpiracao(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString();
}
