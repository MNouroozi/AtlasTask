package routes

import (
	"task/handlers"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")

	mainTasks := api.Group("/main-tasks")
	{
		mainTasks.Get("/", handlers.GetMainTasks)
		mainTasks.Post("/", handlers.CreateMainTask)
		mainTasks.Get("/pending", handlers.GetMainTasksByPending)
		mainTasks.Get("/:id", handlers.GetMainTaskByID)
		mainTasks.Put("/:id", handlers.UpdateMainTask)
		mainTasks.Delete("/:id", handlers.DeleteMainTask)
	}

	api.Get("/main-tasks/:mainTaskId/subtasks", handlers.GetSubtasksByMainTask)
	api.Post("/main-tasks/:mainTaskId/subtasks", handlers.CreateSubtask)
	api.Put("/subtasks/:id", handlers.UpdateSubtask)
	api.Delete("/subtasks/:id", handlers.DeleteSubtask)
}
