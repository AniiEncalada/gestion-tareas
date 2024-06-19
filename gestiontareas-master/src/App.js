/**
 * v0 by Vercel.
 * @see https://v0.dev/t/eKQ6zJoA5PB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import './App.css';
import React, { useState } from "react"
import Input from "./Input"
import Button from "./Button"
import Checkbox from "./Checkbox"
import AlertDialog from "./AlertDialog";

export default function Component() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Terminar el informe", completed: false, dueDate: "2024-07-01" },
    { id: 2, title: "Enviar solicitud de vacaciones", completed: false, dueDate: "2024-06-30" },
    { id: 3, title: "Organizar reunión de equipo", completed: true, dueDate: "2024-06-25" },
    { id: 4, title: "Llamar al proveedor", completed: false, dueDate: "2024-06-20" },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editedTaskTitle, setEditedTaskTitle] = useState("")
  const [editedTaskDueDate, setEditedTaskDueDate] = useState("")
  const addTask = () => {
    if (newTaskTitle.trim() !== "" && newTaskDueDate !== "") {
      const newTask = { id: Date.now(), title: newTaskTitle, completed: false, dueDate: newTaskDueDate }
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
      setNewTaskDueDate("")
    }
  }
  const editTask = (taskId) => {
    setEditingTaskId(taskId)
    const task = tasks.find((t) => t.id === taskId)
    setEditedTaskTitle(task.title)
    setEditedTaskDueDate(task.dueDate)
  }
  const updateTask = () => {
    if (editedTaskTitle.trim() !== "" && editedTaskDueDate !== "") {
      setTasks(
          tasks.map((task) =>
              task.id === editingTaskId ? { ...task, title: editedTaskTitle, dueDate: editedTaskDueDate } : task,
          ),
      )
      setEditingTaskId(null)
      setEditedTaskTitle("")
      setEditedTaskDueDate("")
    }
  }
  const deleteTask = (taskId) => {
    AlertDialog({
      title: "¿Estás seguro?",
      description: "Esta acción no se puede deshacer.",
      onConfirm: () => {
        setTasks(tasks.filter((task) => task.id !== taskId))
      },
    })
  }
  const toggleTaskCompletion = (taskId) => {
    AlertDialog({
      title: "¿Marcar como completa?",
      description: "Esta tarea se marcará como completada.",
      onConfirm: () => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
      },
    })
  }
  const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="bg-primary text-primary-foreground py-4 px-6">
          <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Agregar Tarea</h2>
            <div className="flex items-center gap-2">
              <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Escribe una nueva tarea"
                  className="flex-1"
              />
              <Input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="flex-1"
              />
              <Button onClick={addTask}>Agregar</Button>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Tareas</h2>
            <ul className="space-y-2">
              {sortedTasks.map((task) => (
                  <li
                      key={task.id}
                      className={`flex items-center justify-between bg-card p-4 rounded-md shadow-sm ${
                          task.completed ? "opacity-50 line-through text-muted-foreground" : ""
                      } ${new Date(task.dueDate) < new Date() ? "bg-red-500 text-red-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskCompletion(task.id)} />
                      {editingTaskId === task.id ? (
                          <>
                            <Input
                                value={editedTaskTitle}
                                onChange={(e) => setEditedTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateTask()
                                  }
                                }}
                            />
                            <Input
                                type="date"
                                value={editedTaskDueDate}
                                onChange={(e) => setEditedTaskDueDate(e.target.value)}
                            />
                          </>
                      ) : (
                          <>
                            <span>{task.title}</span>
                            <span
                                className={`text-sm ${
                                    new Date(task.dueDate) < new Date() ? "text-red-50" : "text-muted-foreground"
                                }`}
                            >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                          </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingTaskId === task.id ? (
                          <>
                            <Button variant="outline" onClick={updateTask}>
                              Guardar
                            </Button>
                            <Button variant="outline" onClick={() => setEditingTaskId(null)}>
                              Cancelar
                            </Button>
                          </>
                      ) : (
                          <>
                            <Button variant="outline" onClick={() => editTask(task.id)}>
                              Editar
                            </Button>
                            <Button variant="outline" onClick={() => deleteTask(task.id)}>
                              Eliminar
                            </Button>
                          </>
                      )}
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
  )
}