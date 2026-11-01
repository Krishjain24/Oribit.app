const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-navigation');

function closeNavigation() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
  navigation?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNavigation);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

const builderContent = {
  frontend: {
    kicker: 'FOR FRONTEND DEVELOPERS',
    title: 'Shape the experience<br />while agents handle the loops.',
    description: 'Explore visual directions, refine components, and review the result right beside your code.',
    points: [
      'Iterate on real browser previews',
      'Keep design intent with the code',
      'Review each change as it lands',
    ],
  },
  fullstack: {
    kicker: 'FOR FULL STACK BUILDERS',
    title: 'Keep the whole system<br />in view as you build.',
    description: 'Give agents context across your project so they can trace a change from the interface through to the data layer.',
    points: [
      'Work across connected parts of a codebase',
      'Keep decisions and implementation together',
      'Check changes in the running application',
    ],
  },
  teams: {
    kicker: 'FOR PRODUCT TEAMS',
    title: 'Move together from<br />brief to shared outcome.',
    description: 'Make plans, progress, and review visible so teammates can contribute with a shared understanding of the work.',
    points: [
      'Keep the project brief close at hand',
      'Follow progress as work takes shape',
      'Review outcomes with your team',
    ],
  },
};

const tabs = [...document.querySelectorAll('.builder-tab')];
const panel = document.querySelector('#builder-panel');
const kicker = document.querySelector('#panel-kicker');
const title = document.querySelector('#panel-title');
const description = document.querySelector('#panel-description');
const points = document.querySelector('#panel-points');

function selectBuilder(tab, moveFocus = false) {
  const content = builderContent[tab.dataset.builder];
  if (!content || !panel) return;

  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });

  panel.setAttribute('aria-labelledby', tab.id);
  kicker.textContent = content.kicker;
  title.innerHTML = content.title;
  description.textContent = content.description;
  points.replaceChildren(
    ...content.points.map((text) => {
      const item = document.createElement('li');
      const check = document.createElement('span');
      check.textContent = '✓';
      item.append(check, document.createTextNode(text));
      return item;
    }),
  );

  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectBuilder(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    selectBuilder(tabs[nextIndex], true);
  });
});


/* ==========================================================================
   Orbit Interactive Modals, Forms & Hero Agent Demo Runner
   ========================================================================== */

// Modals Management
const waitlistModal = document.getElementById('waitlist-modal-overlay');
const inquiryModal = document.getElementById('inquiry-modal-overlay');

function openModal(modal) {
  if (modal) modal.classList.add('is-active');
}

function closeModal(modal) {
  if (modal) modal.classList.remove('is-active');
}

document.querySelectorAll('.btn-open-waitlist').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(waitlistModal);
  });
});

document.querySelectorAll('.btn-open-inquiry').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(inquiryModal);
  });
});

document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(waitlistModal);
    closeModal(inquiryModal);
  });
});

[waitlistModal, inquiryModal].forEach(overlay => {
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

// Waitlist Form Submission
const waitlistForm = document.getElementById('waitlist-form');
const waitlistStatus = document.getElementById('waitlist-status');
const btnSubmitWaitlist = document.getElementById('btn-submit-waitlist');

waitlistForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  waitlistStatus.className = 'form-status';
  waitlistStatus.style.display = 'none';

  const email = document.getElementById('wl-email').value.trim();
  const full_name = document.getElementById('wl-name').value.trim();
  const builder_role = document.getElementById('wl-role').value;
  const company = document.getElementById('wl-company').value.trim();

  btnSubmitWaitlist.disabled = true;
  btnSubmitWaitlist.textContent = 'Reserving...';

  try {
    const res = await window.OrbitAPI.joinWaitlist({
      email,
      full_name: full_name || null,
      builder_role,
      company: company || null
    });

    waitlistStatus.className = 'form-status success';
    waitlistStatus.textContent = `You're on the list! Position #${res.queue_position || '1'} reserved for early access. Check your inbox for confirmation.`;
    waitlistStatus.style.display = 'block';
    waitlistForm.reset();
  } catch (err) {
    waitlistStatus.className = 'form-status error';
    waitlistStatus.textContent = err.message || 'Something went wrong. Please try again.';
    waitlistStatus.style.display = 'block';
  } finally {
    btnSubmitWaitlist.disabled = false;
    btnSubmitWaitlist.innerHTML = 'Reserve Your Spot <span>↗</span>';
  }
});

