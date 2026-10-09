import type { ResourceSnapshot, VaultEntry } from "./contract.ts";

/** The network whose vault alerts carry no suffix: the backend's original vault. */
export const PRIMARY_VAULT_NETWORK = "eip155:43113";

const NETWORK_NAMES: Record<string, string> = {
  "eip155:43113": "Avalanche Fuji",
  "stellar:testnet": "Stellar Testnet",
};

export const networkName = (network: string): string => NETWORK_NAMES[network] ?? network;

/**
 * The vaults of a snapshot, one per network. A backend that predates `vaults` sends only `vault`:
 * it is the primary one, so it is shown the same way.
 */
export function vaultsOf(resources: ResourceSnapshot): VaultEntry[] {
  if (Array.isArray(resources.vaults) && resources.vaults.length > 0) return resources.vaults;
  if (resources.vault) return [{ network: PRIMARY_VAULT_NETWORK, vault: resources.vault }];
  return resources.vaultError ? [{ network: PRIMARY_VAULT_NETWORK, vault: null, error: resources.vaultError }] : [];
}

/**
 * Worst level among the alerts about one network's vault. The backend names the vault of another
 * network in the alert's target (`VAULT_EMPTY:stellar:testnet`); the primary one has none.
 */
export function vaultLevel(alerts: ReadonlyArray<{ code: string; severity: "warning" | "error" }>, network: string): "ok" | "warning" | "error" {
  const hits = alerts.filter((a) => {
    if (!a.code.startsWith("VAULT_")) return false;
    const at = a.code.indexOf(":");
    const target = at === -1 ? null : a.code.slice(at + 1);
    return network === PRIMARY_VAULT_NETWORK ? target === null : target === network;
  });
  return hits.some((a) => a.severity === "error") ? "error" : hits.length > 0 ? "warning" : "ok";
}
