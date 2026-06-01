# API Routes Status

เอกสารนี้สรุป API route ที่ backend มีอยู่แล้ว, route ที่เขียนไว้บางส่วนแต่ยังใช้งานจริงไม่ได้/ยังไม่สมบูรณ์, และ route ที่ควรทำเพิ่มสำหรับโปรเจกต์แนว music marketplace ที่มี user, artist, product, track, wishlist, collection และ admin

Base URL ตอน dev น่าจะเป็น:

```txt
http://localhost:<PORT>
```

ตอนนี้ route ส่วนใหญ่ถูก mount ที่ root path `/` โดยตรงจาก `src/server.js`

## สรุปภาพรวม

| หมวด | สถานะ | รายละเอียด |
|---|---|---|
| Auth | ทำแล้ว | register, login, logout, check current user |
| User/Profile | ทำแล้ว | ดู profile, แก้ profile |
| Social | ทำแล้ว | follow/unfollow artist |
| Wishlist | ทำแล้ว | add/remove product ใน wishlist |
| Tracks | ทำแล้วบางส่วน | artist/admin upload track ได้ |
| Products | มีโค้ดแต่ยังไม่พร้อมใช้งานจริง | route file มีอยู่ แต่ยังไม่ได้ mount ใน `server.js` และ list route ขาด `/` |
| Admin | ทำแล้วบางส่วน | admin ดู user ทั้งหมดได้ |
| Orders/Checkout/Payment | ยังไม่มี | ควรมีสำหรับซื้อเพลง/album/merch |
| Artist/Public Profile | ยังไม่มี | ควรมีสำหรับหน้า artist และหน้าร้าน |

## Routes ที่ทำไว้แล้ว

### Auth

| Method | Path | Auth | Controller | ใช้ทำอะไร |
|---|---|---|---|---|
| POST | `/register` | ไม่ต้อง login | `register` | สมัครสมาชิกใหม่ |
| POST | `/login` | ไม่ต้อง login | `login` | login ด้วย email/password แล้ว set cookie `accessToken` |
| POST | `/logout` | ไม่บังคับผ่าน middleware | `logout` | ล้าง cookie `accessToken` |
| GET | `/auth/me` | ต้อง login | `checkUserState` | เช็คว่า user ที่ login อยู่คือใคร |

หมายเหตุ:

- Auth ใช้ JWT เก็บใน HTTP-only cookie ชื่อ `accessToken`
- Token หมดอายุใน 1 ชั่วโมง
- Payload ใน token มี `user_Id` และ `role`

### User/Profile

| Method | Path | Auth | Controller | ใช้ทำอะไร |
|---|---|---|---|---|
| GET | `/profile` | ต้อง login | `getUserProfile` | ดู profile ของ user ที่ login อยู่ |
| PUT | `/profile` | ต้อง login | `updateUserProfile` | แก้ `display_name`, `profile_picture`, `bio` |

ข้อมูล profile ที่ model รองรับ:

- `username`
- `email`
- `role`: `user`, `artist`, `admin`
- `display_name`
- `profile_picture`
- `bio`
- `collection`
- `followingArtist`
- `wishlist`

### Artist Follow

| Method | Path | Auth | Controller | ใช้ทำอะไร |
|---|---|---|---|---|
| PATCH | `/artists/:artistId/follow` | ต้อง login | `toggleFollowArtist` | follow/unfollow artist |

Behavior:

- ถ้ายังไม่ได้ follow จะเพิ่ม artist เข้า `followingArtist`
- ถ้า follow อยู่แล้วจะ remove ออก
- follow ตัวเองไม่ได้
- follow ได้เฉพาะ user ที่มี role เป็น `artist`

### Wishlist

| Method | Path | Auth | Controller | ใช้ทำอะไร |
|---|---|---|---|---|
| PATCH | `/products/:productId/wishlist` | ต้อง login | `toggleWishlist` | add/remove product ใน wishlist |

