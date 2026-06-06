const API_BASE_URL = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("accessToken");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
  get(endpoint) {
    return request(endpoint, {
      method: "GET",
    });
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body) {
    return request(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(endpoint) {
    return request(endpoint, {
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

export const hemocentrosService = {
  listarHemocentros() {
    return api.get("/hemocentros");
  },

  buscarHemocentroPorId(id) {
    return api.get(`/hemocentros/${id}`);
  },
};