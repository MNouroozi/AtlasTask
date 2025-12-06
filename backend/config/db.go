package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"task/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/joho/godotenv"
)

var DB *gorm.DB

func ConnectDB() {
	fmt.Println("Connecting to PostgreSQL...")

	godotenv.Load(".env")

	// استفاده از نام کانتینر دیتابیس
	host := getEnv("DB_HOST", "localhost") // تغییر به atlastask-db
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "admin")
	password := getEnv("DB_PASSWORD", "Admin123@")
	dbname := getEnv("DB_NAME", "task")
	sslmode := getEnv("DB_SSL_MODE", "disable")
	//dsn := "host=localhost user=admin password=Admin123@ dbname=task port=5432 sslmode=disable TimeZone=Asia/Tehran"
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Tehran",
		host, user, password, dbname, port, sslmode)

	fmt.Printf("Connecting to: %s@%s:%s/%s\n", user, host, port, dbname)

	// اضافه کردن retry logic
	var database *gorm.DB
	var err error
	maxRetries := 1

	for i := 0; i < maxRetries; i++ {
		database, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf("Attempt %d/%d: Failed to connect to database: %v", i+1, maxRetries, err)
			if i < maxRetries-1 {
				log.Printf("Retrying in 3 seconds...")
				time.Sleep(3 * time.Second)
			}
			continue
		}
		break
	}

	if err != nil {
		log.Fatalf("Failed to connect to database after %d attempts: %v", maxRetries, err)
	}

	DB = database
	fmt.Println("Database connection established")

	err = DB.AutoMigrate(&models.MainTask{}, &models.Subtask{})
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	fmt.Println("Migrations completed")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