Behavior:

- ถ้ายังไม่มี product ใน wishlist จะเพิ่ม
- ถ้ามีอยู่แล้วจะเอาออก
- เช็คก่อนว่า product มีจริง

### Tracks

| Method | Path | Auth | Role | Controller | ใช้ทำอะไร |
|---|---|---|---|---|---|
| POST | `/tracks` | ต้อง login | `artist` หรือ `admin` | `createTrack` | upload audio track ไป Cloudinary แล้วสร้าง track ใน DB |

Body/Form data:

- `audio`: audio file, ส่งผ่าน multipart/form-data
- `title`: required
- `durationSec`: required, number, ต้องมากกว่า 0
- `previewStartSec`: optional
- `previewDurationSec`: optional

ข้อมูล track ที่ model รองรับ:

- `artist`
- `title`
- `durationSec`
- `audioUrl`
- `previewStartSec`
- `previewDurationSec`
- `isStreamable`

### Admin

| Method | Path | Auth | Role | Controller | ใช้ทำอะไร |
|---|---|---|---|---|---|
| GET | `/admin/getUserInfo` | ต้อง login | `admin` | `getAllUsers` | ดึง user ทั้งหมด |

## Routes ที่มีโค้ดแล้ว แต่ยังไม่พร้อมใช้งานจริง

### Products

มีไฟล์ `src/routes/products.routes.js` และ `src/controllers/product.controller.js` แล้ว แต่ตอนนี้ยังมีปัญหาที่ต้องแก้ก่อน:

1. `src/server.js` ยังไม่ได้ import/use `productRouter`
2. route list product เขียนเป็น `router.get('products', ...)` ขาด `/` ควรเป็น `router.get('/products', ...)`
3. `createProduct` ใน controller มีแล้ว แต่ route `POST /products` ยังถูก comment อยู่
4. `createProduct` ใช้ตัวแปร `status` แต่ไม่ได้ destructure/ประกาศจาก body
5. `createProduct` รับ `releasedDate` แต่ schema ใช้ `releaseDate`

ถ้าแก้แล้ว product routes ที่ควรเปิดใช้คือ:

| Method | Path | Auth | Role | Controller | สถานะ |
|---|---|---|---|---|---|
| GET | `/products` | ไม่ต้อง login | ทุกคน | `getAllProductInfo` | มี controller แล้ว แต่ route ยังผิดและยังไม่ mount |
| GET | `/products/:productId` | ไม่ต้อง login | ทุกคน | `getProductById` | มี controller แล้ว แต่ router ยังไม่ mount |
| POST | `/products` | ต้อง login | `artist` หรือ `admin` | `createProduct` | มี controller บางส่วน แต่ route ยังปิดไว้ |

Product model รองรับ:

- `artist`
- `type`: `single`, `album`, `merch`
- `title`
- `slug`
- `tracks`
- `description`
- `price`
- `minPrice`
- `stock`
- `coverUrl`
- `nameYourPrice`
- `status`: `draft`, `published`, `archived`
- `releaseDate`
- `deletedAt`

## Routes ที่ควรทำเพิ่ม

ส่วนนี้เป็นข้อเสนอจากภาพรวมระบบ ถ้าแบ่งงานในทีมสามารถหยิบไปทำเป็น issue ได้เลย

### Public Browse/Search

| Method | Path | Auth | ใช้ทำอะไร | Priority |
|---|---|---|---|---|
| GET | `/products` | ไม่ต้อง login | list สินค้าทั้งหมด พร้อม filter/search/sort | สูง |
| GET | `/products/:productId` | ไม่ต้อง login | ดูรายละเอียดสินค้า | สูง |
| GET | `/artists` | ไม่ต้อง login | list artist ทั้งหมด | กลาง |
| GET | `/artists/:artistId` | ไม่ต้อง login | ดู public profile ของ artist | สูง |
| GET | `/artists/:artistId/products` | ไม่ต้อง login | ดูสินค้าทั้งหมดของ artist | สูง |
| GET | `/artists/:artistId/tracks` | ไม่ต้อง login | ดู tracks ของ artist | กลาง |

