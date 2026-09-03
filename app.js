(() => {
  // ── Font catalogue ─────────────────────────────────────────────────
  const FONTS = [
    { label: 'Great Vibes',         value: "'Great Vibes', cursive",        category: 'Handwriting' },
    { label: 'Pinyon Script',       value: "'Pinyon Script', cursive",       category: 'Handwriting' },
    { label: 'Allura',              value: "'Allura', cursive",              category: 'Handwriting' },
    { label: 'Alex Brush',          value: "'Alex Brush', cursive",          category: 'Handwriting' },
    { label: 'Sacramento',          value: "'Sacramento', cursive",          category: 'Handwriting' },
    { label: 'Tangerine',           value: "'Tangerine', cursive",           category: 'Handwriting' },
    { label: 'Dancing Script',      value: "'Dancing Script', cursive",      category: 'Handwriting' },
    { label: 'Satisfy',             value: "'Satisfy', cursive",             category: 'Handwriting' },
    { label: 'Pacifico',            value: "'Pacifico', cursive",            category: 'Handwriting' },
    { label: 'Cinzel',              value: "'Cinzel', serif",                category: 'Elegant Serif' },
    { label: 'Cormorant Garamond',  value: "'Cormorant Garamond', serif",    category: 'Elegant Serif' },
    { label: 'Playfair Display',    value: "'Playfair Display', serif",      category: 'Elegant Serif' },
    { label: 'EB Garamond',         value: "'EB Garamond', serif",           category: 'Elegant Serif' },
    { label: 'Crimson Text',        value: "'Crimson Text', serif",          category: 'Elegant Serif' },
    { label: 'Libre Baskerville',   value: "'Libre Baskerville', serif",     category: 'Elegant Serif' },
    { label: 'Georgia',             value: 'Georgia, serif',                 category: 'Classic' },
    { label: 'Palatino',            value: "'Palatino Linotype', serif",     category: 'Classic' },
    { label: 'Times New Roman',     value: "'Times New Roman', serif",       category: 'Classic' },
    { label: 'Raleway',             value: "'Raleway', sans-serif",          category: 'Sans-serif' },
    { label: 'Lato',                value: "'Lato', sans-serif",             category: 'Sans-serif' },
    { label: 'Arial',               value: 'Arial, sans-serif',              category: 'Sans-serif' },
    { label: 'Verdana',             value: 'Verdana, sans-serif',            category: 'Sans-serif' },
    { label: 'Courier New',         value: "'Courier New', monospace",       category: 'Monospace' },
  ];

  // ── State ──────────────────────────────────────────────────────────
  const state = {
    image:          null,
    naturalW:       0,
    naturalH:       0,
    scale:          0.65,
    fields:         [],   
    activeFieldIdx: -1,
    draggingField:  false,
    dragFieldOffX:  0,
    dragFieldOffY:  0,
    committedFont:  FONTS[0].value,
    hoverFont:      null,
    excelData:      [],
    excelColumns:   [],
    previewRowIdx:  0,    
    editingRowIdx:  -1,   
    rowOverrides:   {},   
  };

  // ── DOM refs ───────────────────────────────────────────────────────
  const canvas      = document.getElementById('previewCanvas');
  const ctx         = canvas ? canvas.getContext('2d') : null;

  const fontSize    = document.getElementById('fontSize');
  const fontColor   = document.getElementById('fontColor');
  const fontColorHex = document.getElementById('fontColorHex');
  const boldBtn     = document.getElementById('boldBtn');
  const italicBtn   = document.getElementById('italicBtn');
  const alignBtns     = document.querySelectorAll('.align-btn');
  const transformBtns = document.querySelectorAll('.transform-btn');

  const posX        = document.getElementById('posX');
  const posY        = document.getElementById('posY');
  const btnRemoveField = document.getElementById('btnRemoveField');
  const activeFieldLabel = document.getElementById('activeFieldLabel');

  const shadowEnabled  = document.getElementById('shadowEnabled');
  const shadowControls = document.getElementById('shadowControls');
  const shadowColor    = document.getElementById('shadowColor');
  const shadowColorHex = document.getElementById('shadowColorHex');
  const shadowBlur     = document.getElementById('shadowBlur');
  const shadowOffsetX  = document.getElementById('shadowOffsetX');
  const shadowOffsetY  = document.getElementById('shadowOffsetY');
  const shadowOpacity  = document.getElementById('shadowOpacity');
  const shadowOpacityVal = document.getElementById('shadowOpacityVal');

  const btnDownload  = document.getElementById('btnDownload');
  const btnBulk      = document.getElementById('btnBulk');
  const progressWrap = document.getElementById('progressWrap');
  const progressFill = document.getElementById('progressFill');
  const progressLbl  = document.getElementById('progressLbl');

  const zoomInBtn   = document.getElementById('zoomIn');
  const zoomOutBtn  = document.getElementById('zoomOut');
  const zoomLbl     = document.getElementById('zoomLbl');

  const fontPicker       = document.getElementById('fontPicker');
  const fontTrigger      = document.getElementById('fontTrigger');
  const fontTriggerLabel = document.getElementById('fontTriggerLabel');
  const fontDropdown     = document.getElementById('fontDropdown');

  const excelFile          = document.getElementById('excelFile');
  const excelUploadArea    = document.getElementById('excelUploadArea');
  const excelUploadLabel   = document.getElementById('excelUploadLabel');
  const excelPreviewWrap   = document.getElementById('excelPreviewWrap');
  const excelTableBody     = document.getElementById('excelTableBody');
  const excelPreviewTitle  = document.getElementById('excelPreviewTitle');
  const excelCount         = document.getElementById('excelCount');
  const btnClearExcel      = document.getElementById('btnClearExcel');
  const columnFieldsSection = document.getElementById('columnFieldsSection');
  const columnChipsEl      = document.getElementById('columnChips');

  const smtpHost        = document.getElementById('smtpHost');
  const smtpPort        = document.getElementById('smtpPort');
  const smtpUser        = document.getElementById('smtpUser');
  const smtpPass        = document.getElementById('smtpPass');
  const smtpFromName    = document.getElementById('smtpFromName');
  const btnSaveSmtp     = document.getElementById('btnSaveSmtp');
  const btnTestSmtp     = document.getElementById('btnTestSmtp');
  const smtpTestResult  = document.getElementById('smtpTestResult');
  const smtpStatusBadge = document.getElementById('smtpStatusBadge');

  const smtpModal       = document.getElementById('smtpModal');
  const smtpModalClose  = document.getElementById('smtpModalClose');
  const btnOpenSmtp     = document.getElementById('btnOpenSmtp');

  const emailModal      = document.getElementById('emailModal');
  const emailModalClose = document.getElementById('emailModalClose');
  const emailModalDone  = document.getElementById('emailModalDone');
  const btnOpenCompose  = document.getElementById('btnOpenCompose');
  const composeSummary  = document.getElementById('composeSummary');
  const varChipsEl      = document.getElementById('varChips');

  const rowIndicator        = document.getElementById('rowIndicator');
  const rowIndicatorLabel   = document.getElementById('rowIndicatorLabel');
  const btnExitRowEdit      = document.getElementById('btnExitRowEdit');
  const btnResetRowOverride = document.getElementById('btnResetRowOverride');

  const certDropZone      = document.getElementById('certDropZone');
  const certFileInput     = document.getElementById('certFileInput');
  const changeTemplateBtn = document.getElementById('changeTemplateBtn');
  const canvasContainer   = document.getElementById('canvasContainer');
  const canvasHint        = document.getElementById('canvasHint');

  const API_BASE = 'http://localhost:3001';

  const emailSubject      = document.getElementById('emailSubject');
  const emailBody         = document.getElementById('emailBody');
  const btnSendEmails     = document.getElementById('btnSendEmails');
  const emailProgressWrap = document.getElementById('emailProgressWrap');
  const emailProgressFill = document.getElementById('emailProgressFill');
  const emailProgressLbl  = document.getElementById('emailProgressLbl');
  const emailResultLog    = document.getElementById('emailResultLog');

  // ── Build font picker dropdown ─────────────────────────────────────
  if (fontDropdown) {
    let currentCategory = '';
    FONTS.forEach((f, idx) => {
      if (f.category !== currentCategory) {
        currentCategory = f.category;
        const sep = document.createElement('div');
        sep.className = 'font-category-label';
        sep.textContent = f.category;
        fontDropdown.appendChild(sep);
      }
      const item = document.createElement('div');
      item.className = 'font-item' + (idx === 0 ? ' active' : '');
      item.dataset.idx = idx;
      item.style.fontFamily = f.value;
      item.innerHTML = `
        <span>${esc(f.label)}</span>
        <svg class="font-item-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="2 8 6 12 14 4"/>
        </svg>`;
      item.addEventListener('mouseenter', () => {
        state.hoverFont = f.value;
        if (state.activeFieldIdx >= 0) render();
      });
      item.addEventListener('click', () => { commitFont(idx); closeDropdown(); });
      fontDropdown.appendChild(item);
    });
  }

  function commitFont(idx, silent = false) {
    state.committedFont = FONTS[idx].value;
    state.hoverFont = null;
    if (fontTriggerLabel) {
      fontTriggerLabel.style.fontFamily = state.committedFont;
      fontTriggerLabel.textContent = FONTS[idx].label;
    }
    if (fontDropdown) {
      fontDropdown.querySelectorAll('.font-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.idx, 10) === idx);
      });
    }
    if (!silent) {
      saveActiveFieldTypography();
      render();
    }
  }

  function openDropdown() {
    if (!fontDropdown || !fontTrigger) return;
    fontDropdown.classList.add('open');
    fontTrigger.classList.add('open');
    FONTS.forEach(f => {
      document.fonts.load(`${parseInt(fontSize.value, 10) || 72}px ${f.value}`).catch(() => {});
    });
  }

  function closeDropdown() {
    state.hoverFont = null;
    if (fontDropdown) fontDropdown.classList.remove('open');
    if (fontTrigger) fontTrigger.classList.remove('open');
    render();
  }

  if (fontTrigger) {
    fontTrigger.addEventListener('click', () => {
      if (fontDropdown.classList.contains('open')) closeDropdown();
      else openDropdown();
    });
  }

  if (fontDropdown) {
    fontDropdown.addEventListener('mouseleave', () => { state.hoverFont = null; render(); });
  }
  document.addEventListener('click', e => { 
    if (fontPicker && !fontPicker.contains(e.target)) closeDropdown(); 
  });

  // ── Helpers ────────────────────────────────────────────────────────
  function hexToRgba(hex, opacity) {
    if (!hex || hex.length < 7) return `rgba(0,0,0,${opacity / 100})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity / 100})`;
  }

  function esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function toast(msg, type = '') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `show ${type}`;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.className = '', 2500);
  }

  // ── Per-row override helpers ───────────────────────────────────────
  function getEffectiveField(baseField, rowIdx) {
    const override = (rowIdx >= 0) ? state.rowOverrides[rowIdx]?.[baseField.key] : null;
    return override ? { ...baseField, ...override } : baseField;
  }

  function hasRowOverrides(rowIdx) {
    const o = state.rowOverrides[rowIdx];
    return !!o && Object.keys(o).length > 0;
  }

  // ── Typography read/write ──────────────────────────────────────────
  function readTypographyFromControls() {
    return {
      font:          state.committedFont,
      size:          parseInt(fontSize?.value, 10) || 72,
      color:         fontColor?.value || '#2c1a0e',
      bold:          boldBtn?.classList.contains('active') || false,
      italic:        italicBtn?.classList.contains('active') || false,
      align:         document.querySelector('.align-btn.active')?.dataset.align || 'center',
      textTransform: document.querySelector('.transform-btn.active')?.dataset.transform || 'none',
      shadowEnabled: shadowEnabled?.checked || false,
      shadowColor:   shadowColor?.value || '#000000',
      shadowBlur:    parseInt(shadowBlur?.value, 10) || 0,
      shadowOffsetX: parseInt(shadowOffsetX?.value, 10) || 0,
      shadowOffsetY: parseInt(shadowOffsetY?.value, 10) || 0,
      shadowOpacity: parseInt(shadowOpacity?.value, 10) || 60,
    };
  }

  function writeTypographyToControls(t) {
    const fidx = FONTS.findIndex(f => f.value === t.font);
    if (fidx >= 0) commitFont(fidx, true);

    if (fontSize) fontSize.value = t.size;
    if (fontColor) fontColor.value = t.color;
    if (fontColorHex) fontColorHex.value = t.color;

    if (boldBtn) boldBtn.classList.toggle('active', !!t.bold);
    if (italicBtn) italicBtn.classList.toggle('active', !!t.italic);

    alignBtns.forEach(b => b.classList.toggle('active', b.dataset.align === t.align));
    transformBtns.forEach(b => b.classList.toggle('active', b.dataset.transform === (t.textTransform || 'none')));

    if (shadowEnabled) shadowEnabled.checked = !!t.shadowEnabled;
    if (shadowControls) shadowControls.classList.toggle('visible', !!t.shadowEnabled);
    if (shadowColor) shadowColor.value = t.shadowColor;
    if (shadowColorHex) shadowColorHex.value = t.shadowColor;
    if (shadowBlur) shadowBlur.value = t.shadowBlur;
    if (shadowOffsetX) shadowOffsetX.value = t.shadowOffsetX;
    if (shadowOffsetY) shadowOffsetY.value = t.shadowOffsetY;
    if (shadowOpacity) shadowOpacity.value = t.shadowOpacity;
    if (shadowOpacityVal) shadowOpacityVal.textContent = t.shadowOpacity + '%';
  }

  function saveActiveFieldTypography() {
    if (state.activeFieldIdx < 0) return;
    const t = readTypographyFromControls();
    const baseField = state.fields[state.activeFieldIdx];

    if (state.editingRowIdx >= 0) {
      if (!state.rowOverrides[state.editingRowIdx]) state.rowOverrides[state.editingRowIdx] = {};
      if (!state.rowOverrides[state.editingRowIdx][baseField.key]) state.rowOverrides[state.editingRowIdx][baseField.key] = {};
      Object.assign(state.rowOverrides[state.editingRowIdx][baseField.key], t);
      updateTableRowHighlights();
    } else {
      Object.assign(baseField, t);
    }
  }

  // ── Field management ───────────────────────────────────────────────
  function addField(key, x, y) {
    const t = readTypographyFromControls();
    state.fields.push({ key, x, y, ...t, _bbox: null });
    selectField(state.fields.length - 1);
    updateBulkBtn();
  }

  function selectField(idx) {
    state.activeFieldIdx = idx;
    if (idx >= 0 && state.fields[idx]) {
      const baseField = state.fields[idx];
      const effectiveField = getEffectiveField(baseField, state.editingRowIdx);
      writeTypographyToControls(effectiveField);
      if (activeFieldLabel) {
        activeFieldLabel.textContent = baseField.key;
        activeFieldLabel.classList.add('has-field');
      }
      if (btnRemoveField) btnRemoveField.style.display = '';
    } else {
      if (activeFieldLabel) {
        activeFieldLabel.textContent = 'no field selected';
        activeFieldLabel.classList.remove('has-field');
      }
      if (btnRemoveField) btnRemoveField.style.display = 'none';
    }
    render();
  }

  if (btnRemoveField) {
    btnRemoveField.addEventListener('click', () => {
      if (state.activeFieldIdx < 0) return;
      const key = state.fields[state.activeFieldIdx].key;
      for (const rowIdx of Object.keys(state.rowOverrides)) {
        if (state.rowOverrides[rowIdx]) delete state.rowOverrides[rowIdx][key];
      }
      state.fields.splice(state.activeFieldIdx, 1);
      state.activeFieldIdx = -1;
      if (activeFieldLabel) {
        activeFieldLabel.textContent = 'no field selected';
        activeFieldLabel.classList.remove('has-field');
      }
      btnRemoveField.style.display = 'none';
      updateBulkBtn();
      updateTableRowHighlights();
      render();
    });
  }

  function updateBulkBtn() {
    if (btnBulk) btnBulk.disabled = state.excelData.length === 0 || state.fields.length === 0;
  }

  // ── Hit testing ────────────────────────────────────────────────────
  function hitTestFields(cx, cy) {
    for (let i = state.fields.length - 1; i >= 0; i--) {
      const b = state.fields[i]._bbox;
      if (!b) continue;
      const pad = 10;
      if (cx >= b.x1 - pad && cx <= b.x2 + pad && cy >= b.y1 - pad && cy <= b.y2 + pad) return i;
    }
    return -1;
  }

  // ── Build field font string ────────────────────────────────────────
  function buildFieldFont(field, overrideFont) {
    const parts = [];
    if (field.italic) parts.push('italic');
    if (field.bold)   parts.push('bold');
    parts.push(`${field.size}px`);
    parts.push(overrideFont || field.font);
    return parts.join(' ');
  }

  // ── Canvas rendering ───────────────────────────────────────────────
  function render() {
    if (!state.image || !canvas || !ctx) return;
    const w = state.naturalW;
    const h = state.naturalH;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(state.image, 0, 0, w, h);

    const previewRow = state.excelData[state.previewRowIdx] || null;

    for (let i = 0; i < state.fields.length; i++) {
      const baseField = state.fields[i];
      const field = getEffectiveField(baseField, state.previewRowIdx);

      const value = previewRow ? (previewRow[field.key] || `[${field.key}]`) : `[${field.key}]`;
      const x = field.x * w;
      const y = field.y * h;

      const effectiveFont = (i === state.activeFieldIdx && state.hoverFont)
        ? buildFieldFont(field, state.hoverFont)
        : buildFieldFont(field);

      drawFieldOnCtx(ctx, field, value, x, y, effectiveFont);

      ctx.font = effectiveFont;
      const tw = ctx.measureText(applyTextTransform(value, field.textTransform || 'none')).width;
      const th = field.size * 1.4;
      let x1, x2;
      if (field.align === 'center') { x1 = x - tw / 2; x2 = x + tw / 2; }
      else if (field.align === 'left') { x1 = x; x2 = x + tw; }
      else { x1 = x - tw; x2 = x; }
      baseField._bbox = { x1, y1: y - th / 2, x2, y2: y + th / 2 };

      if (i === state.activeFieldIdx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(108, 99, 255, 0.85)';
        ctx.lineWidth = Math.max(1.5, w / 600);
        ctx.setLineDash([6, 4]);
        const pad = 8;
        ctx.strokeRect(x1 - pad, y - th / 2 - pad / 2, (x2 - x1) + pad * 2, th + pad);
        ctx.setLineDash([]);
        ctx.restore();
      }
    }

    if (posX && posY) {
      if (state.activeFieldIdx >= 0) {
        const baseField = state.fields[state.activeFieldIdx];
        const f = getEffectiveField(baseField, state.previewRowIdx);
        posX.querySelector('span').textContent = Math.round(f.x * 100) + '%';
        posY.querySelector('span').textContent = Math.round(f.y * 100) + '%';
      } else {
        posX.querySelector('span').textContent = '—';
        posY.querySelector('span').textContent = '—';
      }
    }
  }

  function applyTextTransform(value, transform) {
    if (transform === 'uppercase') return String(value).toUpperCase();
    if (transform === 'titlecase') return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
    return String(value);
  }

  function drawFieldOnCtx(c, field, value, x, y, fontOverride) {
    const displayValue = applyTextTransform(value, field.textTransform || 'none');
    c.font         = fontOverride || buildFieldFont(field);
    c.fillStyle    = field.color;
    c.textAlign    = field.align;
    c.textBaseline = 'middle';

    if (field.shadowEnabled) {
      c.shadowColor   = hexToRgba(field.shadowColor, field.shadowOpacity);
      c.shadowBlur    = field.shadowBlur;
      c.shadowOffsetX = field.shadowOffsetX;
      c.shadowOffsetY = field.shadowOffsetY;
    } else {
      c.shadowColor = 'transparent';
      c.shadowBlur = c.shadowOffsetX = c.shadowOffsetY = 0;
    }

    c.fillText(displayValue, x, y);
    c.shadowColor = 'transparent';
    c.shadowBlur = c.shadowOffsetX = c.shadowOffsetY = 0;
  }

  // ── Generate certificate blob ──────────────────────────────────────
  function generateCertBlob(rowData, rowIdx = -1) {
    return new Promise(resolve => {
      const off = document.createElement('canvas');
      off.width  = state.naturalW;
      off.height = state.naturalH;
      const oc = off.getContext('2d');
      oc.drawImage(state.image, 0, 0, state.naturalW, state.naturalH);
      for (const baseField of state.fields) {
        const value = rowData[baseField.key] || '';
        if (!value) continue;
        const field = getEffectiveField(baseField, rowIdx);
        drawFieldOnCtx(oc, field, value, field.x * state.naturalW, field.y * state.naturalH);
      }
      off.toBlob(resolve, 'image/png');
    });
  }

  function blobToBase64(blob) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  }

  // ── Download ───────────────────────────────────────────────────────
  function safeName(n) {
    return String(n).replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 60) || 'certificate';
  }

  async function downloadPreview() {
    if (!state.image) { toast('Load a certificate template first', 'warning'); return; }
    const rowIdx = state.previewRowIdx;
    const rowData = state.excelData[rowIdx] || {};
    const blob = await generateCertBlob(rowData, rowIdx);
    const nameKey = state.excelColumns.find(k => k.includes('name')) || state.excelColumns[0];
    const label = (nameKey && rowData[nameKey]) ? safeName(rowData[nameKey]) : 'preview';
    triggerDownload(blob, `${label}_certificate.png`);
    toast('Preview downloaded!', 'success');
  }

  async function downloadBulk() {
    const rows = state.excelData;
    if (!rows.length) { toast('Upload an Excel file first', 'warning'); return; }
    if (!state.fields.length) { toast('Place at least one field on the canvas first', 'warning'); return; }
    if (typeof JSZip === 'undefined') { toast('JSZip not loaded', 'warning'); return; }

    btnBulk.disabled = true;
    progressWrap.classList.add('visible');
    const zip = new JSZip();

    const nameKey = state.excelColumns.find(k => k.includes('name')) || state.excelColumns[0];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const label = (nameKey && row[nameKey]) ? row[nameKey] : `row_${i + 1}`;
      progressFill.style.width = `${(i / rows.length) * 100}%`;
      progressLbl.textContent  = `Generating ${i + 1} / ${rows.length}: ${label}`;
      const blob = await generateCertBlob(row, i);
      zip.file(`${safeName(label)}_${i + 1}.png`, blob);
      await new Promise(r => setTimeout(r, 0));
    }

    progressFill.style.width = '100%';
    progressLbl.textContent  = 'Compressing…';
    await new Promise(r => setTimeout(r, 50));

    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    triggerDownload(zipBlob, 'certificates.zip');
    progressWrap.classList.remove('visible');
    progressFill.style.width = '0%';
    btnBulk.disabled = false;
    updateBulkBtn();
    toast(`${rows.length} certificate${rows.length !== 1 ? 's' : ''} downloaded!`, 'success');
  }

  function triggerDownload(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }

  // ── Excel Import ───────────────────────────────────────────────────
  if (excelUploadArea && excelFile) {
    excelUploadArea.addEventListener('click', () => excelFile.click());

    excelUploadArea.addEventListener('dragover', e => {
      e.preventDefault();
      excelUploadArea.classList.add('drag-over');
    });
    excelUploadArea.addEventListener('dragleave', () => excelUploadArea.classList.remove('drag-over'));
    excelUploadArea.addEventListener('drop', e => {
      e.preventDefault();
      excelUploadArea.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) parseExcelFile(file);
    });

    excelFile.addEventListener('change', () => {
      if (excelFile.files[0]) parseExcelFile(excelFile.files[0]);
    });
  }

  function parseExcelFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!rows.length) { toast('No data found in the file', 'warning'); return; }

        const normalise = obj => {
          const result = {};
          for (const k of Object.keys(obj)) result[k.toLowerCase().trim()] = String(obj[k]).trim();
          return result;
        };

        const parsed = rows.map(normalise);
        const allKeys  = Object.keys(parsed[0]);
        const nameKey  = allKeys.find(k => k.includes('name'))  || allKeys[0];
        const emailKey = allKeys.find(k => k.includes('email')) || allKeys[1];

        state.excelColumns = allKeys;
        state.excelData = parsed.map(r => ({
          ...r,
          name:  r[nameKey]  || '',
          email: emailKey ? (r[emailKey] || '') : '',
        })).filter(r => r.name || allKeys.some(k => r[k]));

        if (!state.excelData.length) { toast('No valid rows found', 'warning'); return; }

        state.previewRowIdx = 0;
        state.editingRowIdx = -1;
        state.rowOverrides  = {};

        buildVarChips();
        buildColumnChips(allKeys);
        renderExcelPreview();
        updateBulkBtn();
        updateRowIndicator();
        if (excelUploadLabel) excelUploadLabel.textContent = `${file.name} (${state.excelData.length} rows)`;
        toast(`Loaded ${state.excelData.length} rows — ${allKeys.length} column${allKeys.length !== 1 ? 's' : ''} detected`, 'success');
        render();
      } catch (err) {
        toast('Failed to parse file: ' + err.message, 'warning');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function renderExcelPreview() {
    const data = state.excelData;
    const cols = state.excelColumns;
    const displayCols = cols.slice(0, 4);

    const thead = document.getElementById('excelTableHead');
    if (thead) thead.innerHTML = '<tr><th>#</th>' + displayCols.map(c => `<th>${esc(c)}</th>`).join('') + '</tr>';

    if (excelTableBody) {
      excelTableBody.innerHTML = '';
      for (let i = 0; i < data.length; i++) {
        const tr = document.createElement('tr');
        tr.dataset.rowIdx = i;
        tr.innerHTML = `<td>${i + 1}</td>` + displayCols.map(c => `<td>${esc(data[i][c] || '—')}</td>`).join('');
        tr.addEventListener('click', () => selectPreviewRow(i));
        excelTableBody.appendChild(tr);
      }
    }
    if (excelPreviewTitle) excelPreviewTitle.textContent = `Preview — ${data.length} row${data.length !== 1 ? 's' : ''}, ${cols.length} col${cols.length !== 1 ? 's' : ''}`;
    if (excelPreviewWrap) excelPreviewWrap.style.display = 'block';
    if (excelCount) {
      excelCount.style.display = 'inline-flex';
      excelCount.textContent = `${data.length} rows`;
    }
    updateTableRowHighlights();
    updateSendBtn();
  }

  // ── Per-row preview & editing ──────────────────────────────────────
  function selectPreviewRow(rowIdx) {
    state.previewRowIdx = rowIdx;
    state.editingRowIdx = rowIdx;

    if (state.activeFieldIdx >= 0) {
      const baseField = state.fields[state.activeFieldIdx];
      const effectiveField = getEffectiveField(baseField, rowIdx);
      writeTypographyToControls(effectiveField);
    }

    updateTableRowHighlights();
    updateRowIndicator();
    render();
  }

  function exitRowEditMode() {
    state.previewRowIdx = 0;
    state.editingRowIdx = -1;

    if (state.activeFieldIdx >= 0) {
      writeTypographyToControls(state.fields[state.activeFieldIdx]);
    }

    updateTableRowHighlights();
    updateRowIndicator();
    render();
  }

  function updateTableRowHighlights() {
    if (!excelTableBody) return;
    excelTableBody.querySelectorAll('tr[data-row-idx]').forEach(tr => {
      const idx = parseInt(tr.dataset.rowIdx, 10);
      tr.classList.toggle('active', idx === state.previewRowIdx && state.editingRowIdx >= 0);
      tr.classList.toggle('customized', hasRowOverrides(idx));
    });
  }

  function updateRowIndicator() {
    if (!rowIndicator) return;
    if (state.editingRowIdx < 0) {
      rowIndicator.style.display = 'none';
      return;
    }
    rowIndicator.style.display = '';
    const row = state.excelData[state.editingRowIdx];
    const nameKey = state.excelColumns.find(k => k.includes('name')) || state.excelColumns[0];
    const name = (row && nameKey && row[nameKey]) ? row[nameKey] : `Row ${state.editingRowIdx + 1}`;
    const total = state.excelData.length;
    if (rowIndicatorLabel) rowIndicatorLabel.textContent = `Row ${state.editingRowIdx + 1} of ${total}: ${name}`;
  }

  if (btnExitRowEdit) btnExitRowEdit.addEventListener('click', exitRowEditMode);

  if (btnResetRowOverride) {
    btnResetRowOverride.addEventListener('click', () => {
      if (state.editingRowIdx < 0) return;
      delete state.rowOverrides[state.editingRowIdx];
      if (state.activeFieldIdx >= 0) {
        writeTypographyToControls(state.fields[state.activeFieldIdx]);
      }
      updateTableRowHighlights();
      render();
      toast(`Row ${state.editingRowIdx + 1} overrides cleared`, 'success');
    });
  }

  // ── Column chips ───────────────────────────────────────────────────
  function buildColumnChips(columns) {
    if (!columnChipsEl) return;
    columnChipsEl.innerHTML = '';
    columns.forEach(col => {
      const chip = document.createElement('div');
      chip.className = 'col-chip';
      chip.draggable = true;
      chip.dataset.key = col;
      chip.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="5 9 2 12 5 15"/><polyline points="19 9 22 12 19 15"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        ${esc(col)}`;
      chip.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', col);
        e.dataTransfer.effectAllowed = 'copy';
        chip.classList.add('dragging');
      });
      chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
      columnChipsEl.appendChild(chip);
    });
    if (columnFieldsSection) columnFieldsSection.style.display = '';
  }

  if (btnClearExcel) {
    btnClearExcel.addEventListener('click', () => {
      state.excelData    = [];
      state.excelColumns = [];
      state.fields       = [];
      state.activeFieldIdx = -1;
      state.previewRowIdx  = 0;
      state.editingRowIdx  = -1;
      state.rowOverrides   = {};
      if (excelPreviewWrap) excelPreviewWrap.style.display = 'none';
      if (excelCount) excelCount.style.display = 'none';
      if (excelUploadLabel) excelUploadLabel.textContent = 'Click to upload or drag & drop';
      if (excelFile) excelFile.value = '';
      if (columnFieldsSection) columnFieldsSection.style.display = 'none';
      if (columnChipsEl) columnChipsEl.innerHTML = '';
      buildVarChips();
      updateBulkBtn();
      updateSendBtn();
      updateRowIndicator();
      if (activeFieldLabel) {
        activeFieldLabel.textContent = 'no field selected';
        activeFieldLabel.classList.remove('has-field');
      }
      if (btnRemoveField) btnRemoveField.style.display = 'none';
      render();
      toast('Excel data cleared');
    });
  }

  // ── Canvas drop zone ───────────────────────────────────────────────
  if (canvas) {
    canvas.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      canvas.classList.add('drop-over');
    });

    canvas.addEventListener('dragleave', () => canvas.classList.remove('drop-over'));

    canvas.addEventListener('drop', e => {
      e.preventDefault();
      canvas.classList.remove('drop-over');
      const key = e.dataTransfer.getData('text/plain');
      if (!key || !state.excelColumns.includes(key)) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      addField(key, x, y);
      toast(`"${key}" placed on canvas`, 'success');
    });

    // ── Canvas drag to reposition fields ──────────────────────────────
    function canvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left)  / rect.width,
        y: (clientY - rect.top)   / rect.height,
      };
    }

    canvas.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      const c = canvasCoords(e);
      const cx = c.x * state.naturalW;
      const cy = c.y * state.naturalH;
      const hitIdx = hitTestFields(cx, cy);

      if (hitIdx >= 0) {
        selectField(hitIdx);
        state.draggingField = true;
        const baseField = state.fields[hitIdx];
        const f = getEffectiveField(baseField, state.previewRowIdx);
        state.dragFieldOffX = c.x - f.x;
        state.dragFieldOffY = c.y - f.y;
        canvas.style.cursor = 'grabbing';
      } else {
        selectField(-1);
      }
      e.preventDefault();
    });

    canvas.addEventListener('touchstart', e => {
      const c = canvasCoords(e);
      const cx = c.x * state.naturalW;
      const cy = c.y * state.naturalH;
      const hitIdx = hitTestFields(cx, cy);

      if (hitIdx >= 0) {
        selectField(hitIdx);
        state.draggingField = true;
        const baseField = state.fields[hitIdx];
        const f = getEffectiveField(baseField, state.previewRowIdx);
        state.dragFieldOffX = c.x - f.x;
        state.dragFieldOffY = c.y - f.y;
      } else {
        selectField(-1);
      }
      e.preventDefault();
    }, { passive: false });
  }

  window.addEventListener('mousemove', e => {
    if (!state.draggingField || state.activeFieldIdx < 0 || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const c = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height
    };
    const newX = Math.max(0, Math.min(1, c.x - state.dragFieldOffX));
    const newY = Math.max(0, Math.min(1, c.y - state.dragFieldOffY));

    const baseField = state.fields[state.activeFieldIdx];

    if (state.editingRowIdx >= 0) {
      if (!state.rowOverrides[state.editingRowIdx]) state.rowOverrides[state.editingRowIdx] = {};
      if (!state.rowOverrides[state.editingRowIdx][baseField.key]) state.rowOverrides[state.editingRowIdx][baseField.key] = {};
      state.rowOverrides[state.editingRowIdx][baseField.key].x = newX;
      state.rowOverrides[state.editingRowIdx][baseField.key].y = newY;
      updateTableRowHighlights();
    } else {
      baseField.x = newX;
      baseField.y = newY;
    }
    render();
  });

  window.addEventListener('mouseup', () => {
    state.draggingField = false;
    if (canvas) canvas.style.cursor = 'crosshair';
  });

  window.addEventListener('touchmove', e => {
    if (!state.draggingField || state.activeFieldIdx < 0 || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const c = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top)  / rect.height
    };
    const newX = Math.max(0, Math.min(1, c.x - state.dragFieldOffX));
    const newY = Math.max(0, Math.min(1, c.y - state.dragFieldOffY));

    const baseField = state.fields[state.activeFieldIdx];

    if (state.editingRowIdx >= 0) {
      if (!state.rowOverrides[state.editingRowIdx]) state.rowOverrides[state.editingRowIdx] = {};
      if (!state.rowOverrides[state.editingRowIdx][baseField.key]) state.rowOverrides[state.editingRowIdx][baseField.key] = {};
      state.rowOverrides[state.editingRowIdx][baseField.key].x = newX;
      state.rowOverrides[state.editingRowIdx][baseField.key].y = newY;
      updateTableRowHighlights();
    } else {
      baseField.x = newX;
      baseField.y = newY;
    }
    render();
  }, { passive: false });

  window.addEventListener('touchend', () => { state.draggingField = false; });

  // ── Zoom ───────────────────────────────────────────────────────────
  const ZOOM_STEPS = [0.25, 0.35, 0.5, 0.65, 0.75, 1.0];
  let zoomIdx = 3;

  function applyZoom() {
    state.scale = ZOOM_STEPS[zoomIdx];
    if (zoomLbl) zoomLbl.textContent = Math.round(state.scale * 100) + '%';
    if (state.naturalW && canvas) {
      canvas.style.width  = Math.round(state.naturalW  * state.scale) + 'px';
      canvas.style.height = Math.round(state.naturalH * state.scale) + 'px';
    }
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click',  () => { if (zoomIdx < ZOOM_STEPS.length - 1) { zoomIdx++; applyZoom(); } });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { if (zoomIdx > 0) { zoomIdx--; applyZoom(); } });

  function autoFitZoom() {
    const wrap = document.getElementById('canvasWrap');
    const availW = (wrap?.clientWidth  || 800) - 48;
    const availH = (wrap?.clientHeight || 600) - 100;
    const bestScale = Math.min(availW / (state.naturalW || 1), availH / (state.naturalH || 1), 1.0);
    let idx = 0;
    for (let i = 0; i < ZOOM_STEPS.length; i++) {
      if (ZOOM_STEPS[i] <= bestScale) idx = i;
    }
    zoomIdx = idx;
    applyZoom();
  }

  // ── Typography control changes → update active field ──────────────
  function onTypographyChange() {
    saveActiveFieldTypography();
    render();
  }

  if (fontSize) fontSize.addEventListener('input', onTypographyChange);
  if (boldBtn) boldBtn.addEventListener('click',   () => { boldBtn.classList.toggle('active');   onTypographyChange(); });
  if (italicBtn) italicBtn.addEventListener('click', () => { italicBtn.classList.toggle('active'); onTypographyChange(); });

  alignBtns.forEach(btn => btn.addEventListener('click', () => {
    alignBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    onTypographyChange();
  }));

  transformBtns.forEach(btn => btn.addEventListener('click', () => {
    transformBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    onTypographyChange();
  }));

  if (fontColor) fontColor.addEventListener('input', () => { if (fontColorHex) fontColorHex.value = fontColor.value; onTypographyChange(); });
  if (fontColorHex) {
    fontColorHex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(fontColorHex.value)) { 
        if (fontColor) fontColor.value = fontColorHex.value; 
        onTypographyChange(); 
      }
    });
  }

  if (shadowEnabled) {
    shadowEnabled.addEventListener('change', () => {
      if (shadowControls) shadowControls.classList.toggle('visible', shadowEnabled.checked);
      onTypographyChange();
    });
  }

  if (shadowColor) shadowColor.addEventListener('input', () => { if (shadowColorHex) shadowColorHex.value = shadowColor.value; onTypographyChange(); });
  if (shadowColorHex) {
    shadowColorHex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(shadowColorHex.value)) { 
        if (shadowColor) shadowColor.value = shadowColorHex.value; 
        onTypographyChange(); 
      }
    });
  }

  [shadowBlur, shadowOffsetX, shadowOffsetY].forEach(el => {
    if (el) el.addEventListener('input', onTypographyChange);
  });

  if (shadowOpacity) {
    shadowOpacity.addEventListener('input', () => {
      if (shadowOpacityVal) shadowOpacityVal.textContent = shadowOpacity.value + '%';
      onTypographyChange();
    });
  }

  // ── Download buttons ───────────────────────────────────────────────
  if (btnDownload) btnDownload.addEventListener('click', downloadPreview);
  if (btnBulk) btnBulk.addEventListener('click', downloadBulk);

  // ── Modal helpers ──────────────────────────────────────────────────
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  [smtpModal, emailModal].forEach(m => {
    if (m) m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(smtpModal); closeModal(emailModal); }
  });

  if (btnOpenSmtp) btnOpenSmtp.addEventListener('click', () => openModal(smtpModal));
  if (smtpModalClose) smtpModalClose.addEventListener('click', () => closeModal(smtpModal));

  if (btnOpenCompose) btnOpenCompose.addEventListener('click', () => openModal(emailModal));
  if (emailModalClose) emailModalClose.addEventListener('click', () => { closeModal(emailModal); updateComposeSummary(); });
  if (emailModalDone) emailModalDone.addEventListener('click',  () => { closeModal(emailModal); updateComposeSummary(); });
  if (emailSubject) emailSubject.addEventListener('input', () => { updateComposeSummary(); saveDraft(); });

  function updateComposeSummary() {
    if (!composeSummary || !emailSubject) return;
    const s = emailSubject.value.trim();
    composeSummary.textContent = s || 'No subject set';
  }

  // ── Rich Text Toolbar ──────────────────────────────────────────────
  function updateToolbarState() {
    ['bold','italic','underline'].forEach(cmd => {
      const btn = document.querySelector(`.rich-btn[data-cmd="${cmd}"]`);
      if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
    });
  }

  document.querySelectorAll('.rich-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      document.execCommand(btn.dataset.cmd, false, null);
      if (emailBody) emailBody.focus();
      updateToolbarState();
      saveDraft();
    });
  });

  const btnInsertLink = document.getElementById('btnInsertLink');
  if (btnInsertLink) {
    btnInsertLink.addEventListener('mousedown', e => {
      e.preventDefault();
      if (emailBody) emailBody.focus();
      const sel = window.getSelection();
      const selectedText = sel && sel.toString().trim();
      const url = prompt('Enter URL:', 'https://');
      if (!url || url === 'https://') return;
      if (selectedText) {
        document.execCommand('createLink', false, url);
        if (emailBody) {
          emailBody.querySelectorAll('a').forEach(a => {
            if (a.href === url || a.getAttribute('href') === url) a.setAttribute('target', '_blank');
          });
        }
      } else {
        const label = prompt('Link text:', url);
        if (!label) return;
        document.execCommand('insertHTML', false, `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`);
      }
      saveDraft();
    });
  }

  document.addEventListener('selectionchange', () => {
    if (document.activeElement === emailBody) updateToolbarState();
  });

  if (emailBody) {
    emailBody.addEventListener('input', saveDraft);

    emailBody.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); document.execCommand('bold'); updateToolbarState(); saveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); document.execCommand('italic'); updateToolbarState(); saveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') { e.preventDefault(); document.execCommand('underline'); updateToolbarState(); saveDraft(); }
    });
  }

  const btnSaveTemplate = document.getElementById('btnSaveTemplate');
  if (btnSaveTemplate) {
    btnSaveTemplate.addEventListener('click', () => {
      const name = prompt('Template name:');
      if (!name || !name.trim()) return;
      const list = getTemplates();
      list.push({ name: name.trim(), subject: emailSubject ? emailSubject.value : '', bodyHtml: emailBody ? emailBody.innerHTML : '' });
      setTemplates(list);
      buildTemplateSelect();
      toast(`Template "${name.trim()}" saved`, 'success');
    });
  }

  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) {
    templateSelect.addEventListener('change', function() {
      const val = this.value;
      if (!val) return;
      if (val.startsWith('del_')) {
        const idx = parseInt(val.replace('del_', ''), 10);
        const list = getTemplates();
        const tName = list[idx]?.name || 'template';
        if (!confirm(`Delete template "${tName}"?`)) { this.value = ''; return; }
        list.splice(idx, 1);
        setTemplates(list);
        buildTemplateSelect();
        toast(`Template deleted`);
        this.value = '';
        return;
      }
      const idx = parseInt(val, 10);
      const list = getTemplates();
      const t = list[idx];
      if (!t) { this.value = ''; return; }
      if (emailSubject) emailSubject.value  = t.subject || '';
      if (emailBody) emailBody.innerHTML = contentToEditorHtml(t.bodyHtml || '');
      updateComposeSummary();
      saveDraft();
      toast(`Template "${t.name}" loaded`, 'success');
      this.value = '';
    });
  }

  // ── SMTP Config ────────────────────────────────────────────────────
  function loadSmtpFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('certgen_smtp') || '{}');
      if (saved.host && smtpHost)         smtpHost.value     = saved.host;
      if (saved.port && smtpPort)         smtpPort.value     = saved.port;
      if (saved.user && smtpUser)         smtpUser.value     = saved.user;
      if (saved.fromName && smtpFromName) smtpFromName.value = saved.fromName;
      updateSmtpBadge(!!saved.host && !!saved.user);
    } catch (_) {}
  }

  function saveSmtpToStorage() {
    const cfg = {
      host:     smtpHost ? smtpHost.value.trim() : '',
      port:     smtpPort ? smtpPort.value : 587,
      user:     smtpUser ? smtpUser.value.trim() : '',
      fromName: smtpFromName ? smtpFromName.value.trim() : '',
    };
    localStorage.setItem('certgen_smtp', JSON.stringify(cfg));
    updateSmtpBadge(!!cfg.host && !!cfg.user);
    toast('SMTP settings saved', 'success');
  }

  function updateSmtpBadge(configured) {
    if (!smtpStatusBadge) return;
    smtpStatusBadge.textContent = configured ? 'Configured' : 'Not set';
    smtpStatusBadge.className   = 'smtp-status-badge ' + (configured ? 'configured' : 'unconfigured');
  }

  if (btnSaveSmtp) btnSaveSmtp.addEventListener('click', saveSmtpToStorage);

  if (btnTestSmtp) {
    btnTestSmtp.addEventListener('click', async () => {
      const smtp = getSmtpConfig();
      if (!smtp.host) { toast('Enter SMTP host first', 'warning'); return; }
      if (!smtp.user) { toast('Enter SMTP username', 'warning'); return; }
      if (!smtp.pass) { toast('Enter SMTP password', 'warning'); return; }

      btnTestSmtp.disabled = true;
      btnTestSmtp.textContent = 'Testing…';
      if (smtpTestResult) smtpTestResult.style.display = 'none';

      try {
        const res  = await fetch(`${API_BASE}/api/test-smtp`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ smtp }),
        });
        const data = await res.json();

        if (smtpTestResult) {
          smtpTestResult.style.display = 'flex';
          if (res.ok && data.ok) {
            smtpTestResult.className = 'smtp-test-result success';
            smtpTestResult.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="2 8 6 12 14 4"/></svg> Connection successful — SMTP is ready`;
            updateSmtpBadge(true);
          } else {
            smtpTestResult.className = 'smtp-test-result fail';
            smtpTestResult.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="14" y1="2" x2="2" y2="14"/><line x1="2" y1="2" x2="14" y2="14"/></svg> ${esc(data.error || 'Connection failed')}`;
          }
        }
      } catch (err) {
        if (smtpTestResult) {
          smtpTestResult.style.display = 'flex';
          smtpTestResult.className = 'smtp-test-result fail';
          smtpTestResult.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="14" y1="2" x2="2" y2="14"/><line x1="2" y1="2" x2="14" y2="14"/></svg> Cannot reach server — is server.js running? (${esc(err.message)})`;
        }
      } finally {
        btnTestSmtp.disabled = false;
        btnTestSmtp.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Test Connection`;
      }
    });
  }

  function getSmtpConfig() {
    return {
      host:     smtpHost ? smtpHost.value.trim() : '',
      port:     smtpPort ? (parseInt(smtpPort.value, 10) || 587) : 587,
      user:     smtpUser ? smtpUser.value.trim() : '',
      pass:     smtpPass ? smtpPass.value : '',
      fromName: smtpFromName ? smtpFromName.value.trim() : '',
    };
  }

  // ── Draft & Template persistence ──────────────────────────────────
  const DRAFT_KEY     = 'cert_email_draft';
  const TEMPLATES_KEY = 'cert_email_templates';

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      subject: emailSubject ? emailSubject.value : '',
      bodyHtml: emailBody ? emailBody.innerHTML : '',
    }));
  }

  function restoreDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (draft) {
        if (draft.subject && emailSubject)   emailSubject.value  = draft.subject;
        if (draft.bodyHtml && emailBody)    emailBody.innerHTML = contentToEditorHtml(draft.bodyHtml);
        updateComposeSummary();
      }
    } catch(_) {}
  }

  function getTemplates() {
    try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]'); } catch(_) { return []; }
  }

  function setTemplates(list) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(list));
  }

  function buildTemplateSelect() {
    const sel = document.getElementById('templateSelect');
    if (!sel) return;
    const list = getTemplates();
    sel.innerHTML = '<option value="">Load Template…</option>';
    list.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
    if (list.length) {
      const del = sel.querySelector('option[value="__del__"]');
      if (!del) {
        const sep = document.createElement('option');
        sep.disabled = true; sep.textContent = '─────────────';
        sel.appendChild(sep);
        list.forEach((t, i) => {
          const opt = document.createElement('option');
          opt.value = `del_${i}`;
          opt.textContent = `✕ Delete: ${t.name}`;
          sel.appendChild(opt);
        });
      }
    }
  }

  // ── Email Compose ──────────────────────────────────────────────────
  function insertVariable(variable) {
    if (!emailBody) return;
    emailBody.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      if (emailBody.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        const node = document.createTextNode(variable);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        saveDraft();
        return;
      }
    }
    emailBody.innerHTML += esc(variable);
    saveDraft();
  }

  function buildVarChips() {
    if (!varChipsEl) return;
    varChipsEl.innerHTML = '';
    const cols = state.excelColumns;
    if (!cols.length) {
      const hint = document.createElement('span');
      hint.className = 'var-chip-hint';
      hint.textContent = 'Upload an Excel file to see column variables';
      varChipsEl.appendChild(hint);
      return;
    }
    ['firstName', ...cols].forEach(col => {
      const chip = document.createElement('span');
      chip.className = 'var-chip';
      chip.textContent = `{{${col}}}`;
      chip.addEventListener('click', () => insertVariable(`{{${col}}}`));
      varChipsEl.appendChild(chip);
    });
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function applyVariables(template, rowData) {
    const name  = rowData.name  || '';
    const email = rowData.email || '';
    const enriched = { ...rowData, firstName: name.trim().split(/\s+/)[0] || '', name, email };
    let result = template;
    for (const [key, val] of Object.entries(enriched)) {
      result = result.replace(new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, 'g'), String(val || ''));
    }
    return result;
  }

  function applyVariablesHtml(htmlTemplate, rowData) {
    const name  = rowData.name  || '';
    const email = rowData.email || '';
    const enriched = { ...rowData, firstName: name.trim().split(/\s+/)[0] || '', name, email };
    let result = htmlTemplate;
    for (const [key, val] of Object.entries(enriched)) {
      result = result.replace(new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, 'g'), esc(String(val || '')));
    }
    return result;
  }

  const HAS_TAGS = /<[a-z][\s\S]*?>/i;
  const P_STYLE = 'margin:0 0 1em 0';

  function plainTextToHtml(text) {
    const escaped = esc(text);
    const lines = escaped.split('\n');
    const paragraphs = [];
    let cur = [];
    for (const line of lines) {
      if (line === '') {
        if (cur.length) { paragraphs.push(cur.join('<br>')); cur = []; }
      } else {
        cur.push(line);
      }
    }
    if (cur.length) paragraphs.push(cur.join('<br>'));
    return paragraphs.map(p => `<p style="${P_STYLE}">${p}</p>`).join('');
  }

  function normaliseBodyHtml(raw) {
    if (!HAS_TAGS.test(raw)) {
      return plainTextToHtml(raw);
    }
    const s1 = raw.replace(/<\/div>\s*<div>\s*<br\s*\/?>\s*<\/div>\s*<div>/gi, '§P§');
    const s2 = s1.replace(/<\/div>\s*<div>/gi, '<br>');
    const s3 = s2.replace(/<\/?div>/gi, '');
    const paragraphs = s3.split('§P§');
    return paragraphs.map(p => `<p style="${P_STYLE}">${p}</p>`).join('');
  }

  function buildEmailHtml(bodyHtml) {
    const content = normaliseBodyHtml(bodyHtml);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#000000;line-height:1.5;background:#ffffff">${content}</body></html>`;
  }

  function contentToEditorHtml(stored) {
    if (!HAS_TAGS.test(stored)) {
      return stored
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .split('\n')
        .map(line => `<div>${line === '' ? '<br>' : esc(line)}</div>`)
        .join('');
    }
    return stored;
  }

  function updateSendBtn() {
    if (btnSendEmails) btnSendEmails.disabled = state.excelData.length === 0;
  }

  // ── Send Emails ────────────────────────────────────────────────────
  if (btnSendEmails) btnSendEmails.addEventListener('click', sendAllEmails);

  async function sendAllEmails() {
    const data = state.excelData;
    if (!data.length) { toast('No Excel data loaded', 'warning'); return; }

    const smtp = getSmtpConfig();
    if (!smtp.host) { toast('Enter SMTP host first', 'warning'); openModal(smtpModal); return; }
    if (!smtp.user) { toast('Enter SMTP username/email', 'warning'); openModal(smtpModal); return; }
    if (!smtp.pass) { toast('Enter SMTP password', 'warning'); openModal(smtpModal); return; }

    const subject = (emailSubject ? emailSubject.value.trim() : '') || 'Your Certificate';
    const bodyTpl = (emailBody ? emailBody.innerHTML.trim() : '') || 'Hi {{firstName}},<br><br>Please find your certificate attached.';
    const apiUrl  = `${API_BASE}/api/send-email`;

    if (!state.image) { toast('Load a certificate template first', 'warning'); return; }

    const missingEmails = data.filter(r => !r.email);
    if (missingEmails.length) {
      toast(`${missingEmails.length} row(s) have no email — they will be skipped`, 'warning');
    }

    const recipients = data.filter(r => r.email);
    if (!recipients.length) { toast('No email addresses found in Excel data', 'warning'); return; }

    const confirmed = confirm(`Send ${recipients.length} certificate email${recipients.length > 1 ? 's' : ''} via SMTP?\n\nServer: ${apiUrl}\nFrom: ${smtp.user}`);
    if (!confirmed) return;

    btnSendEmails.disabled = true;
    if (emailProgressWrap) emailProgressWrap.classList.add('visible');
    if (emailResultLog) {
      emailResultLog.style.display = 'block';
      emailResultLog.innerHTML = '';
    }

    let successCount = 0;
    let failCount    = 0;

    for (let i = 0; i < recipients.length; i++) {
      const rowData = recipients[i];
      const dataIdx = state.excelData.indexOf(rowData);
      const { name, email } = rowData;
      if (emailProgressFill) emailProgressFill.style.width = `${(i / recipients.length) * 100}%`;
      if (emailProgressLbl) emailProgressLbl.textContent  = `Sending ${i + 1} / ${recipients.length}: ${name}`;

      try {
        const blob        = await generateCertBlob(rowData, dataIdx);
        const base64      = await blobToBase64(blob);
        const subjectFinal = applyVariables(subject, rowData);
        const bodyFinal    = buildEmailHtml(applyVariablesHtml(bodyTpl, rowData));
        const filename     = `${safeName(name)}_certificate.png`;

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtp,
            to:               email,
            subject:          subjectFinal,
            html:             bodyFinal,
            attachmentBase64: base64,
            filename,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(err.error || res.statusText);
        }

        successCount++;
        appendLog(name, email, true);
      } catch (err) {
        failCount++;
        appendLog(name, email, false, err.message);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    if (emailProgressFill) emailProgressFill.style.width = '100%';
    if (emailProgressLbl) emailProgressLbl.textContent  = `Done — ${successCount} sent, ${failCount} failed`;
    setTimeout(() => {
      if (emailProgressWrap) emailProgressWrap.classList.remove('visible');
      if (emailProgressFill) emailProgressFill.style.width = '0%';
    }, 3000);

    btnSendEmails.disabled = false;
    updateSendBtn();
    toast(`${successCount} sent, ${failCount} failed`, successCount > 0 ? 'success' : 'warning');
  }

  function appendLog(name, email, ok, errMsg = '') {
    if (!emailResultLog) return;
    const div = document.createElement('div');
    div.className = 'log-row ' + (ok ? 'ok' : 'fail');
    div.innerHTML = ok
      ? `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="2 8 6 12 14 4"/></svg><span>${esc(name)}</span><small>${esc(email)}</small>`
      : `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="14" y1="2" x2="2" y2="14"/><line x1="2" y1="2" x2="14" y2="14"/></svg><span>${esc(name)}</span><small>${esc(email)}</small><small class="err">${esc(errMsg)}</small>`;
    emailResultLog.appendChild(div);
    emailResultLog.scrollTop = emailResultLog.scrollHeight;
  }

  // ── Certificate image upload ───────────────────────────────────────
  function showDropZone() {
    if (certDropZone) certDropZone.style.display  = '';
    if (canvasContainer) canvasContainer.style.display = 'none';
    if (canvasHint) canvasHint.style.display    = 'none';
    if (changeTemplateBtn) changeTemplateBtn.classList.remove('visible');
  }

  function hideDropZone() {
    if (certDropZone) certDropZone.style.display    = 'none';
    if (canvasContainer) canvasContainer.style.display = '';
    if (canvasHint) canvasHint.style.display      = '';
    if (changeTemplateBtn) changeTemplateBtn.classList.add('visible');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = '';
  }

  function loadCertificateImage(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      state.image    = img;
      state.naturalW = img.naturalWidth;
      state.naturalH = img.naturalHeight;
      autoFitZoom();
      hideDropZone();
      render();
      URL.revokeObjectURL(url);
      toast(`Certificate loaded — ${state.naturalW}×${state.naturalH}px`, 'success');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      toast('Could not load image file', 'warning');
    };
    img.src = url;
  }

  if (certDropZone) {
    certDropZone.addEventListener('dragover', e => {
      e.preventDefault();
      certDropZone.classList.add('drag-active');
    });

    certDropZone.addEventListener('dragleave', () => certDropZone.classList.remove('drag-active'));

    certDropZone.addEventListener('drop', e => {
      e.preventDefault();
      certDropZone.classList.remove('drag-active');
      const file = [...e.dataTransfer.files].find(f => f.type.startsWith('image/'));
      if (!file) { toast('Please drop an image file (PNG, JPG, WebP)', 'warning'); return; }
      loadCertificateImage(file);
    });
  }

  if (certFileInput) {
    certFileInput.addEventListener('change', () => {
      if (certFileInput.files[0]) {
        loadCertificateImage(certFileInput.files[0]);
        certFileInput.value = '';
      }
    });
  }

  if (changeTemplateBtn && certFileInput) {
    changeTemplateBtn.addEventListener('click', () => certFileInput.click());
  }

  // ── Init ───────────────────────────────────────────────────────────
  if (fontTriggerLabel) fontTriggerLabel.style.fontFamily = state.committedFont;
  buildVarChips();
  loadSmtpFromStorage();
  restoreDraft();
  buildTemplateSelect();
  updateRowIndicator();
  showDropZone();
})();