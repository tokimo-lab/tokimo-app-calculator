//! CLI commands — calculator is a pure UI app, no CLI commands.

use tokimo_bus_cli::TokimoAuthArgs;

/// Placeholder: no CLI commands for the calculator app.
#[allow(dead_code)]
pub async fn run_status(_auth: TokimoAuthArgs) -> anyhow::Result<()> {
    println!("Calculator app has no CLI commands.");
    Ok(())
}
