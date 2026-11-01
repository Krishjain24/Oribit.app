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
