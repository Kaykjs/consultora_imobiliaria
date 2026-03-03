const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// SISTEMA DE AUTENTICAÇÃO

const Auth = {
  USUARIOS: [
    { username: 'admin',   password: '123456',    role: 'admin',  nome: 'Administrador' },
    { username: 'alice',   password: 'alice123',  role: 'admin',  nome: 'Alice Mendes'  },
    { username: 'editor',  password: 'editor123', role: 'editor', nome: 'Editor'        },
    { username: 'usuario', password: 'user123',   role: 'user',   nome: 'Usuário Comum' },
  ],

  getUsuario() {
    const dado = sessionStorage.getItem('usuarioLogado');
    return dado ? JSON.parse(dado) : null;
  },

  logado() {
    return !!this.getUsuario();
  },

  temPermissaoEdicao() {
    const u = this.getUsuario();
    return u && (u.role === 'admin' || u.role === 'editor');
  },

  isAdmin() {
    const u = this.getUsuario();
    return u?.role === 'admin';
  },

  login(username, password) {
    const encontrado = this.USUARIOS.find(
      u => u.username === username && u.password === password
    );
    if (!encontrado) return null;
    const dados = { username: encontrado.username, nome: encontrado.nome, role: encontrado.role };
    sessionStorage.setItem('usuarioLogado', JSON.stringify(dados));
    return dados;
  },

  logout() {
    sessionStorage.removeItem('usuarioLogado');
    alert('Logout realizado com sucesso!');
    location.reload();
  },
};

// SISTEMA DE ALTERAÇÕES (localStorage)

const Alteracoes = {
  _get() {
    return JSON.parse(localStorage.getItem('alteracoes') || '{}');
  },

  salvar(tipo, id, valor, classe) {
    const alteracoes = this._get();
    alteracoes[id] = {
      tipo, id, classe, valor,
      data: new Date().toISOString(),
      usuario: Auth.getUsuario()?.username,
    };
    localStorage.setItem('alteracoes', JSON.stringify(alteracoes));
    UI.notificacao('✓ Alteração salva com sucesso!', 'success');
  },

  carregar() {
    const seletoresTexto = '.about-text,.hero-subtitle,.servico-texto,.sobre-texto,.depo-texto,.hero-title,.about-title,.services-title,.depoimentos-title';
    const seletoresImg   = '.hero-photo img,.foto-alice,.foto-consultoria,.foto-bloco,.hero-slide img';

    Object.values(this._get()).forEach(alt => {
      if (alt.tipo === 'texto') {
        const elementos = $$(seletoresTexto);
        const el = elementos.find((_, i) => `texto-${i}` === alt.id || `titulo-${i}` === alt.id);
        if (el?.childNodes[0]) el.childNodes[0].textContent = alt.valor;

      } else if (alt.tipo === 'imagem') {
        const imgs = $$(seletoresImg);
        const img  = imgs.find((_, i) => `img-${i}` === alt.id);
        if (img) img.src = alt.valor;
      }
    });
  },

  resetar() {
    if (!confirm('⚠️ Resetar todas as alterações? Esta ação não pode ser desfeita.')) return;
    localStorage.removeItem('alteracoes');
    UI.notificacao('✓ Alterações resetadas!', 'success');
    setTimeout(() => location.reload(), 1500);
  },

  historico() {
    const lista = Object.values(this._get());
    if (!lista.length) { alert('Nenhuma alteração registrada.'); return; }

    const texto = lista.map((alt, i) => [
      `${i + 1}. ${alt.tipo.toUpperCase()}`,
      `   ID: ${alt.id}`,
      `   Usuário: ${alt.usuario}`,
      `   Data: ${new Date(alt.data).toLocaleString('pt-BR')}`,
      `   Valor: ${alt.valor.substring(0, 50)}${alt.valor.length > 50 ? '...' : ''}`,
    ].join('\n')).join('\n\n');

    alert(`📋 HISTÓRICO DE ALTERAÇÕES\n${'═'.repeat(40)}\n\n${texto}`);
  },
};

// INTERFACE / FEEDBACK VISUAL

const UI = {
  notificacao(mensagem, tipo = 'info') {
    $('.notificacao')?.remove();
    const el = document.createElement('div');
    el.className = `notificacao notificacao-${tipo}`;
    el.textContent = mensagem;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },
};

