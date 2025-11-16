package main

import (
	"fmt"
	"log"

	"task/config"
	"task/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	fmt.Println("⚙️ [INIT] Starting AtlasTask backend...")

	//  اتصال به دیتابیس
	config.ConnectDB()
	fmt.Println("🛠️ [DB] Connecting to PostgreSQL...")
	fmt.Println("✅ [DB] Connection established successfully.")
	fmt.Println("✅ [DB] AutoMigrate completed (MainTask, Subtask).")

	//  راه‌اندازی Fiber
	app := fiber.New()
	fmt.Println("🚀 [SERVER] Fiber initialized successfully!")

	// ✅ تنظیم امن CORS برای فرانت‌اند در localhost:3000
	//  حذف wildcard (*) به نفع Origin واقعی برای رفع panic
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",       // دامنه فرانت‌اند (Next.js)
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS", // متدهای مجاز
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,                          // مجاز چون Origin محدود است
	}))

	//  ثبت مسیرهای API
	routes.RegisterRoutes(app)
	fmt.Println("✅ [ROUTES] Routes registered successfully!")

	//  مسیری برای تست سلامت سرور
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("AtlasTask backend is healthy ✅")
	})

	//  اجرای سرور روی پورت 8080
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("❌ [SERVER ERROR] Unable to start: %v", err)
	}

	fmt.Println("✅ [START] AtlasTask backend running on :8080")
}
