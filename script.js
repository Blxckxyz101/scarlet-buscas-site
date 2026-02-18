document.addEventListener('DOMContentLoaded',function(){
  // set copyright year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // mobile nav toggle + accessibility
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close when clicking a nav link (mobile)
    nav.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape'){
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#') && href.length > 1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  // header: add subtle shadow when scrolled
  const header = document.querySelector('.site-header');
  const headerShadow = () => {
    if(window.scrollY > 24) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  };
  headerShadow();
  window.addEventListener('scroll', headerShadow);

  // reveal-on-scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && reveals.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r => io.observe(r));
  } else {
    // fallback: show all
    reveals.forEach(r => r.classList.add('is-visible'));
  }

  // contact form (demo only)
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      const action = form.getAttribute('action');
      const data = new FormData(form);
      const send = async () => {
        try{
          if(action && action.includes('formspree.io')){
            // use fetch to send to Formspree
            const res = await fetch(action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
            if(res.ok){
              if(msg) msg.textContent = 'Obrigado — mensagem enviada.';
              form.reset();
            } else {
              const j = await res.json().catch(()=>null);
              throw new Error((j && j.error) || 'Erro no envio');
            }
          } else {
            // fallback: just show demo message
            if(msg) msg.textContent = 'Obrigado — (demo) mensagem recebida.';
            form.reset();
          }
        } catch(err){
          if(msg) msg.textContent = 'Erro ao enviar. Tente novamente.';
        }
      };
      send();
    });
  }

  // dark mode toggle
  const darkToggle = document.getElementById('darkModeToggle');
  const html = document.documentElement;
  const darkModeSaved = localStorage.getItem('darkMode');
  if(darkModeSaved === 'true') html.classList.add('dark-mode');
  if(darkToggle){
    darkToggle.addEventListener('click', () => {
      html.classList.toggle('dark-mode');
      const isDark = html.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      darkToggle.textContent = isDark ? '☀️' : '🌙';
    });
    darkToggle.textContent = html.classList.contains('dark-mode') ? '☀️' : '🌙';
  }

  // faq accordion
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  // pricing toggle (monthly/annual)
  const pricingSwitch = document.getElementById('pricingSwitch');
  if(pricingSwitch){
    pricingSwitch.addEventListener('click', () => {
      const isAnnual = pricingSwitch.getAttribute('aria-pressed') === 'true';
      pricingSwitch.setAttribute('aria-pressed', !isAnnual);
      document.querySelectorAll('.monthly, .annual').forEach(el => {
        el.style.display = el.classList.contains('monthly') === isAnnual ? 'none' : 'inline';
      });
    });
  }

  // newsletter form
  const nlForm = document.getElementById('newsletterForm');
  const nlMsg = document.getElementById('newsletterMsg');
  if(nlForm){
    nlForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = nlForm.querySelector('input[type="email"]').value;
      if(nlMsg) nlMsg.textContent = 'Obrigado por se inscrever!';
      nlForm.reset();
      setTimeout(() => { if(nlMsg) nlMsg.textContent = ''; }, 3000);
    });
  }
});

