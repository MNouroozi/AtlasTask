package handlers

import (
	"task/config"
	"task/models"

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

	var input models.MainTask
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	task.Title = input.Title
	task.Description = input.Description
	task.LetterNumber = input.LetterNumber
	task.LetterDate = input.LetterDate
	task.DueDate = input.DueDate
	task.Done = input.Done

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