// CONTROLES DE EDIÇÃO

const Editor = {
  mostrar() {
    const TEXTOS  = '.about-text,.hero-subtitle,.servico-texto,.sobre-texto,.depo-texto';
    const TITULOS = '.hero-title,.about-title,.services-title,.depoimentos-title';
    const IMAGENS = '.hero-photo img,.foto-alice,.foto-consultoria,.foto-bloco,.hero-slide img';

    $$(TEXTOS).forEach((el, i) => {
      if (el.querySelector('.btn-editar')) return;
      Object.assign(el.style, { position: 'relative', paddingBottom: '50px' });
      el.appendChild(this._btnTexto(el, `texto-${i}`));
    });

    $$(TITULOS).forEach((el, i) => {
      if (el.querySelector('.btn-editar')) return;
      Object.assign(el.style, { position: 'relative', paddingRight: '60px' });
      const btn = this._btnTexto(el, `titulo-${i}`);
      btn.classList.add('btn-editar-titulo');
      btn.innerHTML = '<i class="fas fa-edit"></i>';
      el.appendChild(btn);
    });

    $$(IMAGENS).forEach((img, i) => {
      if (img.parentElement.querySelector('.btn-editar-img')) return;

      // FIX: preserva position:absolute dos slides do hero slider
      const posAtual = getComputedStyle(img.parentElement).position;
      if (posAtual !== 'absolute') img.parentElement.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'btn-editar-img';
      btn.innerHTML = '<i class="fas fa-image"></i>';
      btn.onclick = () => {
        const novaUrl = prompt('Cole a URL da nova imagem:', img.src);
        if (novaUrl?.trim()) {
          img.src = novaUrl.trim();
          Alteracoes.salvar('imagem', `img-${i}`, novaUrl.trim(), img.className);
        }
      };
      img.parentElement.appendChild(btn);
    });
  },

  ocultar() {
    $$('.btn-editar, .btn-editar-img, .painel-admin').forEach(el => el.remove());
    $$('.about-text,.hero-subtitle,.servico-texto,.sobre-texto,.depo-texto')
      .forEach(el => (el.style.paddingBottom = ''));
  },

  _btnTexto(elemento, id) {
    const btn = document.createElement('button');
    btn.className = 'btn-editar';
    btn.innerHTML = '<i class="fas fa-edit"></i> Editar';
    btn.onclick = () => {
      const btnEl = elemento.querySelector('.btn-editar');
      if (btnEl) btnEl.style.display = 'none';
      const textoAtual = elemento.textContent.trim();
      if (btnEl) btnEl.style.display = '';
      const novo = prompt('Editar texto:', textoAtual);
      if (novo?.trim()) {
        elemento.childNodes[0].textContent = novo.trim();
        Alteracoes.salvar('texto', id, novo.trim(), elemento.className);
      }
    };
    return btn;
  },
};

// PAINEL DE ADMINISTRAÇÃO

const PainelAdmin = {
  mostrar() {
    if ($('.painel-admin')) return;
    const painel = document.createElement('div');
    painel.className = 'painel-admin';
    painel.innerHTML = `
      <div class="painel-header">
        <h3><i class="fas fa-cog"></i> Painel Admin</h3>
        <button class="btn-fechar-painel">×</button>
      </div>
      <div class="painel-conteudo">
        <button class="btn-admin" id="btn-historico"><i class="fas fa-history"></i> Ver Histórico</button>
        <button class="btn-admin" id="btn-usuarios"><i class="fas fa-users"></i> Usuários</button>
        <button class="btn-admin" id="btn-resetar"><i class="fas fa-undo"></i> Resetar Alterações</button>
      </div>
    `;
    document.body.appendChild(painel);

    painel.querySelector('.btn-fechar-painel').onclick = () => painel.remove();
    $('#btn-historico', painel).onclick = () => Alteracoes.historico();
    $('#btn-usuarios',  painel).onclick = () => this._verUsuarios();
    $('#btn-resetar',   painel).onclick = () => Alteracoes.resetar();
  },

  _verUsuarios() {
    alert(`👥 USUÁRIOS DO SISTEMA\n${'═'.repeat(35)}\n
🔴 ADMIN      | admin   / 123456
🔴 ADMIN      | alice   / alice123
🟡 EDITOR     | editor  / editor123
🟢 USUÁRIO    | usuario / user123`);
  },
};

