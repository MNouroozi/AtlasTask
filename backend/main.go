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

	app := fiber.New()
	fmt.Println("🚀 [SERVER] Fiber initialized successfully!")

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	routes.RegisterRoutes(app)
	fmt.Println("✅ [ROUTES] Routes registered successfully!")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("AtlasTask backend is healthy ✅")
	})

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("❌ [SERVER ERROR] Unable to start: %v", err)
	}

	fmt.Println("✅ [START] AtlasTask backend running on :8080")
}
