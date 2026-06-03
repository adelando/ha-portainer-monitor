import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import type {
  StackCardConfig,
  ContainerCardConfig,
  EndpointCardConfig,
  HomeAssistant,
  HassEntityRegistryEntry,
  HassDevice,
} from "./types";

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const STATUS_COLOR = {
  ok: "#00c853",
  warn: "#ff6d00",
  err: "#d50000",
  unknown: "#757575",
};

type StatusLevel = "ok" | "warn" | "err" | "unknown";

function containerStateToLevel(state: string | undefined): StatusLevel {
  if (!state) return "unknown";
  if (state === "running") return "ok";
  if (state === "paused" || state === "restarting") return "warn";
  if (state === "exited" || state === "dead" || state === "created") return "err";
  return "unknown";
}

function binaryToLevel(state: string | undefined): StatusLevel {
  if (!state || state === "unavailable" || state === "unknown") return "unknown";
  return state === "on" ? "ok" : "err";
}

function color(level: StatusLevel): string {
  return STATUS_COLOR[level];
}

function stateLabel(state: string | undefined): string {
  if (!state) return "Unavailable";
  if (state === "unavailable" || state === "unknown") return "Unavailable";
  if (state === "on") return "Running";
  if (state === "off") return "Stopped";
  return state.charAt(0).toUpperCase() + state.slice(1);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getState(hass: HomeAssistant, entityId: string | undefined): string | undefined {
  if (!entityId) return undefined;
  return hass.states[entityId]?.state;
}

function findEntityInDevice(
  hass: HomeAssistant,
  deviceId: string,
  domain: string,
  suffix: string
): string | undefined {
  return Object.values(hass.entities).find(
    (e) =>
      e.platform === "portainer" &&
      e.device_id === deviceId &&
      e.entity_id.startsWith(domain + ".") &&
      e.entity_id.endsWith(suffix)
  )?.entity_id;
}

interface ChildContainer {
  name: string;
  deviceId: string;
  stateEntity: string | undefined;
  statusEntity: string | undefined;
  cpuEntity: string | undefined;
  memEntity: string | undefined;
}

function getContainersForStack(hass: HomeAssistant, stackDeviceId: string): ChildContainer[] {
  const containers: ChildContainer[] = [];
  const seen = new Set<string>();

  for (const entry of Object.values(hass.entities) as HassEntityRegistryEntry[]) {
    if (entry.platform !== "portainer") continue;
    if (!entry.device_id) continue;
    const device = (hass.devices as Record<string, HassDevice>)[entry.device_id];
    if (!device) continue;
    if (device.via_device_id !== stackDeviceId) continue;
    if (seen.has(entry.device_id)) continue;
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

function getDeviceIdFromEntity(hass: HomeAssistant, entityId: string): string | null {
  return hass.entities[entityId]?.device_id ?? null;
}

// ---------------------------------------------------------------------------
// Shared CSS
// ---------------------------------------------------------------------------

const SHARED_CSS = css`
  :host {
    --portainer-ok: ${unsafeCSS(STATUS_COLOR.ok)};
    --portainer-warn: ${unsafeCSS(STATUS_COLOR.warn)};
    --portainer-err: ${unsafeCSS(STATUS_COLOR.err)};
    --portainer-unknown: ${unsafeCSS(STATUS_COLOR.unknown)};
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
    background: rgba(255, 255, 255, 0.12);
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
  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 10px 0;
  }
`;

// ---------------------------------------------------------------------------
// STACK CARD
// ---------------------------------------------------------------------------

class PortainerStackCard extends LitElement {
  static get properties() {
    return { hass: {}, _config: {}, _deviceId: { state: true } };
  }

  static get styles() {
    return [
      SHARED_CSS,
      css`
        .stats-grid {
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        }
      `,
    ];
  }

  static getConfigElement() {
    return document.createElement("portainer-stack-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:portainer-stack-card", stack_status_entity: "" };
  }

  _config!: StackCardConfig;
  hass!: HomeAssistant;
  _deviceId: string | null = null;

  setConfig(config: StackCardConfig) {
    if (!config.stack_status_entity) throw new Error("stack_status_entity is required");
    this._config = config;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("hass") && this._config?.stack_status_entity) {
      const id = getDeviceIdFromEntity(this.hass, this._config.stack_status_entity);
      if (id !== this._deviceId) this._deviceId = id;
    }
  }

  render() {
    if (!this.hass || !this._config) return html``;

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
    const cols = Math.min(containers.length * 3 + (stackType || containerCount ? 1 : 0), 8);

    return html`
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
          ${ip ? html`<span class="ip-label">${ip}</span>` : nothing}
        </div>

        ${containers.length > 0 || stackType || containerCount
          ? html`
              <div class="divider"></div>
              <div
                class="stats-grid"
                style="grid-template-columns: repeat(${cols}, 1fr);"
              >
                ${stackType || containerCount
                  ? html`
                      <div class="stat-col">
                        <div class="stat-label">Stack</div>
                        <div class="stat-value">
                          ${containerCount
                            ? `${containerCount} container${Number(containerCount) !== 1 ? "s" : ""}`
                            : stackType || "—"}
                        </div>
                      </div>
                    `
                  : nothing}
                ${containers.map((c) => {
                  const cStatus = getState(this.hass, c.statusEntity);
                  const cState = getState(this.hass, c.stateEntity);
                  const cCpu = getState(this.hass, c.cpuEntity);
                  const cMem = getState(this.hass, c.memEntity);
                  const cLevel = c.statusEntity
                    ? binaryToLevel(cStatus)
                    : containerStateToLevel(cState);
                  const cColor = color(cLevel);
                  const cLabel = c.statusEntity
                    ? cStatus === "on"
                      ? "Running"
                      : stateLabel(cStatus)
                    : stateLabel(cState);
                  const shortName = c.name?.split("-").pop() ?? c.name;

                  return html`
                    ${cCpu !== undefined
                      ? html`
                          <div class="stat-col">
                            <div class="stat-label">CPU ${shortName}</div>
                            <div class="stat-value">
                              ${parseFloat(cCpu).toFixed(2)}%
                            </div>
                          </div>
                        `
                      : nothing}
                    ${cMem !== undefined
                      ? html`
                          <div class="stat-col">
                            <div class="stat-label">MEM ${shortName}</div>
                            <div class="stat-value">
                              ${parseFloat(cMem).toFixed(1)}%
                            </div>
                          </div>
                        `
                      : nothing}
                    <div class="stat-col">
                      <div class="stat-label">${shortName}</div>
                      <div class="stat-value" style="color:${cColor};">
                        ${cLabel}
                      </div>
                    </div>
                  `;
                })}
              </div>
            `
          : nothing}

        ${cfg.show_controls && cfg.stack_switch_entity
          ? html`
              <div class="controls">
                <ha-button
                  @click=${() => {
                    const svc = switchState === "on" ? "turn_off" : "turn_on";
                    this.hass.callService("switch", svc, {
                      entity_id: cfg.stack_switch_entity!,
                    });
                  }}
                >
                  ${switchState === "on" ? "Stop Stack" : "Start Stack"}
                </ha-button>
              </div>
            `
          : nothing}
      </ha-card>
    `;
  }
}

customElements.define("portainer-stack-card", PortainerStackCard);

// ---------------------------------------------------------------------------
// CONTAINER CARD
// ---------------------------------------------------------------------------

class PortainerContainerCard extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  static get styles() {
    return [
      SHARED_CSS,
      css`
        .mem-bar-bg {
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
          margin-top: 4px;
        }
        .mem-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .stats-grid {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }
      `,
    ];
  }

  static getConfigElement() {
    return document.createElement("portainer-container-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:portainer-container-card", status_entity: "" };
  }

  _config!: ContainerCardConfig;
  hass!: HomeAssistant;

  setConfig(config: ContainerCardConfig) {
    if (!config.status_entity) throw new Error("status_entity is required");
    this._config = config;
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const cfg = this._config;
    const statusState = getState(this.hass, cfg.status_entity);
    const level = binaryToLevel(statusState);
    const borderColor = color(level);
    const label = statusState === "on" ? "Running" : stateLabel(statusState);

    const containerState = getState(this.hass, cfg.state_entity);
    const cpu = getState(this.hass, cfg.cpu_entity);
    const mem = getState(this.hass, cfg.memory_entity);
    const switchState = getState(this.hass, cfg.container_switch_entity);
    const ip = cfg.ip_address || "";
    const title = cfg.title || "Container";
    const memPct = mem !== undefined ? Math.min(parseFloat(mem), 100) : 0;
    const memColor =
      memPct > 85 ? STATUS_COLOR.err : memPct > 70 ? STATUS_COLOR.warn : STATUS_COLOR.ok;

    return html`
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
          ${ip ? html`<span class="ip-label">${ip}</span>` : nothing}
        </div>

        <div class="divider"></div>
        <div class="stats-grid">
          ${cpu !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">CPU Usage</div>
                  <div class="stat-value">${parseFloat(cpu).toFixed(2)}%</div>
                </div>
              `
            : nothing}
          ${mem !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">Memory</div>
                  <div class="stat-value">${parseFloat(mem).toFixed(1)}%</div>
                  <div class="mem-bar-bg">
                    <div
                      class="mem-bar-fill"
                      style="width:${memPct}%;background:${memColor};"
                    ></div>
                  </div>
                </div>
              `
            : nothing}
        </div>

        <div class="controls">
          ${cfg.container_switch_entity
            ? html`
                <ha-button
                  @click=${() => {
                    const svc = switchState === "on" ? "turn_off" : "turn_on";
                    this.hass.callService("switch", svc, {
                      entity_id: cfg.container_switch_entity!,
                    });
                  }}
                >
                  ${switchState === "on" ? "Stop" : "Start"}
                </ha-button>
              `
            : nothing}
          ${cfg.restart_button_entity
            ? html`
                <ha-button
                  @click=${() => {
                    this.hass.callService("button", "press", {
                      entity_id: cfg.restart_button_entity!,
                    });
                  }}
                  >Restart</ha-button
                >
              `
            : nothing}
          ${statusState === "on" && cfg.pause_button_entity
            ? html`
                <ha-button
                  @click=${() => {
                    this.hass.callService("button", "press", {
                      entity_id: cfg.pause_button_entity!,
                    });
                  }}
                  >Pause</ha-button
                >
              `
            : nothing}
          ${containerState === "paused" && cfg.resume_button_entity
            ? html`
                <ha-button
                  @click=${() => {
                    this.hass.callService("button", "press", {
                      entity_id: cfg.resume_button_entity!,
                    });
                  }}
                  >Resume</ha-button
                >
              `
            : nothing}
        </div>
      </ha-card>
    `;
  }
}

customElements.define("portainer-container-card", PortainerContainerCard);

// ---------------------------------------------------------------------------
// ENDPOINT CARD
// ---------------------------------------------------------------------------

class PortainerEndpointCard extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  static get styles() {
    return [
      SHARED_CSS,
      css`
        .stats-grid {
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        }
        .disk-section {
          margin-top: 10px;
        }
        .disk-title {
          font-size: 0.72rem;
          font-weight: 700;
          opacity: 0.55;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .disk-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      `,
    ];
  }

  static getConfigElement() {
    return document.createElement("portainer-endpoint-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:portainer-endpoint-card", status_entity: "" };
  }

  _config!: EndpointCardConfig;
  hass!: HomeAssistant;

  setConfig(config: EndpointCardConfig) {
    if (!config.status_entity) throw new Error("status_entity is required");
    this._config = config;
  }

  render() {
    if (!this.hass || !this._config) return html``;

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

    return html`
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
          ${ip ? html`<span class="ip-label">${ip}</span>` : nothing}
        </div>

        <div class="divider"></div>
        <div class="stats-grid">
          ${totalContainers !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">Containers</div>
                  <div class="stat-value">${totalContainers}</div>
                </div>
              `
            : nothing}
          ${running !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">Running</div>
                  <div class="stat-value" style="color:${STATUS_COLOR.ok};">${running}</div>
                </div>
              `
            : nothing}
          ${stopped !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">Stopped</div>
                  <div
                    class="stat-value"
                    style="color:${Number(stopped) > 0 ? STATUS_COLOR.err : "inherit"};"
                  >
                    ${stopped}
                  </div>
                </div>
              `
            : nothing}
          ${paused !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">Paused</div>
                  <div
                    class="stat-value"
                    style="color:${Number(paused) > 0 ? STATUS_COLOR.warn : "inherit"};"
                  >
                    ${paused}
                  </div>
                </div>
              `
            : nothing}
          ${dockerVersion !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">Docker</div>
                  <div class="stat-value">${dockerVersion}</div>
                </div>
              `
            : nothing}
          ${os !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">OS</div>
                  <div class="stat-value">${os}</div>
                </div>
              `
            : nothing}
          ${memTotal !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">RAM</div>
                  <div class="stat-value">${formatBytes(Number(memTotal))}</div>
                </div>
              `
            : nothing}
          ${cpuTotal !== undefined
            ? html`
                <div class="stat-col">
                  <div class="stat-label">CPUs</div>
                  <div class="stat-value">${cpuTotal}</div>
                </div>
              `
            : nothing}
        </div>

        ${imgTotal !== undefined || ctrDiskTotal !== undefined
          ? html`
              <div class="disk-section">
                <div class="divider"></div>
                <div class="disk-title">Disk Usage</div>
                <div class="disk-row">
                  ${imgTotal !== undefined
                    ? html`
                        <div class="stat-col">
                          <div class="stat-label">Images</div>
                          <div class="stat-value">
                            ${formatBytes(Number(imgTotal))}${imgReclaimable
                              ? ` (${formatBytes(Number(imgReclaimable))} reclaimable)`
                              : ""}
                          </div>
                        </div>
                      `
                    : nothing}
                  ${ctrDiskTotal !== undefined
                    ? html`
                        <div class="stat-col">
                          <div class="stat-label">Containers</div>
                          <div class="stat-value">${formatBytes(Number(ctrDiskTotal))}</div>
                        </div>
                      `
                    : nothing}
                </div>
              </div>
            `
          : nothing}

        ${cfg.prune_images_button_entity
          ? html`
              <div class="controls">
                <ha-button
                  @click=${() => {
                    this.hass.callService("button", "press", {
                      entity_id: cfg.prune_images_button_entity!,
                    });
                  }}
                  >Prune Images</ha-button
                >
              </div>
            `
          : nothing}
      </ha-card>
    `;
  }
}

customElements.define("portainer-endpoint-card", PortainerEndpointCard);

// ---------------------------------------------------------------------------
// EDITORS
// ---------------------------------------------------------------------------

function portainerDomainFilter(hass: HomeAssistant, domain: string) {
  return (entity: { entity_id: string }) =>
    entity.entity_id.startsWith(domain + ".") &&
    hass.entities[entity.entity_id]?.platform === "portainer";
}

// --- Stack Editor ---

class PortainerStackCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  static get styles() {
    return css`
      .editor-row {
        margin-bottom: 12px;
      }
      .editor-label {
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0.7;
        margin-bottom: 4px;
        display: block;
      }
      .editor-section {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.4;
        margin: 16px 0 8px;
      }
    `;
  }

  _config!: StackCardConfig;
  hass!: HomeAssistant;

  setConfig(config: StackCardConfig) {
    this._config = config;
  }

  _valueChanged(field: keyof StackCardConfig, value: unknown) {
    const config = { ...this._config, [field]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true })
    );
  }

  _entityChanged(field: keyof StackCardConfig) {
    return (ev: CustomEvent) => this._valueChanged(field, ev.detail.value);
  }

  _inputChanged(field: keyof StackCardConfig) {
    return (ev: Event) => this._valueChanged(field, (ev.target as HTMLInputElement).value);
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const cfg = this._config;
    const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
    const swFilter = portainerDomainFilter(this.hass, "switch");
    const snFilter = portainerDomainFilter(this.hass, "sensor");

    return html`
      <div class="editor-row">
        <span class="editor-label">Title</span>
        <ha-textfield
          label="Title"
          .value=${cfg.title ?? ""}
          @change=${this._inputChanged("title")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">IP Address / Port (e.g. 192.168.0.4:8765)</span>
        <ha-textfield
          label="IP : Port"
          .value=${cfg.ip_address ?? ""}
          @change=${this._inputChanged("ip_address")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">Icon (MDI)</span>
        <ha-textfield
          label="Icon"
          .value=${cfg.icon ?? ""}
          @change=${this._inputChanged("icon")}
          placeholder="mdi:layers-outline"
        ></ha-textfield>
      </div>

      <div class="editor-section">Entities</div>

      <div class="editor-row">
        <span class="editor-label">Stack Status (binary_sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.stack_status_entity ?? ""}
          .entityFilter=${bsFilter}
          include-domains='["binary_sensor"]'
          @value-changed=${this._entityChanged("stack_status_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Stack Switch</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.stack_switch_entity ?? ""}
          .entityFilter=${swFilter}
          include-domains='["switch"]'
          @value-changed=${this._entityChanged("stack_switch_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Stack Type Sensor</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.stack_type_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("stack_type_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container Count Sensor</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.container_count_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("container_count_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Options</div>
      <div class="editor-row">
        <ha-formfield label="Show start/stop controls">
          <ha-checkbox
            .checked=${cfg.show_controls ?? false}
            @change=${(ev: Event) =>
              this._valueChanged("show_controls", (ev.target as HTMLInputElement).checked)}
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
    return css`
      .editor-row {
        margin-bottom: 12px;
      }
      .editor-label {
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0.7;
        margin-bottom: 4px;
        display: block;
      }
      .editor-section {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.4;
        margin: 16px 0 8px;
      }
    `;
  }

  _config!: ContainerCardConfig;
  hass!: HomeAssistant;

  setConfig(config: ContainerCardConfig) {
    this._config = config;
  }

  _valueChanged(field: keyof ContainerCardConfig, value: unknown) {
    const config = { ...this._config, [field]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true })
    );
  }

  _entityChanged(field: keyof ContainerCardConfig) {
    return (ev: CustomEvent) => this._valueChanged(field, ev.detail.value);
  }

  _inputChanged(field: keyof ContainerCardConfig) {
    return (ev: Event) => this._valueChanged(field, (ev.target as HTMLInputElement).value);
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const cfg = this._config;
    const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
    const swFilter = portainerDomainFilter(this.hass, "switch");
    const snFilter = portainerDomainFilter(this.hass, "sensor");
    const btnFilter = portainerDomainFilter(this.hass, "button");

    return html`
      <div class="editor-row">
        <span class="editor-label">Title</span>
        <ha-textfield
          label="Title"
          .value=${cfg.title ?? ""}
          @change=${this._inputChanged("title")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">IP Address / Port</span>
        <ha-textfield
          label="IP : Port"
          .value=${cfg.ip_address ?? ""}
          @change=${this._inputChanged("ip_address")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">Icon (MDI)</span>
        <ha-textfield
          label="Icon"
          .value=${cfg.icon ?? ""}
          @change=${this._inputChanged("icon")}
          placeholder="mdi:docker"
        ></ha-textfield>
      </div>

      <div class="editor-section">Entities</div>

      <div class="editor-row">
        <span class="editor-label">Status (binary_sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.status_entity ?? ""}
          .entityFilter=${bsFilter}
          include-domains='["binary_sensor"]'
          @value-changed=${this._entityChanged("status_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container State (sensor — required for Resume button)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.state_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("state_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">CPU Usage (sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.cpu_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("cpu_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Memory Usage % (sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.memory_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("memory_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container Switch</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.container_switch_entity ?? ""}
          .entityFilter=${swFilter}
          include-domains='["switch"]'
          @value-changed=${this._entityChanged("container_switch_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Restart Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.restart_button_entity ?? ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("restart_button_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Pause Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.pause_button_entity ?? ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("pause_button_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Resume Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.resume_button_entity ?? ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("resume_button_entity")}
        ></ha-entity-picker>
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
    return css`
      .editor-row {
        margin-bottom: 12px;
      }
      .editor-label {
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0.7;
        margin-bottom: 4px;
        display: block;
      }
      .editor-section {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.4;
        margin: 16px 0 8px;
      }
    `;
  }

  _config!: EndpointCardConfig;
  hass!: HomeAssistant;

  setConfig(config: EndpointCardConfig) {
    this._config = config;
  }

  _valueChanged(field: keyof EndpointCardConfig, value: unknown) {
    const config = { ...this._config, [field]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true })
    );
  }

  _entityChanged(field: keyof EndpointCardConfig) {
    return (ev: CustomEvent) => this._valueChanged(field, ev.detail.value);
  }

  _inputChanged(field: keyof EndpointCardConfig) {
    return (ev: Event) => this._valueChanged(field, (ev.target as HTMLInputElement).value);
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const cfg = this._config;
    const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
    const snFilter = portainerDomainFilter(this.hass, "sensor");
    const btnFilter = portainerDomainFilter(this.hass, "button");

    return html`
      <div class="editor-row">
        <span class="editor-label">Title</span>
        <ha-textfield
          label="Title"
          .value=${cfg.title ?? ""}
          @change=${this._inputChanged("title")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">IP Address / Port</span>
        <ha-textfield
          label="IP : Port"
          .value=${cfg.ip_address ?? ""}
          @change=${this._inputChanged("ip_address")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">Icon (MDI)</span>
        <ha-textfield
          label="Icon"
          .value=${cfg.icon ?? ""}
          @change=${this._inputChanged("icon")}
          placeholder="mdi:server"
        ></ha-textfield>
      </div>

      <div class="editor-section">Status</div>
      <div class="editor-row">
        <span class="editor-label">Endpoint Status (binary_sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.status_entity ?? ""}
          .entityFilter=${bsFilter}
          include-domains='["binary_sensor"]'
          @value-changed=${this._entityChanged("status_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Container Counts</div>
      <div class="editor-row">
        <span class="editor-label">Total Containers</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.containers_count_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_count_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Running</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.containers_running_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_running_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Stopped</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.containers_stopped_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_stopped_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Paused</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.containers_paused_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_paused_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">System Info</div>
      <div class="editor-row">
        <span class="editor-label">Docker Version</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.docker_version_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("docker_version_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Operating System</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.os_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("os_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Total RAM</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.memory_total_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("memory_total_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">CPU Count</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.cpu_total_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("cpu_total_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Disk Usage</div>
      <div class="editor-row">
        <span class="editor-label">Image Disk Total</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.image_disk_total_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("image_disk_total_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Image Disk Reclaimable</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.image_disk_reclaimable_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("image_disk_reclaimable_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container Disk Total</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.container_disk_total_entity ?? ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("container_disk_total_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Actions</div>
      <div class="editor-row">
        <span class="editor-label">Prune Images Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.prune_images_button_entity ?? ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("prune_images_button_entity")}
        ></ha-entity-picker>
      </div>
    `;
  }
}

customElements.define("portainer-endpoint-card-editor", PortainerEndpointCardEditor);

// ---------------------------------------------------------------------------
// Register cards with HA card picker
// ---------------------------------------------------------------------------

(window as unknown as { customCards?: unknown[] }).customCards =
  (window as unknown as { customCards?: unknown[] }).customCards || [];

(window as unknown as { customCards: unknown[] }).customCards.push(
  {
    type: "portainer-stack-card",
    name: "Portainer Stack Card",
    description:
      "Monitor a Portainer Docker Compose / Swarm stack with auto-discovered container rows",
    preview: true,
  },
  {
    type: "portainer-container-card",
    name: "Portainer Container Card",
    description: "Monitor a single Portainer container with CPU, memory, and controls",
    preview: true,
  },
  {
    type: "portainer-endpoint-card",
    name: "Portainer Endpoint Card",
    description:
      "Monitor a Portainer endpoint (Docker host) with counts, disk, and system info",
    preview: true,
  }
);