// BOTÃO FIXO DE ENGRENAGEM (ABRE/FECHA PAINEL ADMIN)

function initBotaoAdmin() {
  if ($('.btn-engrenagem')) return;

  const btn = document.createElement('button');
  btn.className = 'btn-engrenagem';
  btn.innerHTML = '<i class="fas fa-cog"></i>';
  btn.title = 'Painel Admin';
  btn.addEventListener('click', () => {
    const painelExistente = $('.painel-admin');
    if (painelExistente) {
      painelExistente.remove();
    } else {
      PainelAdmin.mostrar();
    }
  });

  document.body.appendChild(btn);
}

// MODAL DE LOGIN

const Modal = {
  init() {
    const userIcon  = $('.user-icon');
    const modal     = $('#loginModal');
    const closeBtn  = $('#closeModal');
    const form      = $('#loginForm');
    const userInput = $('#username');
    const passInput = $('#password');

    if (!userIcon || !modal) {
      setTimeout(() => this.init(), 100);
      return;
    }

    userIcon.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (Auth.logado()) {
        if (confirm(`Logado como: ${Auth.getUsuario().nome}\n\nDeseja fazer logout?`)) Auth.logout();
        return;
      }
      this._abrir(modal);
    });

    closeBtn?.addEventListener('click',  () => this._fechar(modal, form));
    modal.addEventListener('click', e => { if (e.target === modal) this._fechar(modal, form); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) this._fechar(modal, form);
    });

    [userInput, passInput].forEach(input => {
      input?.addEventListener('input', () => this._limparErro(input));
    });

    form?.addEventListener('submit', e => {
      e.preventDefault();
      this._limparErros();

      const username = userInput.value.trim();
      const password = passInput.value.trim();
      let valido = true;

      if (!username)                { this._erro(userInput, 'Insira seu usuário');   valido = false; }
      else if (username.length < 3) { this._erro(userInput, 'Mínimo 3 caracteres'); valido = false; }
      if (!password)                { this._erro(passInput, 'Insira sua senha');     valido = false; }
      else if (password.length < 6) { this._erro(passInput, 'Mínimo 6 caracteres'); valido = false; }

      if (!valido) return;

      const usuario = Auth.login(username, password);
      if (usuario) {
        this._fechar(modal, form);
        UI.notificacao(`✓ Bem-vindo(a), ${usuario.nome}!`, 'success');
        setTimeout(() => location.reload(), 1500);
      } else {
        passInput.value = '';
        this._erro(passInput, 'Usuário ou senha incorretos');
      }
    });
  },

  _abrir(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  _fechar(modal, form) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    this._limparErros();
    form?.reset();
  },

  _erro(input, msg) {
    input.classList.add('input-error');
    const span = document.createElement('span');
    span.className = 'error-message';
    span.textContent = msg;
    input.parentElement.insertAdjacentElement('afterend', span);
  },

  _limparErro(input) {
    input.classList.remove('input-error');
    const next = input.parentElement.nextElementSibling;
    if (next?.classList.contains('error-message')) next.remove();
  },

  _limparErros() {
    $$('.error-message').forEach(el => el.remove());
    $$('.input-error').forEach(el => el.classList.remove('input-error'));
  },
};

// ATUALIZA INTERFACE BASEADO NO LOGIN

function atualizarInterface() {
  const usuario  = Auth.getUsuario();
  const userIcon = $('.user-icon');

  if (usuario) {
    if (userIcon) {
      userIcon.innerHTML = '<i class="fas fa-user-circle"></i>';
      userIcon.title     = `Logado como: ${usuario.nome} (${usuario.role})`;
      userIcon.style.color = '#B87E58';
    }
    if (Auth.temPermissaoEdicao()) Editor.mostrar();
    if (Auth.isAdmin()) initBotaoAdmin();

    // Botão logout no menu
    setTimeout(() => {
      const nav = $('.nav-menu');
      if (nav && !$('.logout-btn')) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Sair</a>';
        nav.appendChild(li);
        $('.logout-btn').addEventListener('click', e => { e.preventDefault(); Auth.logout(); });
      }
    }, 500);
  } else {
    Editor.ocultar();
  }
}

