package handlers

import (
	"os/exec"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
)

func BackupDatabase(c *fiber.Ctx) error {
	// مسیر فایل backup
	backupPath := filepath.Join(".", "backups", "backup.sql")

	// اجرای pg_dump
	cmd := exec.Command("pg_dump",
		"-h", "localhost",
		"-U", "admin",
		"-d", "task",
		"-f", backupPath,
	)

	cmd.Env = append(cmd.Env, "PGPASSWORD=Admin123@")

	output, err := cmd.CombinedOutput()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to backup database",
			"details": string(output),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Backup created successfully",
		"path":    backupPath,
	})
}
