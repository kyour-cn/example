package controller

import (
	"fmt"
	"gorm.io/gen/field"
	"gourd/internal/app"
	"gourd/internal/orm/model"
	"gourd/internal/orm/query"
	"gourd/internal/tools"
	"net/http"
)

// UserController 用户控制器
type UserController struct {
	app.BaseController //继承基础控制器
}

// Token 获取token
func (ctl *UserController) Token(w http.ResponseWriter, _ *http.Request) {

	token := tools.RandStringRunes(16)

	// 响应结果
	_ = ctl.Success(w, "", token)
}

// Info 获取用户信息
func (ctl *UserController) Info(w http.ResponseWriter, _ *http.Request) {

	qu := query.User
	// 需要查询的字段
	fields := []field.Expr{
		qu.ID,
		qu.Username,
	}

	user, err := qu.
		Where(qu.ID.Eq(1)).
		Select(fields...).
		First()
	if err != nil {
		fmt.Println("查询失败：" + err.Error())
	}

	// 响应结果
	_ = ctl.Success(w, "", user)
}

// Add 创建用户
func (ctl *UserController) Add(w http.ResponseWriter, _ *http.Request) {

	user := model.User{
		Username: "go_create",
	}

	err := query.User.Create(&user)
	if err != nil {
		fmt.Println("添加失败：" + err.Error())
	}

	// 响应结果
	_ = ctl.Success(w, "", user)
}
