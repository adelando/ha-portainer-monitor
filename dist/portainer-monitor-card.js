// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
const STATUS_COLOR = {
    ok: "#00c853",
    warn: "#ff6d00",
    err: "#d50000",
    unknown: "#757575",
};
function containerStateToLevel(state) {
    if (!state)
        return "unknown";
    if (state === "running")
        return "ok";
    if (state === "paused" || state === "restarting")
        return "warn";
    if (state === "exited" || state === "dead" || state === "created")
        return "err";
    return "unknown";
}
function binaryToLevel(state) {
    if (!state || state === "unavailable" || state === "unknown")
        return "unknown";
    return state === "on" ? "ok" : "err";
}
function color(level) {
    return STATUS_COLOR[level];
}
function stateLabel(state) {
    if (!state)
        return "Unavailable";
    if (state === "unavailable" || state === "unknown")
        return "Unavailable";
    if (state === "on")
        return "Running";
    if (state === "off")
        return "Stopped";
    return state.charAt(0).toUpperCase() + state.slice(1);
}
function formatBytes(bytes) {
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function getState(hass, entityId) {
    var _a;
    if (!entityId)
        return undefined;
    return (_a = hass.states[entityId]) === null || _a === void 0 ? void 0 : _a.state;
}
function findEntityInDevice(hass, deviceId, domain, suffix) {
    var _a;
    return (_a = Object.values(hass.entities).find((e) => e.platform === "portainer" &&
        e.device_id === deviceId &&
        e.entity_id.startsWith(domain + ".") &&
        e.entity_id.endsWith(suffix))) === null || _a === void 0 ? void 0 : _a.entity_id;
}
function getContainersForStack(hass, stackDeviceId) {
    const containers = [];
    const seen = new Set();
    for (const entry of Object.values(hass.entities)) {
        if (entry.platform !== "portainer")
            continue;
        if (!entry.device_id)
            continue;
        const device = hass.devices[entry.device_id];
        if (!device)
            continue;
        if (device.via_device_id !== stackDeviceId)
            continue;
        if (seen.has(entry.device_id))
            continue;
        seen.add(entry.device_id);
        containers.push({
            name: device.name_by_user || device.name,
            deviceId: entry.device_id,
            stateEntity: findEntityInDevice(hass, entry.device_id, "sensor", "_container_state"),
            statusEntity: findEntityInDevice(hass, entry.device_id, "binary_sensor", "_status"),
            cpuEntity: findEntityInDevice(hass, entry.device_id, "sensor", "_cpu_usage_total"),
            memEntity: findEntityInDevice(hass, entry.device_id, "sensor", "_memory_usage_percentage"),
        });
    }
    return containers;
}
function getDeviceIdFromEntity(hass, entityId) {
    var _a, _b;
    return (_b = (_a = hass.entities[entityId]) === null || _a === void 0 ? void 0 : _a.device_id) !== null && _b !== void 0 ? _b : null;
}
// ---------------------------------------------------------------------------
// Shared CSS
// ---------------------------------------------------------------------------
const SHARED_CSS = `
  :host {
    --portainer-ok: ${STATUS_COLOR.ok};
    --portainer-warn: ${STATUS_COLOR.warn};
    --portainer-err: ${STATUS_COLOR.err};
    --portainer-unknown: ${STATUS_COLOR.unknown};
  }
  ha-card {
    padding: 16px;
    background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
    color: var(--primary-text-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    position: relative;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .card-title {
    font-size: 0.85rem;
    opacity: 0.75;
    margin: 0;
  }
  .status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0 12px;
  }
  .status-text {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1;
  }
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .ip-label {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-left: auto;
  }
  .stats-grid {
    display: grid;
    gap: 8px 16px;
    margin-top: 4px;
  }
  .stat-col {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .stat-value {
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .controls {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  mwc-button, ha-button {
    --mdc-theme-primary: var(--primary-color);
  }
  .pill {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .divider {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 10px 0;
  }
  .error-msg {
    color: var(--error-color, #cf6679);
    font-size: 0.85rem;
    padding: 8px 0;
  }
`;
// ---------------------------------------------------------------------------
// We defer class definition until lit is available on the window.
// HA loads lit before custom cards, so this runs synchronously in practice.
// ---------------------------------------------------------------------------
function definCards() {
    const { LitElement, html: litHtml, css: litCss, nothing } = window;
    // -------------------------------------------------------------------------
    // STACK CARD
    // -------------------------------------------------------------------------
    class PortainerStackCard extends LitElement {
        constructor() {
            super(...arguments);
            this._deviceId = null;
        }
        static get properties() {
            return { hass: {}, _config: {}, _deviceId: { state: true } };
        }
        static get styles() {
            return litCss `${SHARED_CSS}
        .stats-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
        .container-row { display: contents; }
      `;
        }
        static getConfigElement() {
            return document.createElement("portainer-stack-card-editor");
        }
        static getStubConfig() {
            return { type: "custom:portainer-stack-card", stack_status_entity: "" };
        }
        setConfig(config) {
            if (!config.stack_status_entity)
                throw new Error("stack_status_entity is required");
            this._config = config;
        }
        updated(changed) {
            var _a;
            if (changed.has("hass") && ((_a = this._config) === null || _a === void 0 ? void 0 : _a.stack_status_entity)) {
                const id = getDeviceIdFromEntity(this.hass, this._config.stack_status_entity);
                if (id !== this._deviceId)
                    this._deviceId = id;
            }
        }
        render() {
            if (!this.hass || !this._config)
                return litHtml ``;
            const cfg = this._config;
            const statusState = getState(this.hass, cfg.stack_status_entity);
            const level = binaryToLevel(statusState);
            const borderColor = color(level);
            const label = statusState === "on" ? "Running" : stateLabel(statusState);
            const containers = this._deviceId
                ? getContainersForStack(this.hass, this._deviceId)
                : [];
            const stackType = getState(this.hass, cfg.stack_type_entity);
            const containerCount = getState(this.hass, cfg.container_count_entity);
            const switchState = getState(this.hass, cfg.stack_switch_entity);
            const title = cfg.title || "Stack";
            const ip = cfg.ip_address || "";
            return litHtml `
        <ha-card style="box-shadow: inset 0 0 0 2px ${borderColor};">
          <div class="header">
            <div class="header-left">
              <div class="icon-badge">
                <ha-icon icon="${cfg.icon || "mdi:layers-outline"}"></ha-icon>
              </div>
              <span class="card-title">${title}</span>
            </div>
            <div class="icon-badge">
              <ha-icon icon="${cfg.icon || "mdi:layers-outline"}"></ha-icon>
            </div>
          </div>

          <div class="status-row">
            <span class="status-text">${label}</span>
            <span class="status-dot" style="background:${borderColor};"></span>
            ${ip ? litHtml `<span class="ip-label">${ip}</span>` : nothing}
          </div>

          ${containers.length > 0 || stackType || containerCount ? litHtml `
            <div class="divider"></div>
            <div class="stats-grid" style="grid-template-columns: repeat(${Math.min(containers.length + 2, 6)}, 1fr);">
              ${stackType || containerCount ? litHtml `
                <div class="stat-col">
                  <div class="stat-label">Stack</div>
                  <div class="stat-value">
                    ${containerCount
                ? `${containerCount} container${Number(containerCount) !== 1 ? "s" : ""}`
                : stackType || "—"}
                  </div>
                </div>
              ` : nothing}
              ${containers.map((c) => {
                var _a, _b, _c, _d, _e, _f;
                const cState = getState(this.hass, c.stateEntity);
                const cStatus = getState(this.hass, c.statusEntity);
                const cCpu = getState(this.hass, c.cpuEntity);
                const cMem = getState(this.hass, c.memEntity);
                const cLevel = c.statusEntity
                    ? binaryToLevel(cStatus)
                    : containerStateToLevel(cState);
                const cColor = color(cLevel);
                const cLabel = c.statusEntity
                    ? (cStatus === "on" ? "Running" : stateLabel(cStatus))
                    : stateLabel(cState);
                return litHtml `
                  ${cCpu !== undefined ? litHtml `
                    <div class="stat-col">
                      <div class="stat-label">CPU ${(_b = (_a = c.name) === null || _a === void 0 ? void 0 : _a.split("-").pop()) !== null && _b !== void 0 ? _b : c.name}</div>
                      <div class="stat-value">${cCpu !== undefined ? `${parseFloat(cCpu).toFixed(2)}%` : "—"}</div>
                    </div>
                  ` : nothing}
                  ${cMem !== undefined ? litHtml `
                    <div class="stat-col">
                      <div class="stat-label">MEM ${(_d = (_c = c.name) === null || _c === void 0 ? void 0 : _c.split("-").pop()) !== null && _d !== void 0 ? _d : c.name}</div>
                      <div class="stat-value">${cMem !== undefined ? `${parseFloat(cMem).toFixed(1)}%` : "—"}</div>
                    </div>
                  ` : nothing}
                  <div class="stat-col">
                    <div class="stat-label">${(_f = (_e = c.name) === null || _e === void 0 ? void 0 : _e.split("-").pop()) !== null && _f !== void 0 ? _f : c.name}</div>
                    <div class="stat-value" style="color:${cColor};">${cLabel}</div>
                  </div>
                `;
            })}
            </div>
          ` : nothing}

          ${cfg.show_controls && cfg.stack_switch_entity ? litHtml `
            <div class="controls">
              <ha-button @click=${() => {
                const svc = switchState === "on" ? "turn_off" : "turn_on";
                this.hass.callService("switch", svc, { entity_id: cfg.stack_switch_entity });
            }}>
                ${switchState === "on" ? "Stop Stack" : "Start Stack"}
              </ha-button>
            </div>
          ` : nothing}
        </ha-card>
      `;
        }
    }
    customElements.define("portainer-stack-card", PortainerStackCard);
    // -------------------------------------------------------------------------
    // CONTAINER CARD
    // -------------------------------------------------------------------------
    class PortainerContainerCard extends LitElement {
        static get properties() {
            return { hass: {}, _config: {} };
        }
        static get styles() {
            return litCss `${SHARED_CSS}
        .mem-bar-bg { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.12); overflow: hidden; margin-top: 4px; }
        .mem-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
        .stats-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
      `;
        }
        static getConfigElement() {
            return document.createElement("portainer-container-card-editor");
        }
        static getStubConfig() {
            return { type: "custom:portainer-container-card", status_entity: "" };
        }
        setConfig(config) {
            if (!config.status_entity)
                throw new Error("status_entity is required");
            this._config = config;
        }
        render() {
            if (!this.hass || !this._config)
                return litHtml ``;
            const cfg = this._config;
            const statusState = getState(this.hass, cfg.status_entity);
            const level = binaryToLevel(statusState);
            const borderColor = color(level);
            const label = statusState === "on" ? "Running" : stateLabel(statusState);
            const cpu = getState(this.hass, cfg.cpu_entity);
            getState(this.hass, cfg.memory_entity);
            const memUsage = getState(this.hass, cfg.memory_entity);
            const switchState = getState(this.hass, cfg.container_switch_entity);
            const ip = cfg.ip_address || "";
            const title = cfg.title || "Container";
            return litHtml `
        <ha-card style="box-shadow: inset 0 0 0 2px ${borderColor};">
          <div class="header">
            <div class="header-left">
              <div class="icon-badge">
                <ha-icon icon="${cfg.icon || "mdi:docker"}"></ha-icon>
              </div>
              <span class="card-title">${title}</span>
            </div>
          </div>

          <div class="status-row">
            <span class="status-text">${label}</span>
            <span class="status-dot" style="background:${borderColor};"></span>
            ${ip ? litHtml `<span class="ip-label">${ip}</span>` : nothing}
          </div>

          <div class="divider"></div>
          <div class="stats-grid">
            ${cpu !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">CPU Usage</div>
                <div class="stat-value">${parseFloat(cpu).toFixed(2)}%</div>
              </div>
            ` : nothing}
            ${memUsage !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">Memory</div>
                <div class="stat-value">${parseFloat(memUsage).toFixed(1)}%</div>
                <div class="mem-bar-bg">
                  <div class="mem-bar-fill" style="width:${Math.min(parseFloat(memUsage), 100)}%;background:${parseFloat(memUsage) > 85 ? STATUS_COLOR.err : parseFloat(memUsage) > 70 ? STATUS_COLOR.warn : STATUS_COLOR.ok};"></div>
                </div>
              </div>
            ` : nothing}
          </div>

          <div class="controls">
            ${cfg.container_switch_entity ? litHtml `
              <ha-button @click=${() => {
                const svc = switchState === "on" ? "turn_off" : "turn_on";
                this.hass.callService("switch", svc, { entity_id: cfg.container_switch_entity });
            }}>
                ${switchState === "on" ? "Stop" : "Start"}
              </ha-button>
            ` : nothing}
            ${cfg.restart_button_entity ? litHtml `
              <ha-button @click=${() => {
                this.hass.callService("button", "press", { entity_id: cfg.restart_button_entity });
            }}>Restart</ha-button>
            ` : nothing}
            ${statusState === "on" && cfg.pause_button_entity ? litHtml `
              <ha-button @click=${() => {
                this.hass.callService("button", "press", { entity_id: cfg.pause_button_entity });
            }}>Pause</ha-button>
            ` : nothing}
            ${statusState !== "on" && cfg.resume_button_entity ? litHtml `
              <ha-button @click=${() => {
                this.hass.callService("button", "press", { entity_id: cfg.resume_button_entity });
            }}>Resume</ha-button>
            ` : nothing}
          </div>
        </ha-card>
      `;
        }
    }
    customElements.define("portainer-container-card", PortainerContainerCard);
    // -------------------------------------------------------------------------
    // ENDPOINT CARD
    // -------------------------------------------------------------------------
    class PortainerEndpointCard extends LitElement {
        static get properties() {
            return { hass: {}, _config: {} };
        }
        static get styles() {
            return litCss `${SHARED_CSS}
        .stats-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
        .disk-section { margin-top: 10px; }
        .disk-title { font-size: 0.72rem; font-weight: 700; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
        .disk-row { display: flex; gap: 12px; flex-wrap: wrap; }
      `;
        }
        static getConfigElement() {
            return document.createElement("portainer-endpoint-card-editor");
        }
        static getStubConfig() {
            return { type: "custom:portainer-endpoint-card", status_entity: "" };
        }
        setConfig(config) {
            if (!config.status_entity)
                throw new Error("status_entity is required");
            this._config = config;
        }
        render() {
            if (!this.hass || !this._config)
                return litHtml ``;
            const cfg = this._config;
            const statusState = getState(this.hass, cfg.status_entity);
            const level = binaryToLevel(statusState);
            const borderColor = color(level);
            const label = statusState === "on" ? "Online" : stateLabel(statusState);
            const totalContainers = getState(this.hass, cfg.containers_count_entity);
            const running = getState(this.hass, cfg.containers_running_entity);
            const stopped = getState(this.hass, cfg.containers_stopped_entity);
            const paused = getState(this.hass, cfg.containers_paused_entity);
            const dockerVersion = getState(this.hass, cfg.docker_version_entity);
            const os = getState(this.hass, cfg.os_entity);
            const memTotal = getState(this.hass, cfg.memory_total_entity);
            const cpuTotal = getState(this.hass, cfg.cpu_total_entity);
            const imgTotal = getState(this.hass, cfg.image_disk_total_entity);
            const imgReclaimable = getState(this.hass, cfg.image_disk_reclaimable_entity);
            const ctrDiskTotal = getState(this.hass, cfg.container_disk_total_entity);
            const ip = cfg.ip_address || "";
            const title = cfg.title || "Endpoint";
            return litHtml `
        <ha-card style="box-shadow: inset 0 0 0 2px ${borderColor};">
          <div class="header">
            <div class="header-left">
              <div class="icon-badge">
                <ha-icon icon="${cfg.icon || "mdi:server"}"></ha-icon>
              </div>
              <span class="card-title">${title}</span>
            </div>
          </div>

          <div class="status-row">
            <span class="status-text">${label}</span>
            <span class="status-dot" style="background:${borderColor};"></span>
            ${ip ? litHtml `<span class="ip-label">${ip}</span>` : nothing}
          </div>

          <div class="divider"></div>
          <div class="stats-grid">
            ${totalContainers !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">Containers</div>
                <div class="stat-value">${totalContainers}</div>
              </div>
            ` : nothing}
            ${running !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">Running</div>
                <div class="stat-value" style="color:${STATUS_COLOR.ok};">${running}</div>
              </div>
            ` : nothing}
            ${stopped !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">Stopped</div>
                <div class="stat-value" style="color:${Number(stopped) > 0 ? STATUS_COLOR.err : "inherit"};">${stopped}</div>
              </div>
            ` : nothing}
            ${paused !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">Paused</div>
                <div class="stat-value" style="color:${Number(paused) > 0 ? STATUS_COLOR.warn : "inherit"};">${paused}</div>
              </div>
            ` : nothing}
            ${dockerVersion !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">Docker</div>
                <div class="stat-value">${dockerVersion}</div>
              </div>
            ` : nothing}
            ${os !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">OS</div>
                <div class="stat-value">${os}</div>
              </div>
            ` : nothing}
            ${memTotal !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">RAM</div>
                <div class="stat-value">${formatBytes(Number(memTotal))}</div>
              </div>
            ` : nothing}
            ${cpuTotal !== undefined ? litHtml `
              <div class="stat-col">
                <div class="stat-label">CPUs</div>
                <div class="stat-value">${cpuTotal}</div>
              </div>
            ` : nothing}
          </div>

          ${imgTotal !== undefined || ctrDiskTotal !== undefined ? litHtml `
            <div class="disk-section">
              <div class="divider"></div>
              <div class="disk-title">Disk Usage</div>
              <div class="disk-row">
                ${imgTotal !== undefined ? litHtml `
                  <div class="stat-col">
                    <div class="stat-label">Images</div>
                    <div class="stat-value">${formatBytes(Number(imgTotal))}${imgReclaimable ? ` (${formatBytes(Number(imgReclaimable))} reclaimable)` : ""}</div>
                  </div>
                ` : nothing}
                ${ctrDiskTotal !== undefined ? litHtml `
                  <div class="stat-col">
                    <div class="stat-label">Containers</div>
                    <div class="stat-value">${formatBytes(Number(ctrDiskTotal))}</div>
                  </div>
                ` : nothing}
              </div>
            </div>
          ` : nothing}

          ${cfg.prune_images_button_entity ? litHtml `
            <div class="controls">
              <ha-button @click=${() => {
                this.hass.callService("button", "press", { entity_id: cfg.prune_images_button_entity });
            }}>Prune Images</ha-button>
            </div>
          ` : nothing}
        </ha-card>
      `;
        }
    }
    customElements.define("portainer-endpoint-card", PortainerEndpointCard);
    function portainerDomainFilter(hass, domain) {
        return (entity) => {
            var _a;
            return entity.entity_id.startsWith(domain + ".") &&
                ((_a = hass.entities[entity.entity_id]) === null || _a === void 0 ? void 0 : _a.platform) === "portainer";
        };
    }
    // --- Stack Editor ---
    class PortainerStackCardEditor extends LitElement {
        static get properties() {
            return { hass: {}, _config: {} };
        }
        static get styles() {
            return litCss `
        .editor-row { margin-bottom: 12px; }
        .editor-label { font-size: 0.8rem; font-weight: 600; opacity: 0.7; margin-bottom: 4px; display: block; }
        .editor-section { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.4; margin: 16px 0 8px; }
      `;
        }
        setConfig(config) {
            this._config = config;
        }
        _valueChanged(field, value) {
            const config = { ...this._config, [field]: value };
            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
        }
        _entityChanged(field) {
            return (ev) => this._valueChanged(field, ev.detail.value);
        }
        _inputChanged(field) {
            return (ev) => this._valueChanged(field, ev.target.value);
        }
        render() {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (!this.hass || !this._config)
                return litHtml ``;
            const cfg = this._config;
            const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
            const swFilter = portainerDomainFilter(this.hass, "switch");
            const snFilter = portainerDomainFilter(this.hass, "sensor");
            return litHtml `
        <div class="editor-row">
          <span class="editor-label">Title</span>
          <ha-textfield label="Title" .value=${(_a = cfg.title) !== null && _a !== void 0 ? _a : ""} @change=${this._inputChanged("title")}></ha-textfield>
        </div>
        <div class="editor-row">
          <span class="editor-label">IP Address / Port (e.g. 192.168.0.4:8765)</span>
          <ha-textfield label="IP : Port" .value=${(_b = cfg.ip_address) !== null && _b !== void 0 ? _b : ""} @change=${this._inputChanged("ip_address")}></ha-textfield>
        </div>
        <div class="editor-row">
          <span class="editor-label">Icon (MDI)</span>
          <ha-textfield label="Icon" .value=${(_c = cfg.icon) !== null && _c !== void 0 ? _c : ""} @change=${this._inputChanged("icon")} placeholder="mdi:layers-outline"></ha-textfield>
        </div>

        <div class="editor-section">Entities</div>

        <div class="editor-row">
          <span class="editor-label">Stack Status (binary_sensor)</span>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${(_d = cfg.stack_status_entity) !== null && _d !== void 0 ? _d : ""}
            .entityFilter=${bsFilter}
            include-domains='["binary_sensor"]'
            @value-changed=${this._entityChanged("stack_status_entity")}
          ></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Stack Switch (switch)</span>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${(_e = cfg.stack_switch_entity) !== null && _e !== void 0 ? _e : ""}
            .entityFilter=${swFilter}
            include-domains='["switch"]'
            @value-changed=${this._entityChanged("stack_switch_entity")}
          ></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Stack Type Sensor (sensor)</span>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${(_f = cfg.stack_type_entity) !== null && _f !== void 0 ? _f : ""}
            .entityFilter=${snFilter}
            include-domains='["sensor"]'
            @value-changed=${this._entityChanged("stack_type_entity")}
          ></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Container Count Sensor (sensor)</span>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${(_g = cfg.container_count_entity) !== null && _g !== void 0 ? _g : ""}
            .entityFilter=${snFilter}
            include-domains='["sensor"]'
            @value-changed=${this._entityChanged("container_count_entity")}
          ></ha-entity-picker>
        </div>

        <div class="editor-section">Options</div>
        <div class="editor-row">
          <ha-formfield label="Show start/stop controls">
            <ha-checkbox
              .checked=${(_h = cfg.show_controls) !== null && _h !== void 0 ? _h : false}
              @change=${(ev) => this._valueChanged("show_controls", ev.target.checked)}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      `;
        }
    }
    customElements.define("portainer-stack-card-editor", PortainerStackCardEditor);
    // --- Container Editor ---
    class PortainerContainerCardEditor extends LitElement {
        static get properties() {
            return { hass: {}, _config: {} };
        }
        static get styles() {
            return litCss `
        .editor-row { margin-bottom: 12px; }
        .editor-label { font-size: 0.8rem; font-weight: 600; opacity: 0.7; margin-bottom: 4px; display: block; }
        .editor-section { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.4; margin: 16px 0 8px; }
      `;
        }
        setConfig(config) {
            this._config = config;
        }
        _valueChanged(field, value) {
            const config = { ...this._config, [field]: value };
            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
        }
        _entityChanged(field) {
            return (ev) => this._valueChanged(field, ev.detail.value);
        }
        _inputChanged(field) {
            return (ev) => this._valueChanged(field, ev.target.value);
        }
        render() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (!this.hass || !this._config)
                return litHtml ``;
            const cfg = this._config;
            const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
            const swFilter = portainerDomainFilter(this.hass, "switch");
            const snFilter = portainerDomainFilter(this.hass, "sensor");
            const btnFilter = portainerDomainFilter(this.hass, "button");
            return litHtml `
        <div class="editor-row">
          <span class="editor-label">Title</span>
          <ha-textfield label="Title" .value=${(_a = cfg.title) !== null && _a !== void 0 ? _a : ""} @change=${this._inputChanged("title")}></ha-textfield>
        </div>
        <div class="editor-row">
          <span class="editor-label">IP Address / Port</span>
          <ha-textfield label="IP : Port" .value=${(_b = cfg.ip_address) !== null && _b !== void 0 ? _b : ""} @change=${this._inputChanged("ip_address")}></ha-textfield>
        </div>
        <div class="editor-row">
          <span class="editor-label">Icon (MDI)</span>
          <ha-textfield label="Icon" .value=${(_c = cfg.icon) !== null && _c !== void 0 ? _c : ""} @change=${this._inputChanged("icon")} placeholder="mdi:docker"></ha-textfield>
        </div>

        <div class="editor-section">Entities</div>

        <div class="editor-row">
          <span class="editor-label">Status (binary_sensor)</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_d = cfg.status_entity) !== null && _d !== void 0 ? _d : ""} .entityFilter=${bsFilter} include-domains='["binary_sensor"]' @value-changed=${this._entityChanged("status_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">CPU Usage (sensor)</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_e = cfg.cpu_entity) !== null && _e !== void 0 ? _e : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("cpu_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Memory Usage % (sensor)</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_f = cfg.memory_entity) !== null && _f !== void 0 ? _f : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("memory_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Container Switch</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_g = cfg.container_switch_entity) !== null && _g !== void 0 ? _g : ""} .entityFilter=${swFilter} include-domains='["switch"]' @value-changed=${this._entityChanged("container_switch_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Restart Button</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_h = cfg.restart_button_entity) !== null && _h !== void 0 ? _h : ""} .entityFilter=${btnFilter} include-domains='["button"]' @value-changed=${this._entityChanged("restart_button_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Pause Button</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_j = cfg.pause_button_entity) !== null && _j !== void 0 ? _j : ""} .entityFilter=${btnFilter} include-domains='["button"]' @value-changed=${this._entityChanged("pause_button_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Resume Button</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_k = cfg.resume_button_entity) !== null && _k !== void 0 ? _k : ""} .entityFilter=${btnFilter} include-domains='["button"]' @value-changed=${this._entityChanged("resume_button_entity")}></ha-entity-picker>
        </div>
      `;
        }
    }
    customElements.define("portainer-container-card-editor", PortainerContainerCardEditor);
    // --- Endpoint Editor ---
    class PortainerEndpointCardEditor extends LitElement {
        static get properties() {
            return { hass: {}, _config: {} };
        }
        static get styles() {
            return litCss `
        .editor-row { margin-bottom: 12px; }
        .editor-label { font-size: 0.8rem; font-weight: 600; opacity: 0.7; margin-bottom: 4px; display: block; }
        .editor-section { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.4; margin: 16px 0 8px; }
      `;
        }
        setConfig(config) {
            this._config = config;
        }
        _valueChanged(field, value) {
            const config = { ...this._config, [field]: value };
            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
        }
        _entityChanged(field) {
            return (ev) => this._valueChanged(field, ev.detail.value);
        }
        _inputChanged(field) {
            return (ev) => this._valueChanged(field, ev.target.value);
        }
        render() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            if (!this.hass || !this._config)
                return litHtml ``;
            const cfg = this._config;
            const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
            const snFilter = portainerDomainFilter(this.hass, "sensor");
            const btnFilter = portainerDomainFilter(this.hass, "button");
            return litHtml `
        <div class="editor-row">
          <span class="editor-label">Title</span>
          <ha-textfield label="Title" .value=${(_a = cfg.title) !== null && _a !== void 0 ? _a : ""} @change=${this._inputChanged("title")}></ha-textfield>
        </div>
        <div class="editor-row">
          <span class="editor-label">IP Address / Port</span>
          <ha-textfield label="IP : Port" .value=${(_b = cfg.ip_address) !== null && _b !== void 0 ? _b : ""} @change=${this._inputChanged("ip_address")}></ha-textfield>
        </div>
        <div class="editor-row">
          <span class="editor-label">Icon (MDI)</span>
          <ha-textfield label="Icon" .value=${(_c = cfg.icon) !== null && _c !== void 0 ? _c : ""} @change=${this._inputChanged("icon")} placeholder="mdi:server"></ha-textfield>
        </div>

        <div class="editor-section">Status</div>
        <div class="editor-row">
          <span class="editor-label">Endpoint Status (binary_sensor)</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_d = cfg.status_entity) !== null && _d !== void 0 ? _d : ""} .entityFilter=${bsFilter} include-domains='["binary_sensor"]' @value-changed=${this._entityChanged("status_entity")}></ha-entity-picker>
        </div>

        <div class="editor-section">Container Counts</div>
        <div class="editor-row">
          <span class="editor-label">Total Containers</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_e = cfg.containers_count_entity) !== null && _e !== void 0 ? _e : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("containers_count_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Running</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_f = cfg.containers_running_entity) !== null && _f !== void 0 ? _f : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("containers_running_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Stopped</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_g = cfg.containers_stopped_entity) !== null && _g !== void 0 ? _g : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("containers_stopped_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Paused</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_h = cfg.containers_paused_entity) !== null && _h !== void 0 ? _h : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("containers_paused_entity")}></ha-entity-picker>
        </div>

        <div class="editor-section">System Info</div>
        <div class="editor-row">
          <span class="editor-label">Docker Version</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_j = cfg.docker_version_entity) !== null && _j !== void 0 ? _j : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("docker_version_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Operating System</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_k = cfg.os_entity) !== null && _k !== void 0 ? _k : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("os_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Total RAM</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_l = cfg.memory_total_entity) !== null && _l !== void 0 ? _l : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("memory_total_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">CPU Count</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_m = cfg.cpu_total_entity) !== null && _m !== void 0 ? _m : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("cpu_total_entity")}></ha-entity-picker>
        </div>

        <div class="editor-section">Disk Usage</div>
        <div class="editor-row">
          <span class="editor-label">Image Disk Total</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_o = cfg.image_disk_total_entity) !== null && _o !== void 0 ? _o : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("image_disk_total_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Image Disk Reclaimable</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_p = cfg.image_disk_reclaimable_entity) !== null && _p !== void 0 ? _p : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("image_disk_reclaimable_entity")}></ha-entity-picker>
        </div>
        <div class="editor-row">
          <span class="editor-label">Container Disk Total</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_q = cfg.container_disk_total_entity) !== null && _q !== void 0 ? _q : ""} .entityFilter=${snFilter} include-domains='["sensor"]' @value-changed=${this._entityChanged("container_disk_total_entity")}></ha-entity-picker>
        </div>

        <div class="editor-section">Actions</div>
        <div class="editor-row">
          <span class="editor-label">Prune Images Button</span>
          <ha-entity-picker .hass=${this.hass} .value=${(_r = cfg.prune_images_button_entity) !== null && _r !== void 0 ? _r : ""} .entityFilter=${btnFilter} include-domains='["button"]' @value-changed=${this._entityChanged("prune_images_button_entity")}></ha-entity-picker>
        </div>
      `;
        }
    }
    customElements.define("portainer-endpoint-card-editor", PortainerEndpointCardEditor);
    // -------------------------------------------------------------------------
    // Register cards with HA card picker
    // -------------------------------------------------------------------------
    window.customCards =
        window.customCards || [];
    window.customCards.push({
        type: "portainer-stack-card",
        name: "Portainer Stack Card",
        description: "Monitor a Portainer Docker Compose / Swarm stack with auto-discovered container rows",
        preview: true,
    }, {
        type: "portainer-container-card",
        name: "Portainer Container Card",
        description: "Monitor a single Portainer container with CPU, memory, and controls",
        preview: true,
    }, {
        type: "portainer-endpoint-card",
        name: "Portainer Endpoint Card",
        description: "Monitor a Portainer endpoint (Docker host) with counts, disk, and system info",
        preview: true,
    });
}
// Run immediately — HA guarantees lit is available before resources are loaded
definCards();
