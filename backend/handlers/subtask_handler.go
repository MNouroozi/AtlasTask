package handlers

import (
	"github.com/gofiber/fiber/v2"
	"strconv"
	"task/config"
	"task/models"
)

func CreateSubtask(c *fiber.Ctx) error {
	mainTaskIDStr := c.Params("mainTaskId")
	mainTaskID, err := strconv.ParseUint(mainTaskIDStr, 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid mainTaskId"})
	}

	var subtask models.Subtask
	if err := c.BodyParser(&subtask); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON body"})
	}

	subtask.MainTaskID = uint(mainTaskID)

	if err := config.DB.Create(&subtask).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(subtask)
}

func GetSubtasksByMainTask(c *fiber.Ctx) error {
	mainTaskIDStr := c.Params("mainTaskId")
	mainTaskID, err := strconv.ParseUint(mainTaskIDStr, 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid mainTaskId"})
	}

	var subtasks []models.Subtask
	if err := config.DB.Where("main_task_id = ?", uint(mainTaskID)).Find(&subtasks).Order("created_at DESC").Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(subtasks)
}

func UpdateSubtask(c *fiber.Ctx) error {
	id := c.Params("id")
	var subtask models.Subtask
	if err := config.DB.First(&subtask, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Subtask not found"})
	}

	if err := c.BodyParser(&subtask); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
	}

	config.DB.Save(&subtask)
	return c.JSON(subtask)
}

func DeleteSubtask(c *fiber.Ctx) error {
	id := c.Params("id")
	var subtask models.Subtask
	if err := config.DB.First(&subtask, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Subtask not found"})
	}

	config.DB.Delete(&subtask)
	return c.JSON(fiber.Map{"message": "Subtask deleted successfully"})
}
