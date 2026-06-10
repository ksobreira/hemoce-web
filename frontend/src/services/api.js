const API_BASE_URL = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("accessToken");
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.mensagem ||
      data?.message ||
      "Ocorreu um erro ao se comunicar com o servidor.";

    throw new Error(message);
  }

  return data;
}

export const api = {
  get(path) {
    return request(path, {
      method: "GET",
    });
  },

  post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(path, body) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch(path, body) {
    return request(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(path) {
    return request(path, {
      method: "DELETE",
    });
  },
};

export const authService = {
  login({ email, senha }) {
    return api.post("/auth/login", {
      email,
      senha,
    });
  },

  cadastrarUsuario(dados) {
    return api.post("/auth/cadastro-usuario", dados);
  },
};

export const campanhasService = {
  listarCampanhas() {
    return api.get("/campanhas");
  },

  buscarCampanhaPorId(id) {
    return api.get(`/campanhas/${id}`);
  },

  listarCampanhasAdmin() {
    return api.get("/campanhas/admin");
  },

  criarCampanha(dados) {
    return api.post("/campanhas", dados);
  },

  atualizarCampanha(id, dados) {
    return api.put(`/campanhas/${id}`, dados);
  },

  excluirCampanha(id) {
    return api.delete(`/campanhas/${id}`);
  },
};

export const orientacoesService = {
  listarOrientacoes() {
    return api.get("/orientacoes");
  },
};

export const assistenteIaService = {
  enviarMensagem(pergunta) {
    return request("/assistente-ia", {
      method: "POST",
      body: JSON.stringify({ pergunta }),
    });
  },

  consultarStatus() {
    return request("/assistente-ia/status", {
      method: "GET",
    });
  },
};

export const perfilService = {
  obterPerfil() {
    return api.get("/usuarios/perfil");
  },

  atualizarPerfil(dados) {
    return api.put("/usuarios/perfil", dados);
  },

  obterPerfilAdmin() {
    return api.get("/administradores/perfil");
  },

  atualizarPerfilAdmin(dados) {
    return api.put("/administradores/perfil", dados);
  },
};

export const hemocentrosService = {
  listarHemocentros() {
    return api.get("/hemocentros");
  },

  buscarHemocentroPorId(id) {
    return api.get(`/hemocentros/${id}`);
  },

  listarHorariosPorData(hemocentroId, data) {
    return api.get(`/hemocentros/${hemocentroId}/horarios?data=${data}`);
  },
};

export const agendamentosService = {
  listarAgendamentos() {
    return api.get("/agendamentos");
  },

  listarAgendamentosAtivos() {
    return api.get("/agendamentos/ativos");
  },

  criarAgendamento(horarioId) {
    return api.post("/agendamentos", {
      horarioId,
    });
  },

  cancelarAgendamento(id) {
    return api.patch(`/agendamentos/${id}/cancelar`);
  },

  listarAgendamentosAdmin(hemocentroId, data) {
    return api.get(`/agendamentos/admin?hemocentroId=${hemocentroId}&data=${data}`);
  },

  atualizarStatusAdmin(id, status) {
    return api.patch(`/agendamentos/admin/${id}/status`, {
      status,
    });
  },
};
