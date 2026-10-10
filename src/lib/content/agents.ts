import type { Environment, IntegrationStatus, Locale } from "../i18n/types";

export type LocalizedText = Readonly<Record<Locale, string>>;
export type AgentSurface = "terminal" | "editor" | "desktop";

interface AgentIdentity {
  slug: string;
  name: string;
  group: "primary" | "additional";
  surface: AgentSurface;
  surfaceDetail: LocalizedText;
  summary: LocalizedText;
  officialDocs: `https://${string}`;
  docsCheckedAt: string;
  environment: Environment;
  asset: { src: `/assets/${string}`; alt: LocalizedText; accent?: "cool" | "warm"; scale?: number; poster?: `/assets/${string}` } | null;
  fallback: { initials: string; icon: "doc" | "layers" | "rules" };
  /**
   * The team's sign-off for the four integration stages on the card. It is independent of the tested guide below:
   * the stages read as verified for the clients that carry it, whatever evidence the entry holds.
   */
  teamVerified?: boolean;
  /** Client documentation reference, never a tested TilcAI setup recipe. */
  reference: LocalizedText;
  prerequisite: LocalizedText;
}

type AgentIntegration =
  | { status: "preparation"; guide: { kind: "preparation" } }
  | {
      status: Exclude<IntegrationStatus, "preparation">;
      guide: {
        kind: "validated";
        testedAt: string;
        transport: string;
        authentication: LocalizedText;
        tools: readonly string[];
        steps: readonly LocalizedText[];
        disconnect: LocalizedText;
        /** Public configuration only: no tokens, private keys or personal paths. */
        configuration?: string;
      };
    };

export type AgentClient = Readonly<AgentIdentity & AgentIntegration>;

export type IntegrationStageKey = "docs" | "transport" | "tools" | "approval";

/**
 * Where a client stands on the road to a TilcAI connection. Derived from the guide data, so a stage reads as
 * done when the evidence for it exists on the entry, or when the team has signed the client off (`teamVerified`).
 */
export function integrationStages(agent: AgentClient): { key: IntegrationStageKey; done: boolean }[] {
  const validated = agent.guide.kind === "validated" ? agent.guide : null;
  const signedOff = agent.teamVerified === true;
  return [
    { key: "docs", done: signedOff || agent.docsCheckedAt.length > 0 },
    { key: "transport", done: signedOff || validated !== null },
    { key: "tools", done: signedOff || (validated !== null && validated.tools.length > 0) },
    { key: "approval", done: signedOff || agent.status === "enabled" },
  ];
}

const text = (es: string, en: string): LocalizedText => ({ es, en });
const prepared = (entry: Omit<AgentIdentity, "docsCheckedAt" | "environment" | "asset"> & { asset?: AgentIdentity["asset"] }): AgentClient => ({
  ...entry,
  docsCheckedAt: "2026-09-30",
  teamVerified: true,
  environment: "simulation",
  asset: entry.asset ?? null,
  status: "preparation",
  guide: { kind: "preparation" },
});

