package routes

import (
	"task/handlers"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/main-tasks", handlers.GetMainTasks)
	api.Post("/main-tasks", handlers.CreateMainTask)
	api.Get("/main-tasks/:id", handlers.GetMainTaskByID)
	api.Put("/main-tasks/:id", handlers.UpdateMainTask)
	api.Delete("/main-tasks/:id", handlers.DeleteMainTask)

	api.Get("/main-tasks/:mainTaskId/subtasks", handlers.GetSubtasksByMainTask)
	api.Post("/main-tasks/:mainTaskId/subtasks", handlers.CreateSubtask)
	api.Put("/subtasks/:id", handlers.UpdateSubtask)
	api.Delete("/subtasks/:id", handlers.DeleteSubtask)
}
