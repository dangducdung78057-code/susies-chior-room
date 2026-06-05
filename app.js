const state = {
  score: null,
  audioContext: null,
  nodes: [],
  playbackTimer: null,
  playbackStartedAt: 0,
  playbackSeconds: 0,
};

const els = {
  scoreInput: document.querySelector("#scoreInput"),
  fileDrop: document.querySelector("#fileDrop"),
  demoButton: document.querySelector("#demoButton"),
  clearButton: document.querySelector("#clearButton"),
  scoreStatus: document.querySelector("#scoreStatus"),
  scoreMeta: document.querySelector("#scoreMeta"),
  partSelect: document.querySelector("#partSelect"),
  speedSlider: document.querySelector("#speedSlider"),
  speedOutput: document.querySelector("#speedOutput"),
  currentBpm: document.querySelector("#currentBpm"),
  playPartButton: document.querySelector("#playPartButton"),
  playAllButton: document.querySelector("#playAllButton"),
  rhythmButton: document.querySelector("#rhythmButton"),
  stopButton: document.querySelector("#stopButton"),
  progressBar: document.querySelector("#progressBar"),
  analysisSubtitle: document.querySelector("#analysisSubtitle"),
  summaryChips: document.querySelector("#summaryChips"),
  partGrid: document.querySelector("#partGrid"),
  insightStrip: document.querySelector("#insightStrip"),
  practiceNotes: document.querySelector("#practiceNotes"),
  notesStatus: document.querySelector("#notesStatus"),
};

const NOTE_CLASS = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const FIFTHS_MAJOR = {
  "-7": "Cb major",
  "-6": "Gb major",
  "-5": "Db major",
  "-4": "Ab major",
  "-3": "Eb major",
  "-2": "Bb major",
  "-1": "F major",
  0: "C major",
  1: "G major",
  2: "D major",
  3: "A major",
  4: "E major",
  5: "B major",
  6: "F# major",
  7: "C# major",
};

const FIFTHS_MINOR = {
  "-7": "Ab minor",
  "-6": "Eb minor",
  "-5": "Bb minor",
  "-4": "F minor",
  "-3": "C minor",
  "-2": "G minor",
  "-1": "D minor",
  0: "A minor",
  1: "E minor",
  2: "B minor",
  3: "F# minor",
  4: "C# minor",
  5: "G# minor",
  6: "D# minor",
  7: "A# minor",
};

const DEMO_MUSICXML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <work><work-title>Warm Light Amen</work-title></work>
  <identification><creator type="composer">Susie's Choir Room</creator></identification>
  <part-list>
    <score-part id="P1"><part-name>Soprano</part-name></score-part>
    <score-part id="P2"><part-name>Alto</part-name></score-part>
    <score-part id="P3"><part-name>Tenor</part-name></score-part>
    <score-part id="P4"><part-name>Bass</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths><mode>major</mode></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction placement="above"><sound tempo="76"/></direction>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><type>half</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><type>half</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>4</duration><type>whole</type></note>
    </measure>
  </part>
  <part id="P2">
    <measure number="1">
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>B</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>2</duration><type>half</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><type>half</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>whole</type></note>
    </measure>
  </part>
  <part id="P3">
    <measure number="1">
      <note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>F</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>A</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>F</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>2</duration><type>half</type></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>2</duration><type>half</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>whole</type></note>
    </measure>
  </part>
  <part id="P4">
    <measure number="1">
      <note><pitch><step>C</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>C</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>F</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>E</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>D</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>E</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>F</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
      <note><pitch><step>G</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>C</step><octave>3</octave></pitch><duration>2</duration><type>half</type></note>
      <note><pitch><step>G</step><octave>2</octave></pitch><duration>2</duration><type>half</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>C</step><octave>3</octave></pitch><duration>4</duration><type>whole</type></note>
    </measure>
  </part>
