// فایل: C:\Users\pc-iran\SpanBox\AtlasTask\backend\routes\routes.go
// توضیح فارسی: ثبت مسیرهای اصلی REST API مستقیماً با هندلرهای داخلی بدون پوشه controllers

package routes

import (
	"github.com/gofiber/fiber/v2"
	"task/config"
	"task/models"
)

// RegisterRoutes ثبت مسیرهای API AtlasTask
func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")

	// 📗 لیست وظایف
	api.Get("/main-tasks", func(c *fiber.Ctx) error {
		var tasks []models.MainTask
		result := config.DB.Preload("Subtasks").Find(&tasks)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
		}
		return c.JSON(tasks)
	})

	// 🧾 ساخت وظیفه جدید
	api.Post("/main-tasks", func(c *fiber.Ctx) error {
		var task models.MainTask
		if err := c.BodyParser(&task); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
		}
		if err := config.DB.Create(&task).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(task)
	})

	// ✏️ ویرایش وظیفه
	api.Put("/main-tasks/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var task models.MainTask
		if err := config.DB.First(&task, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "task not found"})
		}
		if err := c.BodyParser(&task); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
		}
		config.DB.Save(&task)
		return c.JSON(task)
	})

	// 🗑 حذف وظیفه
	api.Delete("/main-tasks/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := config.DB.Delete(&models.MainTask{}, id).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.SendStatus(204)
	})

	// ✅ زیر‌وظایف (Subtasks)
	api.Get("/subtasks/:task_id", func(c *fiber.Ctx) error {
		taskID := c.Params("task_id")
		var subtasks []models.Subtask
		if err := config.DB.Where("main_task_id = ?", taskID).Find(&subtasks).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(subtasks)
	})

	api.Post("/subtasks", func(c *fiber.Ctx) error {
		var subtask models.Subtask
		if err := c.BodyParser(&subtask); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
		}
		if err := config.DB.Create(&subtask).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(subtask)
	})

	api.Put("/subtasks/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var subtask models.Subtask
		if err := config.DB.First(&subtask, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "subtask not found"})
		}
		if err := c.BodyParser(&subtask); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
		}
		config.DB.Save(&subtask)
		return c.JSON(subtask)
	})

	api.Delete("/subtasks/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := config.DB.Delete(&models.Subtask{}, id).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.SendStatus(204)
	})
}
