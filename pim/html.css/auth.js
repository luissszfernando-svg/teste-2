/* ==========================================================
   SISTEMA DE AUTENTICAÇÃO E GESTÃO DE SESSÃO
   ========================================================== */

// 1. CONSTANTES (Para evitar erros de digitação e melhorar a legibilidade)
const CHAVE_USUARIOS = "usuarios";
const CHAVE_SESSAO = "usuarioLogado";

// 2. INICIALIZAÇÃO: Criar usuário padrão se não existir (Rodar ao carregar)
(function inicializarSistema() {
    if (!localStorage.getItem(CHAVE_USUARIOS)) {
        const usuariosPadrao = [
            {
                usuario: "admin",
                senha: "123",  // Senha simplificada para teste
                nome: "Diretor Carlos",
                cargo: "Administrador"
            },
            {
                usuario: "prof",
                senha: "123",
                nome: "Prof. Ana",
                cargo: "Professor"
            }
        ];
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuariosPadrao));
        console.log("Sistema inicializado com usuários padrão.");
    }
})();

// 3. FUNÇÃO DE LOGIN
function login() {
    // Pega os elementos do DOM
    const inputUsuario = document.getElementById("usuario");
    const inputSenha = document.getElementById("senha");

    // Validação de existência dos campos (boas práticas)
    if (!inputUsuario || !inputSenha) {
        console.error("Campos de login não encontrados no HTML. Verifique os IDs 'usuario' e 'senha'.");
        return;
    }

    const usuarioDigitado = inputUsuario.value.trim(); // .trim() remove espaços em branco
    const senhaDigitada = inputSenha.value.trim();

    if (usuarioDigitado === "" || senhaDigitada === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Busca usuários salvos
    const listaUsuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];

    // Procura o usuário
    const usuarioEncontrado = listaUsuarios.find(u => 
        u.usuario === usuarioDigitado && u.senha === senhaDigitada
    );

    if (usuarioEncontrado) {
        // Salva sessão: Cria uma cópia do objeto e DELETA a senha antes de salvar a sessão
        const sessaoUsuario = { ...usuarioEncontrado };
        delete sessaoUsuario.senha; 
        
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessaoUsuario));
        
        // Redireciona
        window.location.href = "index.html"; 
    } else {
        alert("Usuário ou senha incorretos!");
        // Limpa a senha para nova tentativa
        inputSenha.value = "";
        inputSenha.focus();
    }
}

// 4. VERIFICAR SE USUÁRIO ESTÁ LOGADO (Proteção de rota)
function verificarLogin() {
    const sessao = localStorage.getItem(CHAVE_SESSAO);
    const estaNaPaginaDeLogin = window.location.href.includes("login.html");

    // Se NÃO tiver sessão e NÃO estiver na tela de login, manda para login
    if (!sessao && !estaNaPaginaDeLogin) {
        window.location.href = "login.html";
    }
    
    // Se JÁ tiver sessão e ESTIVER na tela de login, manda para o dashboard
    if (sessao && estaNaPaginaDeLogin) {
        window.location.href = "index.html";
    }
}

// 5. FUNÇÃO DE LOGOUT
function logout() {
    if(confirm("Tem certeza que deseja sair do sistema?")) {
        localStorage.removeItem(CHAVE_SESSAO);
        window.location.href = "login.html";
    }
}

// 6. FUNÇÃO PARA MOSTRAR NOME DO USUÁRIO
function mostrarNome() {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_SESSAO));
    
    if (usuario) {
        const elNome = document.getElementById("nome-usuario");
        const elCargo = document.querySelector(".user-role"); // Elemento do Dashboard

        if (elNome) {
            // CORREÇÃO: Uso correto de Template String com crases (` `)
            elNome.textContent = `Olá, ${usuario.nome}`; 
        }
        
        if (elCargo && usuario.cargo) {
            elCargo.textContent = usuario.cargo;
        }
    }
}

// 7. FUNÇÃO PARA TRATAR "ESQUECI A SENHA"
function esqueciSenha() {
    const mensagem = `🔑 Recuperação de Senha:

Para redefinir sua senha, por favor, entre em contato com o suporte técnico da escola.

E-mail: suporte@escola.xyz
Telefone: (00) 9999-9999

(Esta funcionalidade usa um alerta simples, pois não há um backend de e-mail real configurado.)`;

    alert(mensagem);
}