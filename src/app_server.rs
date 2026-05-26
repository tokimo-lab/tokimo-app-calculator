//! Embedded axum HTTP server listening on a local socket.
//!
//! The main server proxies `/api/apps/calculator/<rest>` to `/<rest>` on this socket.

use std::sync::{Arc, OnceLock};

use axum::{Router, routing::get};
use tokimo_bus_client::BusClient;
use tokimo_bus_protocol::{BusListener, DataPlaneSocket};
use tracing::{error, info};

use crate::assets;

pub async fn spawn(
    service: &str,
    _client_slot: Arc<OnceLock<Arc<BusClient>>>,
) -> anyhow::Result<DataPlaneSocket> {
    let (listener, socket) = BusListener::bind_for_app(service)?;
    info!(?socket, "calculator: app server listening");

    let router = build_router();

    tokio::spawn(async move {
        if let Err(e) = axum::serve(listener, router).await {
            error!(error = %e, "calculator: app server stopped");
        }
    });

    Ok(socket)
}

fn build_router() -> Router {
    Router::new().route("/assets/{*path}", get(assets::serve))
}
