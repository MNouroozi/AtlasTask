// توضیح فارسی: هندلر اصلی برای عملیات CRUD مدل MainTask در بک‌اند AtlasTask
package handlers

import (
	"log"

	"task/config"
	"task/models"

	"github.com/gofiber/fiber/v2"
)

func CreateMainTask(c *fiber.Ctx) error {
	var task models.MainTask
	if err := c.BodyParser(&task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if err := config.DB.Create(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create main task"})
	}

	log.Println("🟢 [POST] MainTask created:", task.Title)
	return c.Status(201).JSON(task)
}

func GetMainTasks(c *fiber.Ctx) error {
	var tasks []models.MainTask
	if err := config.DB.Preload("Subtasks").Find(&tasks).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch main tasks"})
	}

	log.Println("🟡 [GET] MainTasks fetched:", len(tasks))
	return c.Status(200).JSON(tasks)
}

func GetMainTaskByID(c *fiber.Ctx) error {
	id := c.Params("id")

	var task models.MainTask
	if err := config.DB.Preload("Subtasks").First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "MainTask not found"})
	}

	log.Println("🟡 [GET] MainTask fetched:", id)
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
	task.DueDate = input.DueDate
	task.Done = input.Done

	if err := config.DB.Save(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update MainTask record"})
	}

	if err := config.DB.Preload("Subtasks").First(&task, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to reload updated MainTask with subtasks"})
	}

	log.Printf("✅ [PUT] MainTask id=%s updated successfully\n", id)
	return c.Status(200).JSON(task)
}

func DeleteMainTask(c *fiber.Ctx) error {
	id := c.Params("id")

	var task models.MainTask
	if err := config.DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "MainTask not found"})
	}

	if err := config.DB.Delete(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to delete MainTask"})
	}

	log.Printf("🔴 [DELETE] MainTask id=%s deleted successfully\n", id)
	return c.Status(200).JSON(fiber.Map{
		"message": "MainTask deleted successfully ✅",
	})
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
