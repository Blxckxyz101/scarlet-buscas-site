// Mock Data
const mockData = {
  user: {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: 'https://via.placeholder.com/60',
    planStatus: 'Sem plano ativo',
    plan: null
  },
  stats: {
    tempoRestante: '30 dias',
    consultas: 1234,
    bases: 42,
    walletBalance: 245.50
  },
  consultas: [
    {
      id: 1,
      icon: '📍',
      title: 'Radar',
      desc: 'Consulta por placa de veículo',
      bases: '38 bases',
      category: 'popular'
    },
    {
      id: 2,
      icon: '👤',
      title: 'Nome',
      desc: 'Consulta por nome completo',
      bases: '42 bases',
      category: 'popular'
    },
    {
      id: 3,
      icon: '🆔',
      title: 'CPF',
      desc: 'Validação e dados de CPF',
      bases: '35 bases',
      category: 'recently'
    },
    {
      id: 4,
      icon: '📞',
      title: 'Telefone',
      desc: 'Busca reversa de telefone',
      bases: '28 bases',
      category: 'recently'
    },
    {
      id: 5,
      icon: '🪪',
      title: 'Foto Nacional',
      desc: 'Dados de carteira de identidade',
      bases: '25 bases',
      category: 'recently'
    },
    {
      id: 6,
      icon: '📸',
      title: 'Fotos',
      desc: 'Busca de fotos associadas',
      bases: '15 bases',
      category: 'popular'
    },
    {
      id: 7,
      icon: '🚗',
      title: 'CNH',
      desc: 'Dados de carteira nacional de habilitação',
      bases: '32 bases',
      category: 'popular'
    },
    {
      id: 8,
      icon: '📋',
      title: 'Histórico CNH',
      desc: 'Histórico completo de multas e infrações',
      bases: '30 bases',
      category: 'recently'
    }
  ]
};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const btnMenu = document.getElementById('btnMenu');
const sidebarClose = document.getElementById('sidebarClose');
const btnLogout = document.getElementById('btnLogout');
const btnLogoutMobile = document.getElementById('btnLogoutMobile');
const searchConsultas = document.getElementById('searchConsultas');
const consultasGrid = document.getElementById('consultasGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const consultaModal = document.getElementById('consultaModal');
const modalClose = document.getElementById('modalClose');
const btnConsultar = document.getElementById('btnConsultar');
const btnWhatsapp = document.getElementById('btnWhatsapp');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  loadStatsData();
  renderConsultas(mockData.consultas);
  setupEventListeners();
  setupNavigation();
});

// Load User Data
function loadUserData() {
  document.getElementById('userName').textContent = mockData.user.name;
  document.getElementById('userStatus').textContent = mockData.user.planStatus;
}

// Load Stats Data
function loadStatsData() {
  document.getElementById('tempoRestante').textContent = mockData.stats.tempoRestante;
  document.getElementById('consultasCount').textContent = mockData.stats.consultas.toLocaleString('pt-BR');
  document.getElementById('basesCount').textContent = mockData.stats.bases;
  document.getElementById('walletBalance').textContent = `R$ ${mockData.stats.walletBalance.toFixed(2).replace('.', ',')}`;
}

// Render Consultas
function renderConsultas(consultas) {
  consultasGrid.innerHTML = consultas.map(consulta => `
    <div class="consulta-card" data-id="${consulta.id}" data-category="${consulta.category}">
      <div class="consulta-top">
        <div class="consulta-icon">${consulta.icon}</div>
        <button class="consulta-favorite" data-id="${consulta.id}" title="Adicionar aos favoritos">⭐</button>
      </div>
      <div class="consulta-header">
        <h3 class="consulta-title">${consulta.title}</h3>
        <p class="consulta-desc">${consulta.desc}</p>
      </div>
      <span class="consulta-bases">${consulta.bases}</span>
      <div class="consulta-footer">
        <button class="btn-primary" onclick="openConsultaModal('${consulta.icon}', '${consulta.title}', '${consulta.desc}')">Iniciar</button>
      </div>
    </div>
  `).join('');

  // Add favorite functionality
  document.querySelectorAll('.consulta-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '⭐' : '☆';
    });
  });
}

// Filter Consultas
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    const cards = document.querySelectorAll('.consulta-card');
    
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if(filter === 'all' || category === filter) {
        card.style.display = 'block';
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

// Search Consultas
searchConsultas.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.consulta-card');
  
  cards.forEach(card => {
    const title = card.querySelector('.consulta-title').textContent.toLowerCase();
    const desc = card.querySelector('.consulta-desc').textContent.toLowerCase();
    
    if(title.includes(query) || desc.includes(query) || query === '') {
      card.style.display = 'block';
      card.style.opacity = '1';
    } else {
      card.style.opacity = '0';
      setTimeout(() => card.style.display = 'none', 300);
    }
  });
});

// Modal Functions
function openConsultaModal(icon, title, desc) {
  document.getElementById('modalIcon').textContent = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalInput').value = '';
  document.getElementById('modalInput').placeholder = `Digite dados para ${title}...`;
  consultaModal.classList.add('active');
}

modalClose.addEventListener('click', () => {
  consultaModal.classList.remove('active');
});

consultaModal.addEventListener('click', (e) => {
  if(e.target === consultaModal) {
    consultaModal.classList.remove('active');
  }
});

btnConsultar.addEventListener('click', () => {
  const input = document.getElementById('modalInput').value;
  if(input.trim()) {
    alert(`Consultando: ${input}\n\nEm produção, isto faria uma requisição ao backend.`);
    consultaModal.classList.remove('active');
  } else {
    alert('Por favor, insira um valor para consultar.');
  }
});

// Sidebar Toggle
btnMenu.addEventListener('click', () => {
  sidebar.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('active');
});

// Close sidebar on nav click (mobile)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if(window.innerWidth <= 768) {
      sidebar.classList.remove('active');
    }
  });
});

// Logout
function logout() {
  alert('Até logo!');
  // Em produção: redirecionar para login
  // window.location.href = '/login';
}

btnLogout.addEventListener('click', logout);
btnLogoutMobile.addEventListener('click', logout);

// WhatsApp Button
btnWhatsapp.addEventListener('click', () => {
  const phone = '5511999999999'; // Número do WhatsApp
  const message = 'Olá! Gostaria de saber mais sobre o programa revendedor.';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// Setup Event Listeners
function setupEventListeners() {
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      consultaModal.classList.remove('active');
      sidebar.classList.remove('active');
    }
  });

  // Active nav item
  setupNavigation();
}

// Setup Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Set first item active on load
  if(navItems.length > 0) {
    navItems[0].classList.add('active');
  }
}

// Responsive handling
window.addEventListener('resize', () => {
  if(window.innerWidth > 768) {
    sidebar.classList.remove('active');
  }
});

// Close sidebar on outside click
document.addEventListener('click', (e) => {
  if(window.innerWidth <= 768) {
    if(!sidebar.contains(e.target) && !btnMenu.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  }
});

// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
    }
  });
}, observerOptions);

document.querySelectorAll('.consulta-card').forEach(card => {
  observer.observe(card);
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
