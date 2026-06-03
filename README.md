# Portainer Monitor Card

Custom Lovelace cards for Home Assistant that display Portainer Docker stacks, containers, and endpoints — with a full visual editor and colour-coded health states.

Requires the built-in **Portainer integration** (Home Assistant 2025.10+).

---

## Cards

| Card | Type | Use for |
|------|------|---------|
| `portainer-stack-card` | Stack | A Docker Compose / Swarm stack with auto-discovered child container columns |
| `portainer-container-card` | Container | A single container with CPU %, memory bar, and controls |
| `portainer-endpoint-card` | Endpoint | A Docker host with container counts, system info, and disk usage |

---

## Installation via HACS

1. In HACS → **Frontend** → click the three-dot menu → **Custom repositories**
2. Add `https://github.com/adelando/ha-portainer-monitor` as type **Dashboard**
3. Search for **Portainer Monitor Card** and install
4. Hard-refresh your browser (Ctrl+Shift+R)

---

## Configuration

All cards are configured via the **visual editor** — click the card, then the pencil icon. Only Portainer entities appear in the entity pickers.

### Stack Card

```yaml
type: custom:portainer-stack-card
title: crypto-tradebot (stack)
stack_status_entity: binary_sensor.portainer_crypto_tradebot_stack_status
stack_switch_entity: switch.portainer_crypto_tradebot_stack
stack_type_entity: sensor.portainer_crypto_tradebot_stack_type
container_count_entity: sensor.portainer_crypto_tradebot_stack_containers_count
ip_address: "192.168.0.4 : 8765"
show_controls: true
icon: mdi:bitcoin
```

Child container rows are **auto-discovered** — the card finds all container devices nested under the stack device and shows their CPU %, memory %, and status automatically.

### Container Card

```yaml
type: custom:portainer-container-card
title: tradebot
status_entity: binary_sensor.portainer_tradebot_status
state_entity: sensor.portainer_tradebot_container_state
cpu_entity: sensor.portainer_tradebot_cpu_usage_total
memory_entity: sensor.portainer_tradebot_memory_usage_percentage
container_switch_entity: switch.portainer_tradebot_container
restart_button_entity: button.portainer_tradebot_restart_container
pause_button_entity: button.portainer_tradebot_pause_container
resume_button_entity: button.portainer_tradebot_resume_container
ip_address: "192.168.0.4"
```

> **Note:** `state_entity` is required for the **Resume** button to appear. The card only renders Resume when `sensor.*_container_state` reads `paused` — without it the button is always hidden.

### Endpoint Card

```yaml
type: custom:portainer-endpoint-card
title: my-server (endpoint)
status_entity: binary_sensor.portainer_local_status
containers_count_entity: sensor.portainer_local_containers_count
containers_running_entity: sensor.portainer_local_containers_running
containers_stopped_entity: sensor.portainer_local_containers_stopped
containers_paused_entity: sensor.portainer_local_containers_paused
docker_version_entity: sensor.portainer_local_docker_version
os_entity: sensor.portainer_local_operating_system
memory_total_entity: sensor.portainer_local_memory_total
cpu_total_entity: sensor.portainer_local_cpu_total
image_disk_total_entity: sensor.portainer_local_image_disk_usage_total_size
image_disk_reclaimable_entity: sensor.portainer_local_image_disk_usage_reclaimable
container_disk_total_entity: sensor.portainer_local_container_disk_usage_total_size
prune_images_button_entity: button.portainer_local_prune_unused_images
ip_address: "192.168.0.4"
```

> **Tip:** If your endpoint name contains underscores (e.g. `my_server`), entity IDs will look like `sensor.portainer_my_server_containers_count`. Use the visual editor — it filters to Portainer entities automatically.

---

## Status colours

| Colour | Meaning |
|--------|---------|
| Green `#00c853` | Running / Active / Online |
| Amber `#ff6d00` | Paused / Restarting / Degraded |
| Red `#d50000` | Exited / Dead / Offline |
| Grey `#757575` | Unavailable / Unknown |

The card border glows in the status colour. Stopped container counts are shown in red; paused counts in amber.

---

## Development

```bash
npm install
npm run build      # produces dist/portainer-monitor-card.js
npm run dev        # watch mode
```

The compiled `dist/portainer-monitor-card.js` is committed so HACS can serve it without a build step.
