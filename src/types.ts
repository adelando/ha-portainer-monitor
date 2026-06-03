export interface StackCardConfig {
  type: string;
  title?: string;
  stack_status_entity: string;
  stack_type_entity?: string;
  container_count_entity?: string;
  stack_switch_entity?: string;
  ip_address?: string;
  show_controls?: boolean;
  icon?: string;
  container_overrides?: Record<string, { label?: string }>;
}

export interface ContainerCardConfig {
  type: string;
  title?: string;
  status_entity: string;
  state_entity?: string;
  cpu_entity?: string;
  memory_entity?: string;
  container_switch_entity?: string;
  restart_button_entity?: string;
  pause_button_entity?: string;
  resume_button_entity?: string;
  ip_address?: string;
  icon?: string;
}

export interface EndpointCardConfig {
  type: string;
  title?: string;
  status_entity: string;
  containers_count_entity?: string;
  containers_running_entity?: string;
  containers_stopped_entity?: string;
  docker_version_entity?: string;
  os_entity?: string;
  memory_total_entity?: string;
  cpu_total_entity?: string;
  image_disk_total_entity?: string;
  image_disk_reclaimable_entity?: string;
  container_disk_total_entity?: string;
  prune_images_button_entity?: string;
  ip_address?: string;
  icon?: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  platform: string;
  device_id: string | null;
}

export interface HassDevice {
  id: string;
  name: string;
  name_by_user: string | null;
  via_device_id: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryEntry>;
  devices: Record<string, HassDevice>;
  callService(domain: string, service: string, data: Record<string, unknown>): void;
}