</score-partwise>`;

function child(node, name) {
  return Array.from(node?.children || []).find((item) => item.localName === name) || null;
}

function children(node, name) {
  return Array.from(node?.children || []).filter((item) => item.localName === name);
}

function descendants(node, name) {
  return Array.from(node?.getElementsByTagName("*") || []).filter((item) => item.localName === name);
}

function text(node) {
  return node?.textContent?.trim() || "";
}

function childText(node, name) {
  return text(child(node, name));
}

function descendantText(node, name) {
  return text(descendants(node, name)[0]);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseScore(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) {
    throw new Error("MusicXML 文件无法读取，请确认文件格式。");
  }

  const root = Array.from(doc.children).find((item) => item.localName === "score-partwise");
  if (!root) {
    throw new Error("暂时支持 score-partwise 格式的 MusicXML。");
  }

  const partDefinitions = new Map();
  descendants(root, "score-part").forEach((part) => {
    const id = part.getAttribute("id");
    if (!id) return;
    partDefinitions.set(id, {
      id,
      name: descendantText(part, "part-name") || id,
      abbreviation: descendantText(part, "part-abbreviation"),
    });
  });

  const title =
    descendantText(root, "work-title") ||
    descendantText(root, "movement-title") ||
    descendantText(root, "credit-words") ||
    "Untitled score";

  const composer =
    descendants(root, "creator").find((item) => item.getAttribute("type") === "composer")?.textContent?.trim() ||
    "";

  const score = {
    title,
    composer,
    parts: [],
    key: null,
    timeSignature: null,
    baseTempo: null,
    totalQuarters: 0,
    measureCount: 0,
  };

  children(root, "part").forEach((partElement) => {
    const parsedPart = parsePart(partElement, partDefinitions.get(partElement.getAttribute("id")));
    score.parts.push(parsedPart);

    if (!score.key && parsedPart.key) score.key = parsedPart.key;
    if (!score.timeSignature && parsedPart.timeSignature) score.timeSignature = parsedPart.timeSignature;
    if (!score.baseTempo && parsedPart.tempo) score.baseTempo = parsedPart.tempo;
    score.totalQuarters = Math.max(score.totalQuarters, parsedPart.totalQuarters);
    score.measureCount = Math.max(score.measureCount, parsedPart.measureCount);
  });

  score.baseTempo = Math.round(score.baseTempo || 88);
  score.parts = score.parts.map((part) => ({ ...part, analysis: analyzePart(part, score.totalQuarters) }));

  if (!score.parts.length) {
    throw new Error("没有在曲谱中找到声部。");
  }

  return score;
}

function parsePart(partElement, definition = {}) {
  let divisions = 1;
  let currentQuarter = 0;
  let latestKey = null;
  let latestTime = { beats: 4, beatType: 4 };
  let latestTempo = null;
  const events = [];
  const measures = children(partElement, "measure");

  measures.forEach((measureElement, measureIndex) => {
    let cursor = currentQuarter;
    let maxCursor = currentQuarter;
    let lastNoteStart = cursor;
    const measureNumber = measureElement.getAttribute("number") || String(measureIndex + 1);

    Array.from(measureElement.children).forEach((item) => {
      if (item.localName === "attributes") {
        const nextDivisions = Number(descendantText(item, "divisions"));
        if (Number.isFinite(nextDivisions) && nextDivisions > 0) {
          divisions = nextDivisions;
        }

        const keyNode = descendants(item, "key")[0];
        if (keyNode) latestKey = parseKey(keyNode);

        const timeNode = descendants(item, "time")[0];
        if (timeNode) latestTime = parseTime(timeNode) || latestTime;
      }

      if (item.localName === "direction") {
        const tempo = parseTempo(item);
        if (tempo) latestTempo = tempo;
      }

      if (item.localName === "backup") {
        cursor -= durationFromNode(item, divisions);
      }

      if (item.localName === "forward") {
        cursor += durationFromNode(item, divisions);
        maxCursor = Math.max(maxCursor, cursor);
      }

      if (item.localName === "note") {
        const duration = durationFromNode(item, divisions);
        const isChord = Boolean(child(item, "chord"));
        const startsAt = isChord ? lastNoteStart : cursor;
        const pitch = parsePitch(child(item, "pitch"));
        const isRest = Boolean(child(item, "rest")) || !pitch;

        events.push({
          start: startsAt,
          duration,
          end: startsAt + duration,
          measure: measureNumber,
          isRest,
          isChord,
          pitch,
          lyric: descendantText(item, "text"),
        });

        if (!isChord) {
          lastNoteStart = startsAt;
          cursor += duration;
        }
        maxCursor = Math.max(maxCursor, startsAt + duration, cursor);
      }
    });

    const measuredLength = maxCursor - currentQuarter;
    const expectedLength = latestTime ? latestTime.beats * (4 / latestTime.beatType) : 0;
    currentQuarter += measuredLength || expectedLength || 4;
  });

  return {
    id: partElement.getAttribute("id") || definition.id,
    name: definition.name || partElement.getAttribute("id") || "Part",
    abbreviation: definition.abbreviation || "",
    events,
    key: latestKey,
    timeSignature: latestTime,
    tempo: latestTempo,
    totalQuarters: currentQuarter,
    measureCount: measures.length,
  };
}

function durationFromNode(node, divisions) {
  const value = Number(childText(node, "duration"));
  return Number.isFinite(value) && value > 0 ? value / divisions : 0;
}

function parseKey(keyNode) {
  const fifths = Number(childText(keyNode, "fifths") || 0);
  const mode = childText(keyNode, "mode").toLowerCase();
  const map = mode === "minor" ? FIFTHS_MINOR : FIFTHS_MAJOR;
  return {
    fifths,
    mode: mode || "major",
    label: map[String(fifths)] || `${fifths} fifths`,
  };
}

function parseTime(timeNode) {
  const beats = Number(childText(timeNode, "beats"));
  const beatType = Number(childText(timeNode, "beat-type"));
  if (!Number.isFinite(beats) || !Number.isFinite(beatType)) return null;
  return {
    beats,
    beatType,
    label: `${beats}/${beatType}`,
  };
}

function parseTempo(directionNode) {
  const soundTempo = descendants(directionNode, "sound")
    .map((item) => Number(item.getAttribute("tempo")))
    .find((value) => Number.isFinite(value) && value > 0);
  if (soundTempo) return soundTempo;

  const metronomeTempo = Number(descendantText(directionNode, "per-minute"));
  return Number.isFinite(metronomeTempo) && metronomeTempo > 0 ? metronomeTempo : null;
}

function parsePitch(pitchNode) {
  if (!pitchNode) return null;
  const step = childText(pitchNode, "step").toUpperCase();
  const alter = Number(childText(pitchNode, "alter") || 0);
  const octave = Number(childText(pitchNode, "octave"));
  if (!Object.hasOwn(NOTE_CLASS, step) || !Number.isFinite(octave)) return null;

  const midi = (octave + 1) * 12 + NOTE_CLASS[step] + alter;
  const accidental = alter === 1 ? "#" : alter === -1 ? "b" : alter ? `${alter > 0 ? "+" : ""}${alter}` : "";
  return {
    step,
    alter,
    octave,
    midi,
    label: `${step}${accidental}${octave}`,
    frequency: 440 * Math.pow(2, (midi - 69) / 12),
  };
}

function analyzePart(part, scoreLength) {
  const pitched = part.events.filter((event) => !event.isRest && event.pitch);
  const rests = part.events.filter((event) => event.isRest);
  const midis = pitched.map((event) => event.pitch.midi);
  const min = midis.length ? Math.min(...midis) : null;
  const max = midis.length ? Math.max(...midis) : null;
  const leaps = [];

  let previous = null;
  pitched.forEach((event) => {
    if (previous) {
      const interval = Math.abs(event.pitch.midi - previous.pitch.midi);
      if (interval >= 7) {
        leaps.push({
          interval,
          from: previous.pitch.label,
          to: event.pitch.label,
          measure: event.measure,
        });
      }
    }
    previous = event;
  });

  const shortNotes = pitched.filter((event) => event.duration <= 0.5).length;
  const density = scoreLength ? pitched.length / scoreLength : 0;

  return {
    min,
    max,
    range: min === null ? "--" : `${midiToLabel(min)} - ${midiToLabel(max)}`,
    noteCount: pitched.length,
    restCount: rests.length,
    voice: inferVoice(part.name, min, max),
    leaps,
    shortNotes,
    density,
  };
}

function midiToLabel(midi) {
  const names = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[midi % 12]}${octave}`;
}