// MCP support in the client's docs is not evidence of a TilcAI connection.
// Add another entry here; the scroll story and panel do not depend on client names.
export const agents: readonly AgentClient[] = [
  prepared({
    slug: "codex", name: "Codex", group: "primary", surface: "terminal",
    asset: { src: "/assets/codex.png", alt: text("Mascota azul de Codex", "Blue Codex mascot"), accent: "cool" },
    surfaceDetail: text("Codex CLI", "Codex CLI"),
    summary: text("Herramientas MCP desde tu terminal de desarrollo.", "MCP tools from your development terminal."),
    officialDocs: "https://learn.chatgpt.com/docs/extend/mcp?surface=cli",
    fallback: { initials: "CX", icon: "doc" },
    reference: text("La documentación de Codex describe servidores MCP en config.toml. Esta entrada se centra en CLI; no es una guía universal para ChatGPT.", "Codex documentation describes MCP servers in config.toml. This entry focuses on CLI; it is not a universal ChatGPT guide."),
    prerequisite: text("Definir la versión de Codex CLI y probar el transporte y la autenticación del servidor TilcAI antes de publicar una receta.", "Choose a Codex CLI version and test the TilcAI server transport and authentication before publishing a setup recipe."),
  }),
  prepared({
    slug: "claude-code", name: "Claude Code", group: "primary", surface: "terminal",
    asset: { src: "/assets/claude.png", alt: text("Mascota naranja de Claude", "Orange Claude mascot"), accent: "warm", scale: 1.35 },
    surfaceDetail: text("Claude Code · CLI", "Claude Code · CLI"),
    summary: text("Conexión de herramientas en la sesión de Claude Code.", "Tool connections in your Claude Code session."),
    officialDocs: "https://code.claude.com/docs/en/mcp",
    fallback: { initials: "CC", icon: "doc" },
    reference: text("Claude Code documenta servidores locales y remotos y configuración con claude mcp. Claude Desktop tiene su propia entrada.", "Claude Code documents local and remote servers and configuration with claude mcp. Claude Desktop has its own entry."),
    prerequisite: text("Verificar el alcance de configuración elegido y el comportamiento de aprobación en la versión del piloto.", "Verify the chosen configuration scope and approval behavior in the pilot version."),
  }),
  prepared({
    slug: "opencode", name: "OpenCode", group: "primary", surface: "terminal",
    asset: { src: "/assets/img/agentes/agente-opencode.png", alt: text("Robot negro con detalles azules de OpenCode", "Black robot with blue details for OpenCode"), accent: "cool" },
    surfaceDetail: text("OpenCode · terminal", "OpenCode · terminal"),
    summary: text("Cliente de terminal con servidores MCP configurables.", "Terminal client with configurable MCP servers."),
    officialDocs: "https://opencode.ai/docs/mcp-servers/",
    fallback: { initials: "OC", icon: "layers" },
    reference: text("OpenCode documenta entradas MCP locales y remotas en opencode.json, con controles de activación y autenticación.", "OpenCode documents local and remote MCP entries in opencode.json, with activation and authentication controls."),
    prerequisite: text("Probar el descubrimiento de herramientas y los permisos con la configuración exacta del servidor TilcAI.", "Test tool discovery and permissions against the exact TilcAI server configuration."),
  }),
  prepared({
    slug: "gemini-cli", name: "Gemini CLI", group: "primary", surface: "terminal",
    asset: { src: "/assets/img/agentes/agente-gemini.png", alt: text("Robot blanco con estrella de colores de Gemini", "White robot with a colourful star for Gemini"), accent: "cool" },
    surfaceDetail: text("Gemini CLI · terminal", "Gemini CLI · terminal"),
    summary: text("Herramientas MCP en una sesión de Gemini CLI.", "MCP tools in a Gemini CLI session."),
    officialDocs: "https://geminicli.com/docs/tools/mcp-server/",
    fallback: { initials: "GC", icon: "rules" },
    reference: text("Gemini CLI documenta mcpServers en settings.json y controles de selección y confianza de herramientas.", "Gemini CLI documents mcpServers in settings.json and tool selection and trust controls."),
    prerequisite: text("Validar transporte y controles de confianza sin confundir la aprobación de herramientas con autoridad financiera.", "Validate transport and trust controls without equating tool approval with financial authority."),
  }),
  prepared({
    slug: "cursor", name: "Cursor", group: "primary", surface: "editor",
    surfaceDetail: text("Cursor · editor", "Cursor · editor"),
    summary: text("Consulta herramientas desde tu espacio de trabajo.", "Access tools from your workspace."),
    officialDocs: "https://cursor.com/docs/mcp",
    fallback: { initials: "CU", icon: "layers" },
    reference: text("Cursor documenta servidores MCP en .cursor/mcp.json con configuración de proyecto o de usuario.", "Cursor documents MCP servers in .cursor/mcp.json with project or user configuration."),
    prerequisite: text("Probar la configuración en el editor Cursor y revisar las herramientas permitidas para ese espacio de trabajo.", "Test configuration in the Cursor editor and review allowed tools for that workspace."),
  }),
  prepared({
    slug: "github-copilot-vscode", name: "GitHub Copilot", group: "primary", surface: "editor",
    surfaceDetail: text("GitHub Copilot en VS Code", "GitHub Copilot in VS Code"),
    summary: text("Una guía específica para la superficie de VS Code.", "A guide specific to the VS Code surface."),
    officialDocs: "https://code.visualstudio.com/docs/agent-customization/mcp-servers",
    fallback: { initials: "CP", icon: "layers" },
    reference: text("VS Code documenta la gestión de servidores MCP y su alcance. La configuración de esta superficie no se aplica automáticamente a otros clientes Copilot.", "VS Code documents MCP server management and scope. This surface's configuration does not automatically apply to other Copilot clients."),
    prerequisite: text("Verificar la versión de VS Code, el acceso a herramientas y el alcance del servidor usado en el piloto.", "Verify the VS Code version, tool access and server scope used in the pilot."),
  }),
  prepared({
    slug: "cline", name: "Cline", group: "additional", surface: "editor",
    surfaceDetail: text("Cline · extensión de editor", "Cline · editor extension"),
    summary: text("Servidores MCP desde el panel de la extensión.", "MCP servers from the extension panel."),
    officialDocs: "https://docs.cline.bot/mcp/mcp-overview",
    fallback: { initials: "CL", icon: "rules" },
    reference: text("Cline documenta un panel MCP para sus extensiones de editor y configuración local o remota. Esta entrada no describe Cline CLI.", "Cline documents an MCP panel for its editor extensions and local or remote configuration. This entry does not describe Cline CLI."),
    prerequisite: text("Probar una versión concreta de la extensión y sus permisos de herramientas antes de ofrecer configuración TilcAI.", "Test a specific extension version and its tool permissions before offering TilcAI configuration."),
  }),
  prepared({
    slug: "continue", name: "Continue", group: "additional", surface: "editor",
    surfaceDetail: text("Continue · extensión de IDE", "Continue · IDE extension"),
    summary: text("Herramientas externas en tu entorno de desarrollo.", "External tools in your development environment."),
    officialDocs: "https://docs.continue.dev/customize/mcp-tools",
    fallback: { initials: "CO", icon: "doc" },
    reference: text("La documentación de Continue para extensiones de IDE describe bloques MCP y configuración de herramientas.", "Continue's IDE extension documentation describes MCP blocks and tool configuration."),
    prerequisite: text("Definir la extensión, versión y configuración de herramientas que formarán parte de la prueba TilcAI.", "Define the extension, version and tool configuration to include in the TilcAI test."),
  }),
  prepared({
    slug: "cascade", name: "Cascade", group: "additional", surface: "editor",
    surfaceDetail: text("Cascade · agente legado en Devin Desktop", "Cascade · legacy agent in Devin Desktop"),
    summary: text("Una superficie distinta del agente Devin Local.", "A separate surface from the Devin Local agent."),
    officialDocs: "https://docs.devin.ai/desktop/cascade/mcp",
    fallback: { initials: "CA", icon: "layers" },
    reference: text("La documentación actual de Devin Desktop limita esta configuración MCP a Cascade legado. Devin Local usa otra configuración; no se presentan como la misma entrada.", "Current Devin Desktop documentation limits this MCP configuration to legacy Cascade. Devin Local uses another configuration; they are not presented as the same entry."),
    prerequisite: text("Confirmar que el piloto usa Cascade legado y verificar su versión; revisar la superficie antes de habilitarla.", "Confirm the pilot uses legacy Cascade and verify its version; review the surface before enabling it."),
  }),
  prepared({
    slug: "kiro", name: "Kiro", group: "additional", surface: "editor",
    surfaceDetail: text("Kiro · IDE", "Kiro · IDE"),
    summary: text("Herramientas MCP en la superficie de IDE de Kiro.", "MCP tools in Kiro's IDE surface."),
    officialDocs: "https://kiro.dev/docs/mcp/usage/",
    fallback: { initials: "KI", icon: "rules" },
    reference: text("Kiro documenta herramientas MCP en varias superficies. Esta entrada delimita el IDE y su panel de servidores.", "Kiro documents MCP tools across several surfaces. This entry is scoped to the IDE and its servers panel."),
    prerequisite: text("Validar la versión del IDE; no reutilizar sin prueba una configuración de Kiro CLI o Amazon Q Developer.", "Validate the IDE version; do not reuse Kiro CLI or Amazon Q Developer configuration without testing."),
  }),
  prepared({
    slug: "amazon-q-developer", name: "Amazon Q Developer", group: "additional", surface: "editor",
    surfaceDetail: text("Amazon Q Developer · IDE", "Amazon Q Developer · IDE"),
    summary: text("Configuración de herramientas desde el panel del IDE.", "Tool configuration from the IDE panel."),
    officialDocs: "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/mcp-ide.html",
    fallback: { initials: "AQ", icon: "doc" },
    reference: text("AWS documenta configuración MCP para Q Developer en el IDE. Se mantiene separada de Kiro y de la configuración de CLI.", "AWS documents MCP configuration for Q Developer in the IDE. It is kept separate from Kiro and CLI configuration."),
    prerequisite: text("Confirmar la extensión y su disponibilidad en el entorno del piloto antes de probar el servidor TilcAI.", "Confirm the extension and its availability in the pilot environment before testing the TilcAI server."),
  }),
  prepared({
    slug: "claude-desktop", name: "Claude Desktop", group: "additional", surface: "desktop",
    asset: { src: "/assets/claude.png", alt: text("Mascota naranja de Claude", "Orange Claude mascot"), accent: "warm", scale: 1.35 },
    surfaceDetail: text("Claude Desktop · aplicación", "Claude Desktop · application"),
    summary: text("Aplicación de escritorio, con configuración propia.", "Desktop application with its own configuration."),
    officialDocs: "https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop",
    fallback: { initials: "CD", icon: "layers" },
    reference: text("Anthropic documenta extensiones de escritorio para servidores MCP locales. La configuración de Claude Code no es una receta para esta aplicación.", "Anthropic documents desktop extensions for local MCP servers. Claude Code configuration is not a setup recipe for this application."),
    prerequisite: text("Probar el empaquetado y la conexión en una versión concreta de Claude Desktop antes de publicar una guía TilcAI.", "Test packaging and connection in a specific Claude Desktop version before publishing a TilcAI guide."),
  }),
];
