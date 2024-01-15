import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
// 1. เลือกชื่อ collection ข้อมูลที่จะไปทำงาน (MongoDB จะเก็บข้อมูลเป็น collections)
// const collection = db.collection("products");
// ใช่ .ObjectId สร้างparam เพื่อดูการอัพเดท
// const productId = ObjectId(req.params.productId);

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const category = req.query.category;
  const keywords = req.query.keyword;
  const query = {};
  const time = new Date();

  if (category) {
    query.category = new RegExp(category, "i"); // ไม่นับพิมพ์เล็กหรือพิมพ์ใหญ่
  }
  if (keywords) {
    query.name = new RegExp(keywords, "i");
  }

  const products = await collection.find(query).sort({ time: -1 }).toArray();
  return res.json({ data: products });
});

/*const displayTime = (createTime) => {
  const date = new Date(createTime);
  const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  ];
  
  return `${date.getDate()} ${
  months[date.getMonth()]
  } ${date.getFullYear()} ${date.toLocaleTimeString()}`;
  };
*/

/*productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const page = req.query.page;
  const limit = req.query.limit;
  const products = await collection
    .aggregate([
      { $skip: Number(limit) * page },
      { $limit: Number(req.query.limit) },
    ])
    .toArray();
  // const products = await collection.find({}).limit(10).toArray();

  return res.json({ data: products });
});*/

productRouter.get("/:id", (req, res) => {});

productRouter.post("/", async (req, res) => {
  // Backend สร้างข้อมูลให้ส่ง time กลับไปด้วย
  const collection = db.collection("products");
  // 2. เพิ่มข้อมูลลง database โดยใช้คำสั่ง .insertOne
  try {
    // 3. สร้างตัวแปรมารับค่าเวลา เพื่อเอามา sort
    const time = new Date();
    const productData = { ...req.body };
    const products = await collection.insertOne({ ...productData, time });

    // 4. return response กลับไปหา Client
    return res.json({
      message: `Product has (${products.productId}) been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `ERROR`,
    });
  }
});

productRouter.put("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.productId);
  const newProductData = { ...req.body };
  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: newProductData,
    }
  );
  return res.json({
    message: `Product item (${productId}) has been updated successfully`,
  });
});

productRouter.delete("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.productId);
  // console.log(productId);

  await collection.deleteOne({
    _id: productId,
  });
  return res.json({
    message: `Product item (${productId}) has been deleted successfully`,
  });
});

export default productRouter;