function inferVoice(name, min, max) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("soprano") || lowerName.includes("女高")) return "Soprano";
  if (lowerName.includes("alto") || lowerName.includes("女低")) return "Alto";
  if (lowerName.includes("tenor") || lowerName.includes("男高")) return "Tenor";
  if (lowerName.includes("bass") || lowerName.includes("男低")) return "Bass";
  if (min === null || max === null) return "Voice";

  const center = (min + max) / 2;
  if (center >= 70) return "Soprano";
  if (center >= 62) return "Alto";
  if (center >= 53) return "Tenor";
  return "Bass";
}

function render() {
  const score = state.score;
  const hasScore = Boolean(score);

  els.scoreStatus.textContent = hasScore ? `${score.parts.length} 个声部 · ${score.measureCount} 小节` : "未载入曲谱";
  els.scoreMeta.innerHTML = hasScore ? renderMeta(score) : renderEmptyMeta();
  els.analysisSubtitle.textContent = hasScore
    ? `${score.title}${score.composer ? ` · ${score.composer}` : ""}`
    : "导入曲谱后生成声部、音域和节奏线索。";
  els.summaryChips.innerHTML = hasScore ? renderChips(score) : "";
  els.partGrid.innerHTML = hasScore ? renderPartCards(score) : renderEmptyState();
  els.insightStrip.innerHTML = hasScore ? renderInsights(score) : renderEmptyInsights();

  els.partSelect.disabled = !hasScore;
  els.playPartButton.disabled = !hasScore;
  els.playAllButton.disabled = !hasScore;
  els.rhythmButton.disabled = !hasScore;
  els.stopButton.disabled = true;

  if (hasScore) {
    const previous = els.partSelect.value;
    els.partSelect.innerHTML = score.parts
      .map((part) => `<option value="${escapeHtml(part.id)}">${escapeHtml(part.name)}</option>`)
      .join("");
    if (score.parts.some((part) => part.id === previous)) {
      els.partSelect.value = previous;
    }
  } else {
    els.partSelect.innerHTML = "<option>先导入曲谱</option>";
  }

  updateTempoReadout();
}

