//! Calculator app — multi-process form: embedded axum + UDS.
//!
//! Pure UI app: no database, no CLI commands.
//! The binary serves static assets from ui/dist/ via the bus data-plane socket.

const MANIFEST: &str = include_str!("../tokimo-app.toml");

mod app_server;
mod assets;
mod cli;
mod error;

use clap::Parser;
use std::sync::{Arc, OnceLock};
use tokimo_bus_cli::TokimoAuthArgs;
use tokimo_bus_client::{BusClient, ClientConfig};
use tracing::{error, info};

#[derive(Parser, Debug)]
#[command(
    name = "tokimo-app-calculator",
    about = "Calculator — Tokimo 子 app",
    long_about = "Tokimo Calculator app.\n\nThis is a pure UI app with no CLI commands.\nWhen launched by the supervisor (TOKIMO_BUS_SOCKET is set), runs as a background server.",
    term_width = 100
)]
struct Cli {
    #[command(flatten)]
    auth: TokimoAuthArgs,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _cli = Cli::parse();

    if std::env::var_os("TOKIMO_BUS_SOCKET").is_some() {
        tracing_subscriber::fmt()
            .with_env_filter(
                tracing_subscriber::EnvFilter::try_from_default_env()
                    .unwrap_or_else(|_| "info,tokimo_bus_client=info,tokimo_app_calculator=debug".into()),
            )
            .init();
        if let Err(e) = run_server().await {
            error!(error = %e, "calculator: fatal");
            std::process::exit(1);
        }
    } else {
        use clap::CommandFactory;
        let mut cmd = Cli::command();
        tokimo_bus_cli::print_help_unified(&mut cmd);
        std::process::exit(0);
    }

    Ok(())
}

async fn run_server() -> anyhow::Result<()> {
    let cfg = ClientConfig::from_env().map_err(|e| anyhow::anyhow!("ClientConfig: {e}"))?;
    info!(endpoint = ?cfg.endpoint, "calculator: connecting to broker");

    let client_slot: Arc<OnceLock<Arc<BusClient>>> = Arc::new(OnceLock::new());

    let app_socket = app_server::spawn("calculator", Arc::clone(&client_slot))
        .await
        .map_err(|e| anyhow::anyhow!("app_server spawn: {e}"))?;

    let client = BusClient::builder(cfg)
        .service("calculator", env!("CARGO_PKG_VERSION"))
        .data_plane(app_socket)
        .build()
        .await
        .map_err(|e| anyhow::anyhow!("bus build: {e}"))?;
    client_slot
        .set(Arc::clone(&client))
        .map_err(|_| anyhow::anyhow!("client_slot already set"))?;

    info!("calculator: registered with broker");

    let shutdown = {
        let client = Arc::clone(&client);
        tokio::spawn(async move { client.run_until_shutdown().await })
    };

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {
            info!("calculator: SIGINT received");
            client.shutdown();
        }
        _ = shutdown => info!("calculator: broker sent Shutdown"),
    }

    Ok(())
}