// SLIDER HERO (AUTOMÁTICO)

function initHeroSlider() {
  const slides = $$('.hero-slide');
  if (!slides.length) return;
  let idx = 0;
  slides[0].classList.add('active');
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 5000);
}

// SLIDER PRINCIPAL (SETAS + BOLINHAS)

function initSliderPrincipal() {
  const slides = $$('.slide');
  const dots   = $$('.dot');
  if (!slides.length) return;

  let idx = 0;

  function mostrar(n) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
  }

  window.currentSlide = n => mostrar(n - 1);

  $('.prev')?.addEventListener('click', () => mostrar(idx - 1));
  $('.next')?.addEventListener('click', () => mostrar(idx + 1));

  mostrar(0);
  setInterval(() => mostrar(idx + 1), 6000);
}

// SLIDER DE DEPOIMENTOS

function initDepoimentos() {
  const slides = $$('.depo-slide');
  if (!slides.length) return;
  let idx = 0;

  function mostrar(n) {
    slides.forEach(s => s.classList.remove('active'));
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('active');
  }

  $('.depo-prev')?.addEventListener('click', () => mostrar(idx - 1));
  $('.depo-next')?.addEventListener('click', () => mostrar(idx + 1));
  mostrar(0);
}

// FECHAR MENU AO CLICAR EM LINKS

function initMenuLinks() {
  const toggle = $('#menu-toggle');
  if (!toggle) return;
  $$('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => (toggle.checked = false));
  });
}

// CALENDÁRIO DE AGENDAMENTO

function initCalendario() {
  const container = $('#calendario-dias');
  if (!container) return;

  const MESES     = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const MESES_MIN = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const DIAS_SEM  = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];

  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  let mesAtual = new Date(hoje);
  let diaSelecionado = null;

  function renderizar() {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    $('#mes-ano').textContent = `${MESES[mes]} ${ano}`;
    container.innerHTML = '';

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia   = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
      const vazio = document.createElement('div');
      vazio.className = 'dia vazio';
      container.appendChild(vazio);
    }

    for (let d = 1; d <= ultimoDia; d++) {
      const el   = document.createElement('div');
      const data = new Date(ano, mes, d);
      el.className = 'dia';
      el.textContent = d;

      if (data.getTime() === hoje.getTime()) el.classList.add('hoje');

      if (data < hoje) {
        el.classList.add('indisponivel');
      } else {
        if (d === 27) el.classList.add('tem-compromisso');
        el.addEventListener('click', () => selecionar(el, d));
      }

      container.appendChild(el);
    }

    if (diaSelecionado) {
      const diaEl = [...container.querySelectorAll('.dia:not(.vazio):not(.indisponivel)')]
        .find(el => +el.textContent === diaSelecionado);
      if (diaEl) diaEl.classList.add('selecionado');
    }
  }

  function selecionar(el, dia) {
    $$('.dia.selecionado').forEach(d => d.classList.remove('selecionado'));
    el.classList.add('selecionado');
    diaSelecionado = dia;

    $('.btn-proximo')?.classList.add('ativo');

    const data = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);
    const info = $('.disponibilidade-info');
    if (info) {
      info.innerHTML = `
        <p>Disponibilidade para <strong>${DIAS_SEM[data.getDay()]}, ${dia} de ${MESES_MIN[mesAtual.getMonth()]}</strong></p>
        <p style="margin-top:10px">Indisponível</p>
      `;
    }
  }

  $('#mes-anterior')?.addEventListener('click', () => { mesAtual.setMonth(mesAtual.getMonth() - 1); renderizar(); });
  $('#mes-proximo')?.addEventListener('click',  () => { mesAtual.setMonth(mesAtual.getMonth() + 1); renderizar(); });

  renderizar();

  setTimeout(() => {
    const dia27 = [...$$('.dia')].find(el => el.textContent === '27' && !el.classList.contains('vazio'));
    if (dia27) selecionar(dia27, 27);
  }, 100);
}

// INICIALIZAÇÃO

document.addEventListener('DOMContentLoaded', () => {
  initMenuLinks();
  initHeroSlider();
  initSliderPrincipal();
  initDepoimentos();
  initCalendario();

  setTimeout(() => {
    Alteracoes.carregar();
    atualizarInterface();
    Modal.init();
  }, 200);
});