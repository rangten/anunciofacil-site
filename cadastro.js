document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastro');
  const mensagem = document.getElementById('mensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      await user.updateProfile({ displayName: nome });

      const db = firebase.firestore();
      const dataExpira = new Date();
      dataExpira.setDate(dataExpira.getDate() + 7);

      await db.collection('usuarios').doc(user.uid).set({
        nome: nome,
        email: email,
        plano: 'Grátis',
        planoExpira: dataExpira.toISOString()
      });

      window.location.href = "painel.html";
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      let mensagemErro = "Erro ao cadastrar. Tente novamente.";

      if (error.code === 'auth/email-already-in-use') {
        mensagemErro = "Este e-mail já está em uso. Faça login ou use outro e-mail.";
      }

      mensagem.textContent = mensagemErro;
    }
  });
});
