# ヴィーガン向け体調管理アプリ

## 設計

### テーブル図

```mermaid
classDiagram
    User -- DailyMealsTable : 1 - n (ユーザーは多数の食事記録を持つ)
    User -- Dishes : 1 - n (ユーザーは多数の料理を持つ)
    Ingredients -- Dishes : 1 - n (1つの原材料は多数の料理に使われる)
    DailyMealsTable -- Dishes : 1 - n (1つの食事記録は多数の料理から成る)

    class User {
        +userId (PK)
        password
        age
        sex
        height
　　　　　　　　　　　　　　　　weight
        dailyNutrientGoals
    }

    class Dishes {
        +dishName (PK)
        +userId (SK)
        ingredients
        nutrients
    }

    class DailyMealsTable {
        +userId (PK)
        +date (SK)
        mealType
        dishes
        totalNutrients
    }

    class Ingredients {
        +ingredientName (PK)
        nutrients
    }

```
---

#### Userテーブル
dailyNutirientsGoalsはバックエンド側で計算して返す.

| カラム名  | 説明       |
|---------|-----------|
| userId  | ユーザーID (パーティションキー) |
| password | パスワード   |
| age     | 年齢       |
| sex | 性別 |
| height     | 身長 |
| weight     | 体重 |
| dailyNutrientGoals | 1日に取るべき栄養素の目標値(map) 例:{"protein":300, "dhc":100} |

---
#### nutrients(テーブルではない)
マップ形式で返される各栄養素の名前.

| 栄養素名 | 単位 |
|---|---|
| protein | g |
| vitamineD | μg |
| vitamineD12 | μg |
| iron | mg |
| dha | g |
| epa | g |
| calcium | mg |
| zinc | mg |

---

#### Dishesテーブル
ユーザーが入力orデフォルトである料理を保存. ユーザーが新たな料理を追加したりすることが可能. 

| カラム名       | 説明                                               |
|--------------|--------------------------------------------------|
| dishName       | 料理の名前 (パーティションキー)                               |
| userId       | ユーザーID (ソートキー)                                   |
| ingredients  | 原材料をマップ形式で重量と保存. [{"name": "tomato", "weight":100}, ]                          |
| nutrients    | 原材料から計算された栄養成分情報 {"vitamine":100, "protein": 200}                             |

---

#### DailyMealsTable
各ユーザーがその日に何を食べたのか、そしてその日の合計栄養摂取量を保存

| カラム名     | 説明                               |
|------------|----------------------------------|
| userId     | ユーザーのID (パーティションキー)          |
| date   | 食事の日 (ソートキー)                  |
| mealType   | 朝食、昼食、夕食など                        |
| dishes     | 選択された料理のリスト(料理IDや名前、量など) |
| totalNutrients| その日の全ての栄養素の合計                      |

---

#### Ingredientsテーブル
原材料の栄養を保存. dishesの料理の栄養計算に利用される. 

| カラム名        | 説明                               |
|---------------|----------------------------------|
| ingredientName| 原材料の名前(パーティションキー)                 　|
| nutrients     | 原材料の栄養成分情報                          |

---


### Web REST API 設計

### DishesテーブルのAPI

| 操作   | Method | 処理の内容 | Endpoint           | リクエストパラメータ                            | レスポンス内容                  |
|--------|----|----|--------------------|-----------------------------------------------|------------------------------|
| 登録   | POST   | 新しい料理を追加. | `/dishes`          | userId, dishName, ingredients                 | success/error, dishName        |
| 取得   | GET    | ユーザーがすでに登録した料理の一覧を表示. | `/dishes？userId` | userId                                             | List<dishName> |
| 削除   | DELETE | ユーザーがすでに登録した料理を削除. | `/dishes?dishName&userId` | dishName, userId                                             | success/error                  |

### DailyMealsTableのAPI

| 操作   | Method | 処理の内容 | Endpoint                      | リクエストパラメータ               | レスポンス内容              |
|--------|-------|--|-------------------------------|----------------------------------|--------------------------|
| 登録   | POST   |  朝・昼・夜の食事を料理から選択し投稿. | `/daily-meals`                | UserId, Date, MealType, Dishes   | success/error, TotalNutrients |
| 変更   | PUT   |  一度,保存した食事内容を変更. | `/daily-meals`                | UserId, Date, MealType, Dishes   | success/error, TotalNutrients |
| 取得   | GET   |  その日の合計栄養値を取得. | `/daily-meals?userId&date`                | userId, date  | success/error, TotalNutrients |

### IngredientsTableのAPI

| 操作   | Method | 処理の内容 | Endpoint                      | リクエストパラメータ               | レスポンス内容              |
|--------|------|--|-------------------------------|----------------------------------|--------------------------|
| 登録   | GET   | 料理新規追加時に一覧を表示 |  `/ingredients`                |   | success/error, list<ingredientName> |


## API動作例
### User関連
#### POST `/user/signup`
```
//リクエスト
{
    "userId": "nick",
    "password": "password",
    "sex": "male",
    "age": 66,
    "height": 180,
    "weight": 70
}
```
```
// response
{
    "userId": "nick",
    "sex": "male",
    "age": 66,
    "height": 180,
    "dailyNutrientGoals": {
        "protein": 84,
        "vitaminD": 8.5,
        "vitaminB12": 2.4,
        "iron": 8,
        "dha": 11,
        "epa": 2,
        "calcium": 800,
        "zinc": 11
    },
    "token": "mtiToken"
}
```

#### GET `/user`
```
// GET /user?userId ユーザーIDを指定してユーザー情報を取得.
{
    "userId": "nick",
    "height": 180,
    "sex": "male",
    "weight": 70,
    "age": 66,
    "dailyNutrientGoals": {
        "calcium": 800,
        "protein": 84,
        "vitaminD": 8.5,
        "epa": 2,
        "iron": 8,
        "vitaminB12": 2.4,
        "dha": 11,
        "zinc": 11
    },
}
```
----

### dishes関連
#### POST `/dishes`
```
// リクエストボディ
{
    "dishName": "チキントマト",
    "userId": "team3",
    "ingredients": [
        { "name":"tomato", "weight":100 },
        { "name":"chicken", "weight":100 }
    ]
}
```
```
// レスポンスボディ
{
    "dishName": "チキントマト",
    "userId": "team3",
    "ingredients": [
        { "name": "tomato", "weight": 100},
        { "name": "chicken", "weight": 100}
    ],
    "nutrients": {
        "vitamineD": 12,
        "calcium": 60,
        "protein": 10,
        "epa": 1,
        "iron": 13,
        "dha": 1,
        "vitamineD12": 25,
        "zinc": 20
    }
}
```

#### GET `/dishes`
```
// /dishes?userId=team3
// レスポンスはdishNameがリストになって返ってくる.
{
    "dishes": [
        "塩オニオン",
        "オニオンサラダ"
    ]
}
```
----
### ingredients関連
#### GET `/ingredients`
```
// ingredientsのName一覧がリストで返ってくる
{
    "ingredients": [
        "onion",
        "chicken",
        "lettuce",
        "salt",
        "tomato"
    ]
}
```

