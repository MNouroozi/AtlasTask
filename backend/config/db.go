// توضیح فارسی: فایل اتصال به دیتابیس PostgreSQL و اجرای AutoMigrate برای جداول AtlasTask
package config

import (
	"fmt"
	"log"
	"os"

	"task/models" // ایمپورت مدل‌های پروژه

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// متغیر جهانی برای دسترسی از سایر بخش‌ها
var DB *gorm.DB

// اتصال و مهاجرت دیتابیس
func ConnectDB() {
	fmt.Println("🛠️ [DB] Connecting to PostgreSQL...")

	// ✳ خواندن رشته اتصال از متغیر محیطی یا فالو‌بک پیش‌فرض
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=localhost user=admin password=Admin123@ dbname=task port=5432 sslmode=disable TimeZone=Asia/Tehran"
	}

	// اتصال با GORM
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ [DB ERROR] Failed to connect: %v", err)
	}

	DB = database
	fmt.Println("✅ [DB] Connection established successfully.")

	// ✨ اجرای AutoMigrate بدون حذف داده‌ها
	err = DB.AutoMigrate(
		&models.MainTask{},
		&models.Subtask{},
	)
	if err != nil {
		log.Fatalf("❌ [DB ERROR] AutoMigrate failed: %v", err)
	}

	fmt.Println("✅ [DB] AutoMigrate completed (MainTask, Subtask).")
}