Query ที่ควรรองรับใน `/products`:

- `q`: search ด้วยชื่อสินค้า/คำอธิบาย
- `type`: `single`, `album`, `merch`
- `artistId`
- `minPrice`
- `maxPrice`
- `sort`: `newest`, `price_asc`, `price_desc`
- `page`
- `limit`

### Product Management สำหรับ Artist/Admin

| Method | Path | Auth | Role | ใช้ทำอะไร | Priority |
|---|---|---|---|---|---|
| POST | `/products` | ต้อง login | `artist`, `admin` | สร้าง product | สูง |
| PUT | `/products/:productId` | ต้อง login | เจ้าของ product หรือ `admin` | แก้ product | สูง |
| PATCH | `/products/:productId/status` | ต้อง login | เจ้าของ product หรือ `admin` | เปลี่ยนสถานะ draft/published/archived | กลาง |
| DELETE | `/products/:productId` | ต้อง login | เจ้าของ product หรือ `admin` | soft delete product โดย set `deletedAt` | กลาง |
| POST | `/products/:productId/tracks` | ต้อง login | เจ้าของ product หรือ `admin` | ผูก track เข้า album/single | สูง |
| DELETE | `/products/:productId/tracks/:trackId` | ต้อง login | เจ้าของ product หรือ `admin` | เอา track ออกจาก product | กลาง |

### Track Management

| Method | Path | Auth | Role | ใช้ทำอะไร | Priority |
|---|---|---|---|---|---|
| GET | `/tracks/:trackId` | ไม่ต้อง login หรือ login ตาม policy | ดูข้อมูล track | กลาง |
| GET | `/tracks/:trackId/stream` | อาจต้อง login/ซื้อแล้ว | stream เพลงเต็ม | สูง |
| GET | `/tracks/:trackId/preview` | ไม่ต้อง login | stream preview | สูง |
| PUT | `/tracks/:trackId` | ต้อง login | เจ้าของ track หรือ `admin` | แก้ metadata track | กลาง |
| DELETE | `/tracks/:trackId` | ต้อง login | เจ้าของ track หรือ `admin` | ลบ/ปิด track | กลาง |

หมายเหตุ:

- ตอนนี้ `POST /tracks` upload ไฟล์ได้แล้ว
- ควรแยก policy ระหว่าง preview กับ full stream ให้ชัด เช่น preview เปิดสาธารณะ แต่ full stream ต้องซื้อแล้วหรือเป็นเจ้าของ

### Cart/Checkout/Order

ถ้าโปรเจกต์มีการซื้อสินค้า ควรมี order flow แยกจาก wishlist/collection

| Method | Path | Auth | ใช้ทำอะไร | Priority |
|---|---|---|---|---|
| POST | `/orders` | ต้อง login | สร้าง order จาก product ที่ user เลือก | สูง |
| GET | `/orders` | ต้อง login | ดู order history ของตัวเอง | สูง |
| GET | `/orders/:orderId` | ต้อง login | ดูรายละเอียด order | สูง |
| POST | `/orders/:orderId/pay` | ต้อง login | เริ่มจ่ายเงิน หรือ mock payment | สูง |
| POST | `/orders/:orderId/confirm` | ต้อง login/admin/system | confirm payment แล้วเพิ่มสินค้าเข้า collection | สูง |

หลังจ่ายเงินสำเร็จควร:

- เพิ่ม product เข้า `user.collection`
- ลด `stock` ถ้าเป็น merch
- เก็บ `purchasedAt`
- เก็บราคา ณ ตอนซื้อ เพราะราคา product อาจเปลี่ยนภายหลัง

### Collection/Library

