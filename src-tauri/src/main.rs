// Prevents additional console window on Windows in release, DO NOT REMOVE!!
//#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use json_fns::Todo;
use serde;
use thiserror;
mod json_fns;

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
async fn add_task(new_name: &str, new_body: &str) -> Result<String, Error> {
    let path = "data/todos.json".into();
    let new_data = Todo {
        name: new_name.to_string(),
        body: new_body.to_string(),
    };

    json_fns::add_json(path, new_data).expect("Error adding to json");

    Ok("Task added".into())
}

#[tauri::command]
async fn read_tasks() -> Result<String, Error> {
    let path = "data/todos.json".to_string();
    let data = json_fns::read_json(&path).expect("Error reading json");
    let ser_data = serde_json::to_string(&data).unwrap();

    Ok(ser_data)
}

#[tauri::command]
async fn delete_task(name: &str) -> Result<(), Error> {
    let path = "data/todos.json".into();
    json_fns::remove_json(path, name.into()).expect("Error removing from json");

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_task, read_tasks, delete_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
