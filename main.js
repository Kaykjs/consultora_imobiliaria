let indiceAtual = 0;
const slides = document.querySelectorAll(".primary-slide");
const totalSlides = slides.length;

// Função que troca para o próximo slide
function proximoSlide() {
  // Remove a classe active do slide atual
  slides[indiceAtual].classList.remove("active");
  
  // Avança o índice
  indiceAtual = (indiceAtual + 1) % totalSlides;
  
  // Adiciona active no próximo slide
  slides[indiceAtual].classList.add("active");
}

// Troca automaticamente a cada 8 segundos
setInterval(proximoSlide, 8000);

// Garante que o primeiro slide comece visível
slides[indiceAtual].classList.add("active");



// Slider manual com setas e pontinhos
let slideIndex = 1;
showSlides(slideIndex);

// Função para avançar/retroceder
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Função para ir direto pro slide clicado (pontinhos)
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Função principal que mostra o slide correto
function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  // Remove "active" de todos
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  // Adiciona "active" no slide e dot atual
  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].classList.add("active");
}

// Eventos das setas
document.querySelector(".prev").addEventListener("click", () => plusSlides(-1));
document.querySelector(".next").addEventListener("click", () => plusSlides(1));

// Auto play (troca automático a cada 6 segundos) - opcional
// Comenta ou remove as duas linhas abaixo se não quiser auto play
setInterval(() => {
  plusSlides(1);
}, 6000);


// Slider de depoimentos
let depoIndex = 0;
const depoSlides = document.querySelectorAll(".depo-slide");

function mostrarDepo(i) {
  depoSlides.forEach(s => s.classList.remove("active"));
  depoSlides[i].classList.add("active");
}

document.querySelector(".depo-prev").addEventListener("click", () => {
  depoIndex = (depoIndex - 1 + depoSlides.length) % depoSlides.length;
  mostrarDepo(depoIndex);
});

document.querySelector(".depo-next").addEventListener("click", () => {
  depoIndex = (depoIndex + 1) % depoSlides.length;
  mostrarDepo(depoIndex);
});




// js/main.js - Todos os scripts do site em um arquivo só (organizado e seguro)

document.addEventListener('DOMContentLoaded', function () {

  // ====================
  // 1. FECHA O MENU HAMBURGER AO CLICAR EM LINKS
  // ====================
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.querySelectorAll('.nav-menu a');

  if (menuToggle && menuLinks.length > 0) {
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.checked = false;
      });
    });
  }

  // ====================
  // 2. SLIDER AUTOMÁTICO (se você estiver usando o primary-slider)
  // ====================
  const primarySlides = document.querySelectorAll('.primary-slide');
  if (primarySlides.length > 0) {
    let indiceAtual = 0;
    const totalSlides = primarySlides.length;

    function proximoSlide() {
      primarySlides[indiceAtual].classList.remove('active');
      indiceAtual = (indiceAtual + 1) % totalSlides;
      primarySlides[indiceAtual].classList.add('active');
    }

    // Troca a cada 8 segundos
    setInterval(proximoSlide, 8000);

    // Garante o primeiro slide ativo
    primarySlides[indiceAtual].classList.add('active');
  }

  // ====================
  // 3. OUTROS SCRIPTS FUTUROS (depoimentos, etc.)
  // ====================
  // Adicione aqui outros códigos no futuro, sempre dentro do DOMContentLoaded

});


// =============================================
// CALENDÁRIO DE AGENDAMENTO
// =============================================

// Verifica se estamos na página de agendamento
if (document.getElementById('calendario-dias')) {
  
  const mesAtual = new Date();
  let mesExibido = new Date(mesAtual);
  let diaSelecionado = null;

  function renderizarCalendario() {
      const ano = mesExibido.getFullYear();
      const mes = mesExibido.getMonth();
      
      // Atualiza título
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      document.getElementById('mes-ano').textContent = `${meses[mes]} ${ano}`;

      // Pega primeiro e último dia do mês
      const primeiroDia = new Date(ano, mes, 1).getDay();
      const ultimoDia = new Date(ano, mes + 1, 0).getDate();

      const calendarioDias = document.getElementById('calendario-dias');
      calendarioDias.innerHTML = '';

      // Dias vazios no início
      for (let i = 0; i < primeiroDia; i++) {
          const diaVazio = document.createElement('div');
          diaVazio.classList.add('dia', 'vazio');
          calendarioDias.appendChild(diaVazio);
      }

      // Dias do mês
      for (let dia = 1; dia <= ultimoDia; dia++) {
          const diaElemento = document.createElement('div');
          diaElemento.classList.add('dia');
          diaElemento.textContent = dia;

          const dataAtual = new Date(ano, mes, dia);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          // Marca dia de hoje
          if (dataAtual.getTime() === hoje.getTime()) {
              diaElemento.classList.add('hoje');
          }

          // Dias no passado ficam indisponíveis
          if (dataAtual < hoje) {
              diaElemento.classList.add('indisponivel');
          } else {
              // Adiciona evento de clique
              diaElemento.addEventListener('click', () => selecionarDia(diaElemento, dia));
              
              // Exemplo: dia 27 tem compromisso
              if (dia === 27) {
                  diaElemento.classList.add('tem-compromisso');
              }
          }

          calendarioDias.appendChild(diaElemento);
      }
  }

  function selecionarDia(elemento, dia) {
      // Remove seleção anterior
      document.querySelectorAll('.dia.selecionado').forEach(d => d.classList.remove('selecionado'));
      
      // Adiciona nova seleção
      elemento.classList.add('selecionado');
      diaSelecionado = dia;

      // Ativa botão próximo
      const btnProximo = document.querySelector('.btn-proximo');
      if (btnProximo) {
          btnProximo.classList.add('ativo');
      }
      
      // Atualiza informação de disponibilidade
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                     'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const diaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      const data = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), dia);
      
      const disponibilidadeInfo = document.querySelector('.disponibilidade-info');
      if (disponibilidadeInfo) {
          disponibilidadeInfo.innerHTML = `
              <p>Disponibilidade para <strong>${diaSemana[data.getDay()]}, ${dia} de ${meses[mesExibido.getMonth()]}</strong></p>
              <p style="margin-top: 10px;">Indisponível</p>
          `;
      }
  }

  // Navegação de mês
  const btnMesAnterior = document.getElementById('mes-anterior');
  const btnMesProximo = document.getElementById('mes-proximo');

  if (btnMesAnterior) {
      btnMesAnterior.addEventListener('click', () => {
          mesExibido.setMonth(mesExibido.getMonth() - 1);
          renderizarCalendario();
      });
  }

  if (btnMesProximo) {
      btnMesProximo.addEventListener('click', () => {
          mesExibido.setMonth(mesExibido.getMonth() + 1);
          renderizarCalendario();
      });
  }

  // Renderiza calendário inicial
  renderizarCalendario();

  // Pré-seleciona o dia 27 (se existir)
  setTimeout(() => {
      const dia27 = Array.from(document.querySelectorAll('.dia')).find(d => d.textContent === '27' && !d.classList.contains('vazio'));
      if (dia27) {
          selecionarDia(dia27, 27);
      }
  }, 100);

}