| Method | Path | Auth | ใช้ทำอะไร | Priority |
|---|---|---|---|---|
| GET | `/collection` | ต้อง login | ดูสินค้าที่ซื้อแล้ว | สูง |
| GET | `/collection/:productId` | ต้อง login | ดูรายละเอียดสินค้าที่ซื้อแล้ว | กลาง |
| GET | `/collection/:productId/download` | ต้อง login | download เพลง/ไฟล์หลังซื้อ | กลาง |

### Wishlist

ตอนนี้มี toggle แล้ว แต่ควรเพิ่ม route ดูรายการ wishlist โดยตรง

| Method | Path | Auth | ใช้ทำอะไร | Priority |
|---|---|---|---|---|
| GET | `/wishlist` | ต้อง login | ดู wishlist ของตัวเอง | สูง |
| DELETE | `/wishlist/:productId` | ต้อง login | remove แบบ explicit | ต่ำ |

### User Settings

| Method | Path | Auth | ใช้ทำอะไร | Priority |
|---|---|---|---|---|
| PATCH | `/profile/password` | ต้อง login | เปลี่ยน password | กลาง |
| PATCH | `/profile/email` | ต้อง login | เปลี่ยน email | กลาง |
| DELETE | `/profile` | ต้อง login | deactivate/delete account | ต่ำ |

### Admin เพิ่มเติม

| Method | Path | Auth | Role | ใช้ทำอะไร | Priority |
|---|---|---|---|---|---|
| GET | `/admin/users` | ต้อง login | `admin` | list user ทั้งหมด | กลาง |
| GET | `/admin/products` | ต้อง login | `admin` | list product ทั้งหมด รวม draft/archived/deleted | กลาง |
| PATCH | `/admin/users/:userId/role` | ต้อง login | `admin` | เปลี่ยน role user/artist/admin | สูง ถ้าต้องมี artist approval |
| PATCH | `/admin/products/:productId/status` | ต้อง login | `admin` | approve/hide/archive product | กลาง |
| GET | `/admin/orders` | ต้อง login | `admin` | ดู order ทั้งหมด | กลาง |

## จุดที่ควรแก้ก่อนทำ route ใหม่

แนะนำแก้สิ่งเหล่านี้ก่อน เพราะมีผลต่อการใช้งาน API ปัจจุบัน:

1. Mount product routes ใน `src/server.js`
2. แก้ `router.get('products', ...)` เป็น `router.get('/products', ...)`
3. เปิดและแก้ `POST /products`
4. แก้ `createProduct` ให้ field ตรงกับ schema เช่น `releaseDate`, `status`
5. ตรวจ schema ของ `wishlist` และ `collection` ให้ตรงกับ controller เพราะ controller ใช้ `.populate('wishlist.product_id')` แต่ schema ตอนนี้เป็น array ของ ObjectId ตรง ๆ
6. พิจารณาเปลี่ยนชื่อ admin route จาก `/admin/getUserInfo` เป็น `/admin/users` เพื่อให้อ่านง่ายและเป็น REST มากขึ้น
7. เพิ่ม validation ของ request body ให้ชัด เช่น product price, type, stock, track preview duration

## Suggested Milestone

### Milestone 1: ให้ browse/shop ใช้งานได้

- Fix product router
- `GET /products`
- `GET /products/:productId`
- `GET /artists/:artistId`
- `GET /artists/:artistId/products`

### Milestone 2: ให้ artist ลงขายของได้

- `POST /products`
- `PUT /products/:productId`
- `POST /tracks`
- `POST /products/:productId/tracks`
- product status draft/published

### Milestone 3: ให้ user ซื้อและเก็บของได้

- `POST /orders`
- `POST /orders/:orderId/pay`
- `POST /orders/:orderId/confirm`
- `GET /collection`
- full stream/download policy

### Milestone 4: Admin และ polish

- `/admin/users`
- `/admin/products`
- role management
- order dashboard
- soft delete/archive