// Inquiry Form Submission
const inquiryForm = document.getElementById('inquiry-form');
const inquiryStatus = document.getElementById('inquiry-status');
const btnSubmitInquiry = document.getElementById('btn-submit-inquiry');

inquiryForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  inquiryStatus.className = 'form-status';
  inquiryStatus.style.display = 'none';

  const name = document.getElementById('inq-name').value.trim();
  const email = document.getElementById('inq-email').value.trim();
  const company = document.getElementById('inq-company').value.trim();
  const inquiry_type = document.getElementById('inq-type').value;
  const message = document.getElementById('inq-message').value.trim();

  btnSubmitInquiry.disabled = true;
  btnSubmitInquiry.textContent = 'Sending...';

  try {
    await window.OrbitAPI.submitInquiry({
      name,
      email,
      company: company || null,
      inquiry_type,
      message
    });

    inquiryStatus.className = 'form-status success';
    inquiryStatus.textContent = "Thank you! We've received your inquiry and our team will get back to you shortly.";
    inquiryStatus.style.display = 'block';
    inquiryForm.reset();
  } catch (err) {
    inquiryStatus.className = 'form-status error';
    inquiryStatus.textContent = err.message || 'Could not send inquiry. Please try again.';
    inquiryStatus.style.display = 'block';
  } finally {
    btnSubmitInquiry.disabled = false;
    btnSubmitInquiry.innerHTML = 'Send Inquiry <span>→</span>';
  }
});

// Newsletter Submission
const newsletterForm = document.getElementById('newsletter-form');
const newsletterStatus = document.getElementById('newsletter-status');

newsletterForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput.value.trim();

  try {
    await window.OrbitAPI.subscribeNewsletter(email);
    newsletterStatus.style.color = '#10b981';
    newsletterStatus.textContent = '✓ Subscribed! You will receive future Orbit product updates.';
    newsletterStatus.style.display = 'block';
    newsletterForm.reset();
  } catch (err) {
    newsletterStatus.style.color = '#ef4444';
    newsletterStatus.textContent = err.message || 'Could not subscribe.';
    newsletterStatus.style.display = 'block';
  }
});

// Hero Interactive Agent Runner
const heroRunBtn = document.getElementById('hero-run-btn');
const heroPromptInput = document.getElementById('hero-prompt-input');
const agentListContainer = document.querySelector('.agent-list');

async function triggerHeroAgentRun() {
  const prompt = heroPromptInput?.value.trim();
  if (!prompt || !agentListContainer) return;

  heroRunBtn.textContent = '...';
  heroRunBtn.disabled = true;

  try {
    const activeTab = document.querySelector('.builder-tab.is-active');
    const builderRole = activeTab ? activeTab.dataset.builder : 'fullstack';

    const data = await window.OrbitAPI.runAgentDemo(prompt, builderRole);

    // Render returned steps dynamically
    agentListContainer.innerHTML = '';
    data.steps.forEach((step) => {
      const stepEl = document.createElement('div');
      stepEl.className = `agent-step ${step.status}`;
      const symbol = step.status === 'done' ? '✓' : (step.status === 'active' ? '<i></i>' : '○');
      stepEl.innerHTML = `
        <span class="step-symbol">${symbol}</span>
        <div>
          <strong>${step.title}</strong>
          <small>${step.description}</small>
        </div>
        <span class="step-time">${step.time_label || 'now'}</span>
      `;
      agentListContainer.appendChild(stepEl);
    });

    // Update window path header if present
    const windowPath = document.querySelector('.window-path');
    if (windowPath && data.project_name) {
      windowPath.innerHTML = `<span class="path-icon">◈</span> ${data.project_name}`;
    }
  } catch (err) {
    console.warn('Agent demo API fallback to local animation', err);
  } finally {
    heroRunBtn.innerHTML = 'Run <span>✳</span>';
    heroRunBtn.disabled = false;
  }
}

heroRunBtn?.addEventListener('click', triggerHeroAgentRun);
heroPromptInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    triggerHeroAgentRun();
  }
});
