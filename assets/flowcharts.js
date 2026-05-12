// assets/flowcharts.js
window.FlowCharts = {};

const NODE_W = 200;
const NODE_H = 110;
const DECISION_R = 50;
const UNIT = 14;

FlowCharts.render = function(chartId, containerEl) {
  const chart = window.AppData.flowcharts[chartId];
  if (!chart) return;

  const maxY = Math.max(...chart.nodes.map(n => n.y)) + 12;
  const canvasH = maxY * UNIT + 40;
  const minCanvasW = chartId === 'main' ? 1200 : 900;
  const canvasW = Math.max(containerEl.offsetWidth, minCanvasW);

  containerEl.style.position = 'relative';
  containerEl.style.height = canvasH + 'px';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  svg.setAttribute('width', canvasW);
  svg.setAttribute('height', canvasH);

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrow-${chartId}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#9CA3AF"/>
    </marker>`;
  svg.appendChild(defs);

  const nodePos = {};
  chart.nodes.forEach(n => {
    const cx = (n.x / 100) * canvasW;
    const ty = n.y * UNIT + 20;
    nodePos[n.id] = { cx, ty, bx: cx - NODE_W/2, by: ty };
  });

  chart.edges.forEach(edge => {
    const from = nodePos[edge.from];
    const to   = nodePos[edge.to];
    if (!from || !to) return;

    const x1 = from.cx;
    const y1 = from.ty + NODE_H - 10;
    const x2 = to.cx;
    const y2 = to.ty;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dy = Math.abs(y2 - y1) * 0.5;
    const d = `M${x1},${y1} C${x1},${y1+dy} ${x2},${y2-dy} ${x2},${y2}`;
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#9CA3AF');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('marker-end', `url(#arrow-${chartId})`);
    svg.appendChild(path);

    if (edge.label) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', mx + 4);
      text.setAttribute('y', my);
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#9CA3AF');
      text.setAttribute('font-family', 'JetBrains Mono, monospace');
      text.textContent = edge.label;
      svg.appendChild(text);
    }
  });

  containerEl.appendChild(svg);

  chart.nodes.forEach(n => {
    const pos = nodePos[n.id];
    const isDecision = n.type === 'decision';

    const card = document.createElement('div');
    card.className = `fc-node ${n.type}`;
    card.style.left = (pos.bx) + 'px';
    card.style.top  = pos.ty + 'px';
    if (isDecision) {
      card.style.width  = DECISION_R * 2 + 'px';
      card.style.left   = (pos.cx - DECISION_R) + 'px';
    }

    const header = document.createElement('div');
    header.className = 'fc-node-header';
    if (n.role !== 'system') {
      const roleMap = { pm: 'PM', qa: 'QA', eng: '工程師' };
      const chip = document.createElement('span');
      chip.className = `role-chip ${n.role}`;
      chip.textContent = roleMap[n.role];
      header.appendChild(chip);
    }
    if (!isDecision) {
      const typeMap = { human: '人工', cowork: 'Cowork', claudecode: 'Claude Code' };
      const tChip = document.createElement('span');
      tChip.className = `type-chip ${n.type}`;
      tChip.textContent = typeMap[n.type] || '';
      header.appendChild(tChip);
    }
    card.appendChild(header);

    const title = document.createElement('div');
    title.className = 'fc-node-title';
    title.textContent = n.title;
    card.appendChild(title);

    if (n.bullets && n.bullets.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'fc-node-bullets';
      n.bullets.slice(0, 4).forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    card.addEventListener('click', () => {
      FlowCharts.openModal(n);
    });

    containerEl.appendChild(card);
  });
};

FlowCharts.openModal = function(node) {
  const roleMap = { pm: 'PM', qa: 'QA', eng: '工程師', system: 'System' };
  const typeMap = { human: '人工決策', cowork: 'AI Cowork', claudecode: 'Claude Code', decision: '判斷點', system: '系統狀態' };

  const overlay = document.getElementById('fc-modal');
  const title   = document.getElementById('fc-modal-title');
  const chips   = document.getElementById('fc-modal-chips');
  const bullets = document.getElementById('fc-modal-bullets');

  title.textContent = node.title;
  chips.innerHTML = '';

  if (node.role !== 'system') {
    const r = document.createElement('span');
    r.className = `role-chip ${node.role}`;
    r.textContent = roleMap[node.role];
    chips.appendChild(r);
  }
  const t = document.createElement('span');
  t.className = `type-chip ${node.type}`;
  t.textContent = typeMap[node.type];
  chips.appendChild(t);

  bullets.innerHTML = '';
  if (node.bullets && node.bullets.length) {
    node.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      bullets.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = '（此節點為流程控制點，無具體產出）';
    li.style.color = 'var(--text-faint)';
    bullets.appendChild(li);
  }

  overlay.classList.remove('hidden');
};
