// توضیح فارسی: مدل زیر‌وظایف (Subtask) وابسته به وظیفه اصلی
package models

import "time"

type Subtask struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	MainTaskID uint     `json:"main_task_id"` // کلید ارتباط با وظیفه اصلی
	Title     string    `json:"title"`
	Done      bool      `json:"done"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
