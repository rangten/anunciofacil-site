document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  const erroElemento = document.getElementById("mensagemErro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      await user.updateProfile({ displayName: nome });

      const db = firebase.firestore();
      const dataExpira = new Date();
      dataExpira.setDate(dataExpira.getDate() + 7);

      await db.collection("usuarios").doc(user.uid).set({
        nome: nome,
        email: email,
        plano: "Grátis",
        planoExpira: dataExpira.toISOString(),
      });

      window.location.href = "painel.html";
    } catch (error) {
      erroElemento.textContent = traduzErro(error.code);
    }
  });

  function traduzErro(codigo) {
    const erros = {
      "auth/email-already-in-use": "Este e-mail já está em uso. Faça login ou use outro e-mail.",
      "auth/invalid-email": "E-mail inválido.",
      "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
      default: "Erro ao cadastrar. Tente novamente.",
    };
    return erros[codigo] || erros.default;
  }
});