function renderMeta(score) {
  return [
    ["标题", score.title],
    ["调号", score.key?.label || "--"],
    ["拍号", score.timeSignature?.label || "--"],
    ["速度", `${score.baseTempo} BPM`],
  ]
    .map(([term, value]) => `<div><dt>${term}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

function renderEmptyMeta() {
  return [
    ["标题", "等待曲谱"],
    ["调号", "--"],
    ["拍号", "--"],
    ["速度", "--"],
  ]
    .map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`)
    .join("");
}

function renderChips(score) {
  const durationSeconds = Math.round((score.totalQuarters * 60) / score.baseTempo);
  return [
    `${score.parts.length} 声部`,
    `${score.measureCount} 小节`,
    score.key?.label || "未知调号",
    score.timeSignature?.label || "未知拍号",
    `${durationSeconds}s @ ${score.baseTempo} BPM`,
  ]
    .map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`)
    .join("");
}

function renderPartCards(score) {
  return score.parts
    .map((part) => {
      const analysis = part.analysis;
      const leapText = analysis.leaps.length
        ? `有 ${analysis.leaps.length} 个较大跳进，优先看第 ${analysis.leaps[0].measure} 小节。`
        : "旋律跳进较少，适合先稳定音准和连贯气息。";
      const rhythmText = analysis.shortNotes
        ? `短音符 ${analysis.shortNotes} 个，节奏示范会更有帮助。`
        : "节奏密度不高，可以用慢速建立音准。";

      return `
        <article class="part-card">
          <div class="part-title">
            <div>
              <h3>${escapeHtml(part.name)}</h3>
              <p>${escapeHtml(part.abbreviation || part.id || "")}</p>
            </div>
            <span class="voice-tag">${escapeHtml(analysis.voice)}</span>
          </div>
          <div class="part-stats">
            <div class="stat"><span>音域</span><strong>${escapeHtml(analysis.range)}</strong></div>
            <div class="stat"><span>音符</span><strong>${analysis.noteCount}</strong></div>
            <div class="stat"><span>休止</span><strong>${analysis.restCount}</strong></div>
          </div>
          <p>${escapeHtml(leapText)} ${escapeHtml(rhythmText)}</p>
        </article>
      `;
    })
    .join("");
}

function renderEmptyState() {
  return `
    <article class="empty-state">
      <div>
        <strong>还没有曲谱</strong>
        <span>载入示例或导入 MusicXML 后开始分析。</span>
      </div>
    </article>
  `;
}

function renderInsights(score) {
  const hardestLeaps = score.parts
    .flatMap((part) => part.analysis.leaps.map((leap) => ({ ...leap, part: part.name })))
    .sort((a, b) => b.interval - a.interval);
  const densePart = [...score.parts].sort((a, b) => b.analysis.density - a.analysis.density)[0];
  const rangePart = [...score.parts].sort((a, b) => {
    const aRange = (a.analysis.max || 0) - (a.analysis.min || 0);
    const bRange = (b.analysis.max || 0) - (b.analysis.min || 0);
    return bRange - aRange;
  })[0];

  const leapText = hardestLeaps.length
    ? `${hardestLeaps[0].part} 第 ${hardestLeaps[0].measure} 小节：${hardestLeaps[0].from} 到 ${hardestLeaps[0].to}`
    : "没有明显大跳。";

  return `
    <div><strong>跳进</strong><span>${escapeHtml(leapText)}</span></div>
    <div><strong>节奏</strong><span>${escapeHtml(densePart?.name || "--")} 的音符密度最高，可先放慢到 70%。</span></div>
    <div><strong>音域</strong><span>${escapeHtml(rangePart?.name || "--")} 覆盖 ${escapeHtml(rangePart?.analysis.range || "--")}。</span></div>
  `;
}

function renderEmptyInsights() {
  return "<div><strong>分析重点</strong><span>等待曲谱数据。</span></div>";
}

function updateTempoReadout() {
  const speed = Number(els.speedSlider.value);
  els.speedOutput.textContent = `${speed}%`;
  if (!state.score) {
    els.currentBpm.textContent = "-- BPM";
    return;
  }
  els.currentBpm.textContent = `${getCurrentBpm()} BPM`;
}

function getCurrentBpm() {
  const base = state.score?.baseTempo || 88;
  return Math.round(base * (Number(els.speedSlider.value) / 100));
}

async function loadXml(xmlText, label = "") {
  stopPlayback();
  try {
    state.score = parseScore(xmlText);
    render();
    els.scoreStatus.textContent = label ? `已载入 ${label}` : "曲谱已载入";
  } catch (error) {
    state.score = null;
    render();
    els.scoreStatus.textContent = error.message;
  }
}

async function ensureAudioContext() {
  if (!state.audioContext) {
    state.audioContext = new AudioContext();
  }
  if (state.audioContext.state === "suspended") {
    await state.audioContext.resume();
  }
  return state.audioContext;
}

async function play(mode) {
  if (!state.score) return;
  stopPlayback(false);

  const context = await ensureAudioContext();
  const master = context.createGain();
  master.gain.value = mode === "all" ? 0.22 : 0.32;
  master.connect(context.destination);
  state.nodes.push(master);

  const bpm = getCurrentBpm();
  const quarterSeconds = 60 / bpm;
  const startAt = context.currentTime + 0.08;
  const durationSeconds = state.score.totalQuarters * quarterSeconds;

  if (mode === "part") {
    const part = getSelectedPart();
    schedulePart(context, master, part.events, startAt, quarterSeconds, 0.34, "triangle");
  }

  if (mode === "all") {
    state.score.parts.forEach((part, index) => {
      const pan = state.score.parts.length === 1 ? 0 : -0.75 + (index * 1.5) / (state.score.parts.length - 1);
      const destination = createPanNode(context, master, pan);
      schedulePart(context, destination, part.events, startAt, quarterSeconds, 0.18, index % 2 ? "sine" : "triangle");
    });
  }

  if (mode === "rhythm") {
    const part = getSelectedPart();
    scheduleMetronome(context, master, startAt, quarterSeconds, state.score);
    scheduleRhythmCues(context, master, part.events, startAt, quarterSeconds);
  }

  state.playbackStartedAt = startAt;
  state.playbackSeconds = durationSeconds;
  els.stopButton.disabled = false;
  state.playbackTimer = window.setInterval(updateProgress, 80);
  window.setTimeout(() => stopPlayback(), (durationSeconds + 0.5) * 1000);
}

function schedulePart(context, destination, events, startAt, quarterSeconds, level, type) {
  events
    .filter((event) => !event.isRest && event.pitch && event.duration > 0)
    .forEach((event) => {
      const start = startAt + event.start * quarterSeconds;
      const length = Math.max(0.05, event.duration * quarterSeconds * 0.92);
      scheduleTone(context, destination, event.pitch.frequency, start, length, level, type);
    });
}

function scheduleTone(context, destination, frequency, start, length, level, type = "triangle") {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + 0.02);
  gain.gain.setValueAtTime(level * 0.82, start + Math.max(0.03, length - 0.06));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start(start);
  oscillator.stop(start + length + 0.03);
  state.nodes.push(oscillator, gain, filter);
}

function scheduleMetronome(context, destination, startAt, quarterSeconds, score) {
  const time = score.timeSignature || { beats: 4, beatType: 4 };
  const beatQuarter = 4 / time.beatType;
  const measureQuarter = time.beats * beatQuarter;
  const totalBeats = Math.ceil(score.totalQuarters / beatQuarter);

  for (let beat = 0; beat <= totalBeats; beat += 1) {
    const quarter = beat * beatQuarter;
    const isStrong = Math.abs(quarter % measureQuarter) < 0.001;
    scheduleTone(
      context,
      destination,
      isStrong ? 1120 : 760,
      startAt + quarter * quarterSeconds,
      0.045,
      isStrong ? 0.34 : 0.22,
      "square",
    );
  }
}

function scheduleRhythmCues(context, destination, events, startAt, quarterSeconds) {
  events
    .filter((event) => !event.isRest && event.duration > 0)
    .forEach((event) => {
      const length = clamp(event.duration * quarterSeconds * 0.25, 0.035, 0.12);
      scheduleTone(context, destination, 520, startAt + event.start * quarterSeconds, length, 0.2, "square");
    });
}

function createPanNode(context, destination, pan) {
  if (!context.createStereoPanner) return destination;
  const panner = context.createStereoPanner();
  panner.pan.value = pan;
  panner.connect(destination);
  state.nodes.push(panner);
  return panner;
}

function stopPlayback(resetProgress = true) {
  if (state.playbackTimer) {
    window.clearInterval(state.playbackTimer);
    state.playbackTimer = null;
  }

  state.nodes.forEach((node) => {
    try {
      if (typeof node.stop === "function") node.stop();
      if (typeof node.disconnect === "function") node.disconnect();
    } catch {
      // Some scheduled nodes may already be stopped by the browser.
    }
  });
  state.nodes = [];
  els.stopButton.disabled = true;
  if (resetProgress) els.progressBar.style.width = "0%";
}

function updateProgress() {
  if (!state.audioContext || !state.playbackSeconds) return;
  const elapsed = state.audioContext.currentTime - state.playbackStartedAt;
  const progress = clamp((elapsed / state.playbackSeconds) * 100, 0, 100);
  els.progressBar.style.width = `${progress}%`;
  if (progress >= 100) stopPlayback(false);
}

function getSelectedPart() {
  const selected = els.partSelect.value;
  return state.score.parts.find((part) => part.id === selected) || state.score.parts[0];
}

function loadNotes() {
  els.practiceNotes.value = localStorage.getItem("susies-choir-room-notes") || "";
}

function saveNotes() {
  localStorage.setItem("susies-choir-room-notes", els.practiceNotes.value);
  els.notesStatus.textContent = "已保存";
  window.setTimeout(() => {
    els.notesStatus.textContent = "本地保存";
  }, 1100);
}

els.scoreInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  await loadXml(await file.text(), file.name);
  event.target.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  els.fileDrop.addEventListener(eventName, (event) => {
    event.preventDefault();
    els.fileDrop.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  els.fileDrop.addEventListener(eventName, (event) => {
    event.preventDefault();
    els.fileDrop.classList.remove("is-dragging");
  });
});

els.fileDrop.addEventListener("drop", async (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  await loadXml(await file.text(), file.name);
});

els.demoButton.addEventListener("click", () => loadXml(DEMO_MUSICXML, "示例曲谱"));
els.clearButton.addEventListener("click", () => {
  stopPlayback();
  state.score = null;
  render();
});

els.speedSlider.addEventListener("input", updateTempoReadout);
els.playPartButton.addEventListener("click", () => play("part"));
els.playAllButton.addEventListener("click", () => play("all"));
els.rhythmButton.addEventListener("click", () => play("rhythm"));
els.stopButton.addEventListener("click", () => stopPlayback());
els.practiceNotes.addEventListener("input", saveNotes);

loadNotes();
render();
