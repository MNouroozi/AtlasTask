package handlers

import (
	"task/config"
	"task/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateMainTask(c *fiber.Ctx) error {
	var task models.MainTask
	if err := c.BodyParser(&task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
	}

	if err := config.DB.Create(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(task)
}

func GetMainTasks(c *fiber.Ctx) error {
	var tasks []models.MainTask
	if err := config.DB.Preload("Subtasks").Find(&tasks).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(200).JSON(tasks)
}

func GetMainTaskByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var task models.MainTask
	if err := config.DB.Preload("Subtasks").First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "MainTask not found"})
	}

	return c.Status(200).JSON(task)
}

func UpdateMainTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task models.MainTask
	if err := config.DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "MainTask not found"})
	}

	var input map[string]interface{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if title, exists := input["title"]; exists {
		task.Title = title.(string)
	}
	if description, exists := input["description"]; exists {
		task.Description = description.(string)
	}
	if letterNumber, exists := input["letter_number"]; exists {
		task.LetterNumber = letterNumber.(string)
	}
	if letterDate, exists := input["letter_date"]; exists {
		if letterDate == nil {
			task.LetterDate = nil
		} else {
			dateStr := letterDate.(string)
			if dateStr != "" {
				parsedTime, err := time.Parse(time.RFC3339, dateStr)
				if err != nil {
					return c.Status(400).JSON(fiber.Map{"error": "Invalid letter_date format"})
				}
				task.LetterDate = &parsedTime
			} else {
				task.LetterDate = nil
			}
		}
	}
	if dueDate, exists := input["due_date"]; exists {
		if dueDate == nil {
			task.DueDate = nil
		} else {
			dateStr := dueDate.(string)
			if dateStr != "" {
				parsedTime, err := time.Parse(time.RFC3339, dateStr)
				if err != nil {
					return c.Status(400).JSON(fiber.Map{"error": "Invalid due_date format"})
				}
				task.DueDate = &parsedTime
			} else {
				task.DueDate = nil
			}
		}
	}
	if done, exists := input["done"]; exists {
		task.Done = done.(bool)
	}

	if status, exists := input["status"]; exists {
		task.Status = models.TaskStatus(status.(string))
	}

	if err := config.DB.Save(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	if err := config.DB.Preload("Subtasks").First(&task, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to reload task"})
	}

	return c.Status(200).JSON(task)
}

func DeleteMainTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task models.MainTask
	if err := config.DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "MainTask not found"})
	}

	if err := config.DB.Delete(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "MainTask deleted successfully"})
}

func GetMainTasksByPending(c *fiber.Ctx) error {
	var pendingTasks []models.MainTask
	var count int64

	result := config.DB.Preload("Subtasks").Where("done = ?", false).Find(&pendingTasks).Count(&count)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "خطا در دریافت داده‌ها",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"pending_tasks_count": count,
		"pending_tasks":       pendingTasks,
		"message":             "تسک‌های در انتظار با موفقیت دریافت شدند ✅",
	})
}
