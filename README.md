# 🏡 Alice Mendes — Site Consultora Imobiliária

<img width="1879" height="949" alt="tela-consultora-imobiliaria" src="https://github.com/user-attachments/assets/04730b10-5bed-45f6-9597-074272cfcb35" />


Site institucional desenvolvido para uma consultora imobiliária, com design elegante, sistema de login com controle de permissões e painel administrativo para edição de conteúdo.

---

## 📋 Descrição

O projeto consiste em um site completo para a consultora imobiliária Alice Mendes, com foco em apresentação profissional, captação de clientes e agendamento de visitas. Conta com um sistema de autenticação que libera funcionalidades de edição de texto e imagens diretamente na página, sem necessidade de um CMS externo.

---

## ✨ Funcionalidades

- **Hero Section** com carrossel automático de imagens de imóveis
- **Carrossel principal** com navegação por setas e indicadores
- **Seção de serviços** com cards ilustrados por SVGs
- **Agendamento de visita** com calendário interativo
- **Depoimentos** com slider de clientes
- **Formulário de contato**
- **Sistema de login** com 4 níveis de acesso (admin, editor, usuário)
- **Painel administrativo** para edição de textos e imagens em tempo real
- **Persistência de alterações** via localStorage
- **Design responsivo** para desktop, tablet e mobile

---

## 🛠️ Tecnologias

- **HTML5**
- **CSS3** — Flexbox, Grid, animações, media queries
- **JavaScript** — Vanilla JS (sem frameworks)
- **Font Awesome 6** — Ícones
- **Google Fonts** — Playfair Display

---

## 📁 Estrutura de Arquivos

```
alice-mendes/
│
├── index.html               # Página inicial
├── sobre.html               # Página Sobre
├── serviços.html            # Página de Serviços
├── agendar.html             # Página de Agendamento
│
├── main.js                  # JavaScript principal (auth, sliders, editor, calendário)
│
├── css/
│   ├── style.css            # Estilos globais (header, footer, modal, painel admin)
│   └── index.css            # Estilos específicos da página inicial
│
├── includes/
│   ├── header.html          # Header compartilhado entre todas as páginas
│   └── footer.html          # Footer compartilhado entre todas as páginas
│
└── imagens/                 # Imagens do projeto
    ├── alice_mendes.avif
    ├── alice_com_cliente.avif
    ├── casa_moderna_branca.jpg
    ├── escada.webp
    ├── casa_piscina.jpg
    ├── cozinha.avif
    ├── casa_moderna.avif
    ├── casa_visao_de_cima.avif
    └── coqueiro.avif
```

---

## 🚀 Como Rodar Localmente

Como o projeto usa `fetch()` para carregar o header e o footer, é necessário rodar em um servidor local — abrir o `index.html` diretamente no navegador não funcionará corretamente.

### Opção 1 — VS Code com Live Server

1. Instale a extensão **Live Server** no VS Code
2. Clique com o botão direito no `index.html`
3. Selecione **"Open with Live Server"**

### Opção 2 — Python

```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

Acesse: [http://localhost:5500](http://localhost:5500)

### Opção 3 — Node.js

```bash
npx serve .
```

---

## 🔐 Usuários do Sistema

| Perfil   | Usuário  | Senha      | Permissões                        |
|----------|----------|------------|-----------------------------------|
| Editor   | editor   | editor123  | Edição de textos e imagens        |
| Usuário  | usuario  | user123    | Apenas visualização               |

> ⚠️ As credenciais acima são para fins de demonstração.

---

## 📱 Responsividade

O layout foi desenvolvido com três breakpoints:

| Breakpoint     | Dispositivo         |
|----------------|---------------------|
| até 480px      | Mobile              |
| 481px – 768px  | Tablet              |
| 769px – 1024px | Desktop médio       |

---

## 👨‍💻 Autor

Feito por **Kayk Junior**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kayk-junior-317176245/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Kaykjs)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/kayk242)

---

<p align="center">Desenvolvido com 💙 por Kayk Junior</p>
