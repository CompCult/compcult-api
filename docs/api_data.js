define({ "api": [
  {
    "type": "delete",
    "url": "/users/:user_id",
    "title": "07. Remover usuário",
    "group": "Users",
    "description": "<p>Exclui um usuário.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "DeleteUsersUser_id"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "01. Listar usuários",
    "group": "Users",
    "description": "<p>Lista todos os usuários cadastrados na aplicação.</p>",
    "examples": [
      {
        "title": "Exemplo de uso",
        "content": "curl http://127.0.0.1:3000/users",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "GetUsers"
  },
  {
    "type": "get",
    "url": "/users/query/fields",
    "title": "03. Recuperar usuário por parâmetros",
    "group": "Users",
    "description": "<p>Recupera os usuários com base nos parâmetros passados.</p>",
    "examples": [
      {
        "title": "Exemplo de uso",
        "content": "curl http://127.0.0.1:3000/users/query/fields?institution=\"UFCG\"",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "GetUsersQueryFields"
  },
  {
    "type": "get",
    "url": "/users/:user_id",
    "title": "02. Recuperar usuário pelo id",
    "group": "Users",
    "description": "<p>Recupera um usuário através do Id.</p>",
    "examples": [
      {
        "title": "Exemplo de uso",
        "content": "curl http://127.0.0.1:3000/users/10",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "GetUsersUser_id"
  },
  {
    "type": "post",
    "url": "/users/auth",
    "title": "08. Autenticar usuário",
    "group": "Users",
    "description": "<p>Autentica um usuário.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersAuth"
  },
  {
    "type": "post",
    "url": "/users/recovery",
    "title": "09. Alterar senha",
    "group": "Users",
    "description": "<p>Armazena nova senha do usuário e envia email para confirmação.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersRecovery"
  },
  {
    "type": "post",
    "url": "/users/recovery/password_edit",
    "title": "10. Aplicar nova senha",
    "group": "Users",
    "description": "<p>Atualiza a nova senha do usuário após a confirmação via email. Lembre-se de usar o /recovery antes.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersRecoveryPassword_edit"
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "04. Criar usuário",
    "group": "Users",
    "description": "<p>Cria um novo usuário.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersRegister"
  },
  {
    "type": "post",
    "url": "/users/update/:user_id",
    "title": "06. Atualizar usuário (POST)",
    "group": "Users",
    "description": "<p>Atualiza os dados de um usuário via POST.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersUpdateUser_id"
  },
  {
    "type": "put",
    "url": "/users/:user_id",
    "title": "05. Atualizar usuário",
    "group": "Users",
    "description": "<p>Atualiza os dados de um usuário.</p>",
    "version": "0.0.0",
    "filename": "server/routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_id"
  }
] });
